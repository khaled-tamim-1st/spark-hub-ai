import { voiceService } from '../artifacts/api-server/src/services/voice-service.js';
import { db, voiceSessions } from '@workspace/db';
import { sql } from 'drizzle-orm';

interface LoadTestMetrics {
  concurrency: number;
  totalDurationMs: number;
  avgLatencyMs: number;
  p95LatencyMs: number;
  eventLoopLagMs: number;
  heapUsedMb: number;
  rssMb: number;
  failedCalls: number;
  activeSessions: number;
}

async function measureEventLoopLag(): Promise<number> {
  const start = performance.now();
  return new Promise((resolve) => {
    setImmediate(() => {
      resolve(Math.round(performance.now() - start));
    });
  });
}

async function runLoadBenchmark(targetConcurrency: number): Promise<LoadTestMetrics> {
  console.log(`\n▶ Benchmarking ${targetConcurrency} Concurrent Voice Calls...`);
  const latencies: number[] = [];
  const startBenchmark = performance.now();
  let failedCalls = 0;

  const initialMemory = process.memoryUsage();

  const callPromises = Array.from({ length: targetConcurrency }).map(async (_, idx) => {
    const callStart = performance.now();
    try {
      // 1. Inbound Webhook Call Simulation
      const res = await voiceService.handleInboundCall({
        callId: `load_${targetConcurrency}_${idx}_${Date.now()}`,
        from: `+2010${(10000000 + idx).toString().slice(0, 8)}`,
        to: '+20223456789',
        organizationId: 1,
      });

      // 2. Simulate Active Session audio turn
      const session = voiceService.getActiveSession(res.sessionId);
      if (session) {
        session.bridge.appendTranscript({
          role: 'user',
          text: `رسالة اختبار الحمل رقم ${idx}`,
          timestamp: new Date().toISOString(),
        });
      }

      // 3. Terminate Call
      await voiceService.endVoiceSession(res.sessionId, 'completed');

      const duration = performance.now() - callStart;
      latencies.push(duration);
    } catch (err) {
      failedCalls++;
      console.error(`Call #${idx} failed:`, err);
    }
  });

  await Promise.all(callPromises);

  const totalDurationMs = Math.round(performance.now() - startBenchmark);
  latencies.sort((a, b) => a - b);
  const avgLatencyMs = Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length || 0);
  const p95Idx = Math.floor(latencies.length * 0.95);
  const p95LatencyMs = Math.round(latencies[p95Idx] || avgLatencyMs);

  const eventLoopLagMs = await measureEventLoopLag();
  const finalMemory = process.memoryUsage();

  return {
    concurrency: targetConcurrency,
    totalDurationMs,
    avgLatencyMs,
    p95LatencyMs,
    eventLoopLagMs,
    heapUsedMb: Math.round(finalMemory.heapUsed / 1024 / 1024),
    rssMb: Math.round(finalMemory.rss / 1024 / 1024),
    failedCalls,
    activeSessions: voiceService.listActiveSessions().length,
  };
}

async function runFullLoadTestSuite() {
  console.log('=====================================================');
  console.log('🚀 Voice AI Infrastructure High-Concurrency Load Test');
  console.log('=====================================================');

  const results: LoadTestMetrics[] = [];

  // Stage 1: 10 Concurrent Calls
  results.push(await runLoadBenchmark(10));

  // Stage 2: 50 Concurrent Calls
  results.push(await runLoadBenchmark(50));

  // Stage 3: 100 Concurrent Calls
  results.push(await runLoadBenchmark(100));

  console.log('\n=====================================================');
  console.log('📊 CONCURRENCY BENCHMARK RESULTS TABLE');
  console.log('=====================================================');
  console.table(results.map(r => ({
    'Concurrent Calls': r.concurrency,
    'Avg Latency (ms)': `${r.avgLatencyMs} ms`,
    'p95 Latency (ms)': `${r.p95LatencyMs} ms`,
    'Event Loop Lag': `${r.eventLoopLagMs} ms`,
    'Heap Memory': `${r.heapUsedMb} MB`,
    'RSS Memory': `${r.rssMb} MB`,
    'Failed Sessions': r.failedCalls,
    'Active Leak': r.activeSessions,
  })));
  console.log('=====================================================\n');
}

runFullLoadTestSuite().then(() => {
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
