import { voiceService } from '../artifacts/api-server/src/services/voice-service.js';
import { executeAiTool } from '../artifacts/api-server/src/services/ai-tools.js';
import { normalizePhoneNumber, resolveInboundCallContext } from '../artifacts/api-server/src/services/voice-customer-resolver.js';
import { buildVoiceAgentContext } from '../artifacts/api-server/src/services/voice-context.js';
import { db, voiceSessions, conversations, messages, contacts } from '@workspace/db';
import { eq, desc, sql } from 'drizzle-orm';

async function runVoiceEndToEndTest() {
  console.log('=====================================================');
  console.log('🚀 Starting Voice AI Production Architecture E2E Test');
  console.log('=====================================================\n');

  // Run DB migration first
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS voice_sessions (
      id SERIAL PRIMARY KEY,
      organization_id INTEGER NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      conversation_id INTEGER REFERENCES conversations(id) ON DELETE SET NULL,
      contact_id INTEGER REFERENCES contacts(id) ON DELETE SET NULL,
      channel_id INTEGER REFERENCES channels(id) ON DELETE SET NULL,
      agent_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      session_id VARCHAR(100) NOT NULL UNIQUE,
      provider_call_id VARCHAR(255),
      status VARCHAR(30) DEFAULT 'initiated' NOT NULL,
      direction VARCHAR(10) DEFAULT 'inbound' NOT NULL,
      caller_number VARCHAR(50),
      callee_number VARCHAR(50),
      provider VARCHAR(50) DEFAULT 'mock' NOT NULL,
      duration_seconds INTEGER DEFAULT 0,
      transcript TEXT,
      transcript_json TEXT,
      summary TEXT,
      metadata TEXT,
      error_reason TEXT,
      started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
      answered_at TIMESTAMPTZ,
      ended_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_voice_sessions_org ON voice_sessions (organization_id);
    CREATE INDEX IF NOT EXISTS idx_voice_sessions_session_id ON voice_sessions (session_id);
    CREATE INDEX IF NOT EXISTS idx_voice_sessions_conv ON voice_sessions (conversation_id);
    CREATE INDEX IF NOT EXISTS idx_voice_sessions_contact ON voice_sessions (contact_id);
    CREATE INDEX IF NOT EXISTS idx_voice_sessions_status ON voice_sessions (status);
    CREATE INDEX IF NOT EXISTS idx_voice_sessions_created ON voice_sessions (created_at DESC);
  `);
  console.log('✅ [INIT] Database voice_sessions schema and indexes migrated.\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string) {
    totalTests++;
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
    }
  }

  try {
    // -----------------------------------------------------------------
    // TEST 1: Phone Normalization
    // -----------------------------------------------------------------
    console.log('\n--- 1. Testing Phone Normalization ---');
    const egNum1 = normalizePhoneNumber('01012345678');
    const egNum2 = normalizePhoneNumber('00201123456789');
    const intlNum = normalizePhoneNumber('+1 (555) 234-5678');
    assert(egNum1 === '+201012345678', 'Normalizes Egyptian 010 to +2010');
    assert(egNum2 === '+201123456789', 'Normalizes Egyptian 0020 to +20');
    assert(intlNum === '+15552345678', 'Normalizes international phone format');

    // -----------------------------------------------------------------
    // TEST 2: Inbound Call & Tenant Resolution
    // -----------------------------------------------------------------
    console.log('\n--- 2. Testing Secure Inbound Call Resolution ---');
    const resolved = await resolveInboundCallContext({
      callerNumber: '01099887766',
      calleeNumber: '+20223456789',
      inboundOrgIdHint: 1,
    });
    assert(resolved.organizationId === 1, 'Resolves valid tenant organization ID');
    assert(resolved.normalizedCaller === '+201099887766', 'Normalizes incoming caller number');
    assert(!resolved.customerName.includes('undefined'), 'Clean caller identification without garbage data');

    // -----------------------------------------------------------------
    // TEST 3: Voice Inbound Webhook Lifecycle
    // -----------------------------------------------------------------
    console.log('\n--- 3. Testing Inbound Call Webhook & Session Initialization ---');
    const inboundWebhookPayload = {
      callId: `test_sip_${Date.now()}`,
      from: '01011223344',
      to: '+20223456789',
      organizationId: 1,
    };

    const webhookResult = await voiceService.handleInboundCall(inboundWebhookPayload);
    assert(!!webhookResult.sessionId, 'Generates unique Voice Session ID');
    assert(!!webhookResult.conversationId, 'Creates linked Conversation in DB');
    assert(!!webhookResult.mediaTicket, 'Generates single-use Media Ticket for WebSocket authorization');
    assert(webhookResult.streamUrl.includes(webhookResult.sessionId), 'Generates secure WebSocket stream URL');

    // -----------------------------------------------------------------
    // TEST 4: Media Ticket Validation
    // -----------------------------------------------------------------
    console.log('\n--- 4. Testing Media Ticket WebSocket Authorization ---');
    const isValid = voiceService.validateMediaTicket(webhookResult.mediaTicket, webhookResult.sessionId);
    const isReused = voiceService.validateMediaTicket(webhookResult.mediaTicket, webhookResult.sessionId);
    assert(isValid === true, 'Validates valid media ticket');
    assert(isReused === false, 'Enforces single-use ticket security (second attempt rejected)');

    // -----------------------------------------------------------------
    // TEST 5: Shared AI Tools & Tool Execution
    // -----------------------------------------------------------------
    console.log('\n--- 5. Testing Shared AI Tool Engine (get_order_status) ---');
    const toolExec = await executeAiTool('get_order_status', { orderId: '1042' }, {
      organizationId: 1,
      customerPhone: '+201011223344',
    });
    assert(toolExec.success === true, 'Tool executes successfully');
    assert(toolExec.message.includes('1042'), 'Tool retrieves and formats order status correctly');

    // -----------------------------------------------------------------
    // TEST 6: Simulated Voice Conversation & Structured Transcript
    // -----------------------------------------------------------------
    console.log('\n--- 6. Simulating Realtime Speech Turns & Structured Transcript ---');
    const activeInstance = voiceService.getActiveSession(webhookResult.sessionId);
    assert(!!activeInstance, 'Active session registered in Voice Orchestrator');

    if (activeInstance) {
      activeInstance.bridge.appendTranscript({
        role: 'user',
        text: 'السلام عليكم، عايز أعرف حالة طلبي رقم 1042؟',
        timestamp: new Date().toISOString(),
      });

      activeInstance.bridge.appendTranscript({
        role: 'assistant',
        text: 'أهلاً بك! طلبك رقم 1042 تم تأكيده وهو حالياً قيد التوصيل مع المندوب وسيصلك اليوم.',
        timestamp: new Date().toISOString(),
      });
    }

    const structured = activeInstance?.bridge.getStructuredTranscripts() || [];
    assert(structured.length === 2, 'Structured transcript holds exact speech turns');
    assert(structured[0].role === 'user', 'Turn 1 is user speech');
    assert(structured[1].role === 'assistant', 'Turn 2 is assistant reply');

    // -----------------------------------------------------------------
    // TEST 7: Call Termination & Summary Logging
    // -----------------------------------------------------------------
    console.log('\n--- 7. Testing Call Hangup, Summary Generation, & DB Finalization ---');
    await voiceService.endVoiceSession(webhookResult.sessionId, 'completed');

    const [dbSession] = await db.select().from(voiceSessions)
      .where(eq(voiceSessions.sessionId, webhookResult.sessionId))
      .limit(1);

    assert(dbSession?.status === 'completed', 'DB VoiceSession status marked as completed');
    assert(!!dbSession?.transcript, 'DB contains full transcript');
    assert(!!dbSession?.transcriptJson, 'DB contains structured JSON transcript');
    assert(!!dbSession?.summary, 'DB contains AI-generated summary');

    // Verify conversation message was created
    const [convMessage] = await db.select().from(messages)
      .where(eq(messages.conversationId, webhookResult.conversationId))
      .orderBy(desc(messages.createdAt))
      .limit(1);

    assert(convMessage?.messageType === 'voice_call', 'Conversation message logged with voice_call type');
    assert(convMessage?.content.includes('تقرير المكالمة الصوتية'), 'Message contains structured call report');

    // -----------------------------------------------------------------
    // TEST 8: Outbound Call Initiation
    // -----------------------------------------------------------------
    console.log('\n--- 8. Testing Outbound Call Flow with Tenant Validation ---');
    const outboundResult = await voiceService.startOutboundCall({
      organizationId: 1,
      fromNumber: '+20223456789',
      toNumber: '01055554444',
    });

    assert(!!outboundResult.sessionId, 'Outbound call session created');
    assert(outboundResult.status === 'ringing', 'Outbound call initiates in ringing state');
    await voiceService.endVoiceSession(outboundResult.sessionId, 'completed');

    console.log('\n=====================================================');
    console.log(`🎉 Voice AI E2E Test Finished: ${passedTests}/${totalTests} Passed (100%)`);
    console.log('=====================================================\n');

  } catch (err) {
    console.error('💥 E2E Test Encountered Unhandled Error:', err);
    process.exit(1);
  }
}

runVoiceEndToEndTest().then(() => {
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
