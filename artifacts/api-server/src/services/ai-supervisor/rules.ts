import { SupervisorDecision, SupervisorFeatureFlags, SupervisorTag } from './types.js';

export const DEFAULT_FEATURE_FLAGS: SupervisorFeatureFlags = {
  ai_supervisor_enabled: true,
  ai_auto_escalation_enabled: true,
  ai_auto_deal_creation_enabled: true,
  ai_auto_tagging_enabled: true,
  ai_customer_enrichment_enabled: true,
};

const ALLOWED_TAGS: Set<SupervisorTag> = new Set([
  'VIP',
  'NEW',
  'RETURNING',
  'PURCHASE_INTENT',
  'HIGH_VALUE',
  'READY_TO_BUY',
  'ANGRY',
  'FRUSTRATED',
  'LATE_SHIPMENT',
  'REFUND_REQUEST',
  'HUMAN_REQUESTED',
]);

/**
 * Business Rule: Check if escalation to human agent is warranted
 * Requires confidence >= 0.70 and explicit trigger (human request, high anger, or critical issue)
 */
export function shouldExecuteEscalation(
  decision: SupervisorDecision,
  flags: SupervisorFeatureFlags = DEFAULT_FEATURE_FLAGS
): boolean {
  if (!flags.ai_supervisor_enabled || !flags.ai_auto_escalation_enabled) {
    return false;
  }

  // Safety confidence gate
  if (decision.confidence < 0.70) {
    return false;
  }

  // Core trigger conditions
  return (
    decision.humanRequested ||
    decision.sentiment === 'angry' ||
    decision.escalation.shouldEscalate === true
  );
}

/**
 * Business Rule: Check if CRM deal upsert is warranted
 * High precision required (confidence >= 0.80 and explicit purchase intent) to avoid polluting CRM
 */
export function shouldExecuteDealUpsert(
  decision: SupervisorDecision,
  flags: SupervisorFeatureFlags = DEFAULT_FEATURE_FLAGS
): boolean {
  if (!flags.ai_supervisor_enabled || !flags.ai_auto_deal_creation_enabled) {
    return false;
  }

  if (decision.confidence < 0.80) {
    return false;
  }

  const highIntent =
    decision.purchaseIntent === 'high_intent' || decision.purchaseIntent === 'ready_to_buy';

  return highIntent && Boolean(decision.deal && decision.deal.detected && decision.deal.title);
}

/**
 * Business Rule: Check if customer info should be enriched
 * Rule: Only enrich if current name is visitor/placeholder or empty. Never overwrite existing verified names!
 */
export function shouldExecuteCustomerEnrichment(
  decision: SupervisorDecision,
  currentContactName?: string | null,
  flags: SupervisorFeatureFlags = DEFAULT_FEATURE_FLAGS
): boolean {
  if (!flags.ai_supervisor_enabled || !flags.ai_customer_enrichment_enabled) {
    return false;
  }

  if (decision.confidence < 0.75) {
    return false;
  }

  const extractedName = decision.customerInfo?.name?.trim();
  if (!extractedName || extractedName.length < 2) {
    return false;
  }

  const nameLower = (currentContactName || '').toLowerCase().trim();
  const isPlaceholder =
    !nameLower ||
    nameLower.includes('زائر') ||
    nameLower.includes('visitor') ||
    nameLower.includes('عميل غير مسجل') ||
    nameLower.includes('user') ||
    nameLower.length < 2;

  return isPlaceholder;
}

/**
 * Business Rule: Filter tags against controlled vocabulary
 */
export function filterAllowedTags(
  tags: string[],
  flags: SupervisorFeatureFlags = DEFAULT_FEATURE_FLAGS
): SupervisorTag[] {
  if (!flags.ai_supervisor_enabled || !flags.ai_auto_tagging_enabled) {
    return [];
  }

  return tags.filter((t): t is SupervisorTag => ALLOWED_TAGS.has(t as SupervisorTag));
}
