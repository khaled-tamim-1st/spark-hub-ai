import { z } from 'zod';

export const DecisionZodSchema = z.object({
  sentiment: z.enum(['positive', 'neutral', 'frustrated', 'angry']),
  humanRequested: z.boolean(),
  escalation: z.object({
    shouldEscalate: z.boolean(),
    reason: z.string().nullable(),
    suggestedInternalNote: z.string().nullable(),
  }),
  purchaseIntent: z.enum(['none', 'inquiry', 'consideration', 'high_intent', 'ready_to_buy']),
  deal: z.object({
    detected: z.boolean(),
    title: z.string().nullable(),
    estimatedAmount: z.number().nullable(),
    currency: z.string().nullable(),
  }).nullable(),
  customerInfo: z.object({
    name: z.string().nullable(),
    city: z.string().nullable(),
  }).nullable(),
  tags: z.array(
    z.enum([
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
    ])
  ),
  confidence: z.number().min(0).max(1),
});

export type DecisionZodType = z.infer<typeof DecisionZodSchema>;
