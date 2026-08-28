export type CustomerSentiment = 'positive' | 'neutral' | 'frustrated' | 'angry';

export type PurchaseIntentLevel = 'none' | 'inquiry' | 'consideration' | 'high_intent' | 'ready_to_buy';

export type SupervisorTag =
  | 'VIP'
  | 'NEW'
  | 'RETURNING'
  | 'PURCHASE_INTENT'
  | 'HIGH_VALUE'
  | 'READY_TO_BUY'
  | 'ANGRY'
  | 'FRUSTRATED'
  | 'LATE_SHIPMENT'
  | 'REFUND_REQUEST'
  | 'HUMAN_REQUESTED';

export interface SupervisorInspectionInput {
  organizationId: number;
  conversationId: number;
  contactId?: number | null;
  messageId?: number | string | null;
  channelType: string;
  incomingText: string;
  customerName?: string;
  conversationHistory?: Array<{ sender: string; text: string }>;
}

export interface SupervisorDecision {
  sentiment: CustomerSentiment;
  humanRequested: boolean;
  escalation: {
    shouldEscalate: boolean;
    reason: string | null;
    suggestedInternalNote: string | null;
  };
  purchaseIntent: PurchaseIntentLevel;
  deal: {
    detected: boolean;
    title: string | null;
    estimatedAmount: number | null;
    currency: string | null;
  } | null;
  customerInfo: {
    name: string | null;
    city: string | null;
  } | null;
  tags: SupervisorTag[];
  confidence: number;
}

export interface SupervisorFeatureFlags {
  ai_supervisor_enabled: boolean;
  ai_auto_escalation_enabled: boolean;
  ai_auto_deal_creation_enabled: boolean;
  ai_auto_tagging_enabled: boolean;
  ai_customer_enrichment_enabled: boolean;
}

export interface SupervisorExecutionSummary {
  idempotencyKey: string;
  analyzed: boolean;
  escalated: boolean;
  dealCreatedOrUpdated: boolean;
  dealId?: number;
  customerEnriched: boolean;
  tagsApplied: string[];
  latencyMs: number;
  error?: string;
}
