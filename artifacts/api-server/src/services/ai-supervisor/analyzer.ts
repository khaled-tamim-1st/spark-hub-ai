import { db } from '@workspace/db';
import { aiSettings, contacts } from '@workspace/db';
import { eq } from 'drizzle-orm';
import { DecisionZodSchema } from './decision-schema.js';
import { buildSupervisorPrompt } from './prompts.js';
import {
  DEFAULT_FEATURE_FLAGS,
  shouldExecuteEscalation,
  shouldExecuteDealUpsert,
  shouldExecuteCustomerEnrichment,
  filterAllowedTags,
} from './rules.js';
import {
  executeEscalationAction,
  executeDealUpsertAction,
  executeCustomerEnrichmentAction,
  executeTaggingAction,
} from './action-executor.js';
import { recordSupervisorAuditEvent } from './audit.js';
import { SupervisorInspectionInput, SupervisorExecutionSummary, SupervisorDecision } from './types.js';

const GROQ_SUPERVISOR_MODELS = [
  'openai/gpt-oss-120b',
  'openai/gpt-oss-20b',
  'groq/compound',
  'groq/compound-mini',
];

/**
 * Core Analyzer: Takes an incoming message event, analyzes via Groq with JSON mode,
 * validates against Zod schema, applies rules, executes actions, and audits.
 */
export async function analyzeAndSupervise(
  input: SupervisorInspectionInput
): Promise<SupervisorExecutionSummary> {
  const startTime = Date.now();
  const idempotencyKey = `${input.organizationId}:${input.conversationId}:${input.messageId || Date.now()}`;

  const summary: SupervisorExecutionSummary = {
    idempotencyKey,
    analyzed: false,
    escalated: false,
    dealCreatedOrUpdated: false,
    customerEnriched: false,
    tagsApplied: [],
    latencyMs: 0,
  };

  try {
    // 1. Resolve API Key for Groq
    let [settings] = input.organizationId
      ? await db.select().from(aiSettings).where(eq(aiSettings.organizationId, input.organizationId)).limit(1)
      : [null];

    if (!settings?.apiKey || settings.apiKey.trim().length < 5) {
      const allRows = await db.select().from(aiSettings);
      const configured = allRows.find(r => r.apiKey && r.apiKey.trim().length > 10 && !r.apiKey.includes('••••'));
      if (configured) {
        settings = { ...(settings || {}), ...configured } as any;
      }
    }

    const apiKey = settings?.apiKey || process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.warn('[AI Supervisor] No Groq API Key found, skipping inspection.');
      summary.error = 'No Groq API key available';
      return summary;
    }

    // 2. Build Prompt
    const historyFormatted = (input.conversationHistory || [])
      .map(h => `${h.sender}: ${h.text}`)
      .join('\n');

    const promptText = buildSupervisorPrompt({
      incomingText: input.incomingText,
      customerName: input.customerName,
      historyText: historyFormatted,
    });

    // 3. Call Groq with JSON Mode and Model Retry
    let rawJsonResponse: string | null = null;
    let usedModel = GROQ_SUPERVISOR_MODELS[0];

    for (const candidateModel of GROQ_SUPERVISOR_MODELS) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey.trim()}`,
          },
          body: JSON.stringify({
            model: candidateModel,
            temperature: 0.1, // Low temp for maximum deterministic accuracy
            response_format: { type: 'json_object' },
            messages: [
              {
                role: 'system',
                content: 'You are an AI Operations Supervisor for Arabic e-commerce. Output valid JSON only according to the user instructions.',
              },
              { role: 'user', content: promptText },
            ],
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (res.ok) {
          const data: any = await res.json();
          const content = data.choices?.[0]?.message?.content;
          if (content) {
            rawJsonResponse = content;
            usedModel = candidateModel;
            break;
          }
        }
      } catch {
        // Try next candidate model
      }
    }

    if (!rawJsonResponse) {
      summary.error = 'Failed to get valid response from Groq';
      return summary;
    }

    // 4. Validate output with Zod Schema (Principle 1 & Section 4)
    let parsed: any;
    try {
      parsed = JSON.parse(rawJsonResponse);
    } catch (e: any) {
      summary.error = 'JSON parse error from LLM';
      return summary;
    }

    const validationResult = DecisionZodSchema.safeParse(parsed);
    if (!validationResult.success) {
      console.warn('[AI Supervisor] Schema validation failed:', validationResult.error.issues);
      summary.error = 'Schema validation failed: ' + validationResult.error.issues[0]?.message;
      return summary;
    }

    const decision: SupervisorDecision = validationResult.data as SupervisorDecision;
    summary.analyzed = true;

    // 5. Apply Business Rules & Safety Gates
    const actionsExecuted: string[] = [];

    // Rule A: Smart Escalation
    if (shouldExecuteEscalation(decision, DEFAULT_FEATURE_FLAGS)) {
      const escalated = await executeEscalationAction({
        conversationId: input.conversationId,
        decision,
      });
      if (escalated) {
        summary.escalated = true;
        actionsExecuted.push('escalate');
      }
    }

    // Rule B: Deal Upsert (CRM)
    if (input.contactId && shouldExecuteDealUpsert(decision, DEFAULT_FEATURE_FLAGS)) {
      const dealResult = await executeDealUpsertAction({
        organizationId: input.organizationId,
        contactId: input.contactId,
        conversationId: input.conversationId,
        decision,
      });
      if (dealResult.success) {
        summary.dealCreatedOrUpdated = true;
        summary.dealId = dealResult.dealId;
        actionsExecuted.push('deal_upsert');
      }
    }

    // Rule C: Customer Profile Enrichment
    if (input.contactId) {
      const [existingContact] = await db.select({ firstName: contacts.firstName })
        .from(contacts).where(eq(contacts.id, input.contactId)).limit(1);

      if (shouldExecuteCustomerEnrichment(decision, existingContact?.firstName, DEFAULT_FEATURE_FLAGS)) {
        const enriched = await executeCustomerEnrichmentAction({
          contactId: input.contactId,
          decision,
        });
        if (enriched) {
          summary.customerEnriched = true;
          actionsExecuted.push('enrich_customer');
        }
      }
    }

    // Rule D: Smart Tagging
    if (input.contactId && decision.tags?.length > 0) {
      const allowedTags = filterAllowedTags(decision.tags, DEFAULT_FEATURE_FLAGS);
      if (allowedTags.length > 0) {
        const applied = await executeTaggingAction({
          organizationId: input.organizationId,
          contactId: input.contactId,
          tagsToApply: allowedTags,
        });
        summary.tagsApplied = applied;
        if (applied.length > 0) actionsExecuted.push('tagging');
      }
    }

    // 6. Record Audit Log (Principle 4 & Section 2)
    summary.latencyMs = Date.now() - startTime;
    await recordSupervisorAuditEvent({
      organizationId: input.organizationId,
      conversationId: input.conversationId,
      contactId: input.contactId,
      messageId: input.messageId,
      idempotencyKey,
      model: usedModel,
      decision,
      actionsExecuted,
      status: 'executed',
      latencyMs: summary.latencyMs,
    });

    return summary;
  } catch (err: any) {
    summary.latencyMs = Date.now() - startTime;
    summary.error = err.message || 'Unknown supervisor error';
    console.error('[AI Supervisor] Execution error:', err);
    return summary;
  }
}
