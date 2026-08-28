import { db } from '@workspace/db';
import { sql } from 'drizzle-orm';

let tableInitialized = false;

/**
 * Ensure `ai_supervisor_events` table exists in PostgreSQL
 */
export async function ensureSupervisorAuditTable(): Promise<void> {
  if (tableInitialized) return;

  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS ai_supervisor_events (
        id SERIAL PRIMARY KEY,
        organization_id INTEGER NOT NULL,
        conversation_id INTEGER NOT NULL,
        contact_id INTEGER,
        message_id VARCHAR(255),
        idempotency_key VARCHAR(255) UNIQUE,
        model VARCHAR(100) NOT NULL,
        sentiment VARCHAR(50),
        human_requested BOOLEAN DEFAULT FALSE,
        should_escalate BOOLEAN DEFAULT FALSE,
        escalation_reason TEXT,
        purchase_intent VARCHAR(50),
        confidence NUMERIC(3, 2),
        decision_json JSONB,
        actions_executed JSONB,
        status VARCHAR(50) DEFAULT 'analyzed',
        error_message TEXT,
        latency_ms INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_supervisor_events_org ON ai_supervisor_events(organization_id);
      CREATE INDEX IF NOT EXISTS idx_supervisor_events_conv ON ai_supervisor_events(conversation_id);
    `);
    tableInitialized = true;
    console.log('[AI Supervisor Audit] Table verified.');
  } catch (err: any) {
    console.warn('[AI Supervisor Audit] Table ensure warning:', err.message);
  }
}

/**
 * Record an audit log for an AI supervisor inspection
 */
export async function recordSupervisorAuditEvent(params: {
  organizationId: number;
  conversationId: number;
  contactId?: number | null;
  messageId?: string | number | null;
  idempotencyKey: string;
  model: string;
  decision: any;
  actionsExecuted: string[];
  status: 'executed' | 'skipped' | 'failed';
  errorMessage?: string;
  latencyMs: number;
}): Promise<void> {
  await ensureSupervisorAuditTable();

  try {
    const {
      organizationId,
      conversationId,
      contactId,
      messageId,
      idempotencyKey,
      model,
      decision,
      actionsExecuted,
      status,
      errorMessage,
      latencyMs,
    } = params;

    await db.execute(sql`
      INSERT INTO ai_supervisor_events (
        organization_id, conversation_id, contact_id, message_id,
        idempotency_key, model, sentiment, human_requested,
        should_escalate, escalation_reason, purchase_intent,
        confidence, decision_json, actions_executed, status,
        error_message, latency_ms
      ) VALUES (
        ${organizationId}, ${conversationId}, ${contactId ?? null}, ${messageId ? String(messageId) : null},
        ${idempotencyKey}, ${model}, ${decision?.sentiment || null}, ${decision?.humanRequested || false},
        ${decision?.escalation?.shouldEscalate || false}, ${decision?.escalation?.reason || null}, ${decision?.purchaseIntent || null},
        ${decision?.confidence || 0}, ${JSON.stringify(decision || {})}, ${JSON.stringify(actionsExecuted || [])}, ${status},
        ${errorMessage || null}, ${latencyMs}
      )
      ON CONFLICT (idempotency_key) DO UPDATE SET
        actions_executed = EXCLUDED.actions_executed,
        status = EXCLUDED.status,
        error_message = EXCLUDED.error_message;
    `);
  } catch (err: any) {
    console.error('[AI Supervisor Audit] Failed to record audit log:', err.message);
  }
}

/**
 * Query stats for Dashboard Activity Panel (Section 17)
 */
export async function getSupervisorStats(organizationId: number): Promise<{
  totalAnalyzed: number;
  escalationsCount: number;
  dealsCount: number;
  tagsCount: number;
  averageLatencyMs: number;
}> {
  await ensureSupervisorAuditTable();

  try {
    const result: any = await db.execute(sql`
      SELECT 
        COUNT(*)::int AS total_analyzed,
        COUNT(*) FILTER (WHERE should_escalate = true)::int AS escalations_count,
        COUNT(*) FILTER (WHERE purchase_intent IN ('high_intent', 'ready_to_buy'))::int AS deals_count,
        COALESCE(AVG(latency_ms), 0)::int AS avg_latency
      FROM ai_supervisor_events
      WHERE organization_id = ${organizationId}
        AND created_at >= NOW() - INTERVAL '30 days';
    `);

    const row = result.rows?.[0] || {};
    return {
      totalAnalyzed: Number(row.total_analyzed || 0),
      escalationsCount: Number(row.escalations_count || 0),
      dealsCount: Number(row.deals_count || 0),
      tagsCount: Number(row.escalations_count || 0) + Number(row.deals_count || 0),
      averageLatencyMs: Number(row.avg_latency || 0),
    };
  } catch {
    return {
      totalAnalyzed: 0,
      escalationsCount: 0,
      dealsCount: 0,
      tagsCount: 0,
      averageLatencyMs: 0,
    };
  }
}
