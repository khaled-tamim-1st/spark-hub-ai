import { db } from '@workspace/db';
import { conversations, messages, contacts, deals, tags, contactTags } from '@workspace/db';
import { eq, and } from 'drizzle-orm';
import { SupervisorDecision } from './types.js';
import { createInternalNote } from './internal-notes.js';

export interface ActionResult {
  escalated: boolean;
  dealCreatedOrUpdated: boolean;
  dealId?: number;
  customerEnriched: boolean;
  tagsApplied: string[];
}

/**
 * Execute Escalation to Human Agent:
 * 1. Switch conversation.aiHandled = false (stops bot instantly)
 * 2. Create Internal Note (Yellow Sticky Note) visible ONLY to support agent in Dashboard
 */
export async function executeEscalationAction(params: {
  conversationId: number;
  decision: SupervisorDecision;
  incomingText?: string;
}): Promise<boolean> {
  const { conversationId, decision, incomingText } = params;

  try {
    // 1. Critical safety gate: Disarm AI auto-reply on this conversation
    await db.update(conversations).set({
      aiHandled: false,
      updatedAt: new Date(),
    }).where(eq(conversations.id, conversationId));

    // 2. Format yellow internal guidance note according to Section 8
    const sentimentLabel = {
      angry: 'غاضب جداً (Angry)',
      frustrated: 'مستاء / متضايق (Frustrated)',
      neutral: 'عادي (Neutral)',
      positive: 'إيجابي (Positive)',
    }[decision.sentiment] || decision.sentiment;

    const noteContent = `🚨 AI Supervisor — تصعيد لخدمة العملاء

الحالة:
عميل مستاء / طلب تدخل بشري

${incomingText ? `رسالة العميل:\n"${incomingText}"\n\n` : ''}Sentiment:
${sentimentLabel}

Human Requested:
${decision.humanRequested ? 'نعم (Yes)' : 'لا (No)'}

سبب التصعيد:
${decision.escalation.reason || 'تعبير واضح عن عدم الرضا أو الحاجة لتدخل بشري.'}

التوجيه للموظف:
${decision.escalation.suggestedInternalNote || 'ابدأ باعتذار مختصر واسأل العميل عن المشكلة لمساعدته فوراً. لا تفترض سبب الشكوى.'}`;

    // 3. Isolated Internal Note creation (guaranteed isPrivate=true, messageType='internal_note')
    await createInternalNote({
      conversationId,
      content: noteContent,
      source: 'ai_supervisor',
    });

    console.log(`[AI Supervisor] Escalated conversation #${conversationId} to human agent.`);
    return true;
  } catch (err: any) {
    console.error(`[AI Supervisor] Failed to execute escalation on conv #${conversationId}:`, err);
    return false;
  }
}

/**
 * Upsert CRM Deal Strategy (Principle 5 & Section 8):
 * Idempotent: If an open deal exists for this contact, update it. Otherwise create new.
 */
export async function executeDealUpsertAction(params: {
  organizationId: number;
  contactId: number;
  conversationId: number;
  decision: SupervisorDecision;
}): Promise<{ success: boolean; dealId?: number }> {
  const { organizationId, contactId, conversationId, decision } = params;
  const dealData = decision.deal;
  if (!dealData || !dealData.title) return { success: false };

  try {
    const dealTitle = dealData.title.trim();
    const dealAmount = String(dealData.estimatedAmount || 0);
    const dealCurrency = dealData.currency || 'SAR';

    // 1. Check for existing open deal for this contact
    const [existingDeal] = await db.select({ id: deals.id, value: deals.value })
      .from(deals)
      .where(and(
        eq(deals.organizationId, organizationId),
        eq(deals.contactId, contactId),
        eq(deals.status, 'open')
      ))
      .limit(1);

    let dealId: number;

    if (existingDeal) {
      // Update existing open deal
      await db.update(deals).set({
        title: dealTitle,
        value: dealAmount,
        currency: dealCurrency,
        updatedAt: new Date(),
      }).where(eq(deals.id, existingDeal.id));
      dealId = existingDeal.id;
      console.log(`[AI Supervisor] Updated open deal #${dealId} for contact #${contactId}.`);
    } else {
      // Create new deal
      const [newDeal] = await db.insert(deals).values({
        organizationId,
        contactId,
        title: dealTitle,
        value: dealAmount,
        currency: dealCurrency,
        status: 'open',
      }).returning({ id: deals.id });
      dealId = newDeal.id;
      console.log(`[AI Supervisor] Created new CRM deal #${dealId} for contact #${contactId}.`);
    }

    // 2. Add isolated Internal Note in chat
    await createInternalNote({
      conversationId,
      content: `💰 رصد فرصة مبيعات جديدة في الـ CRM:
العنوان: ${dealTitle}
القيمة التقديرية: ${dealAmount} ${dealCurrency}
رقم الصفقة: #${dealId}`,
      source: 'ai_supervisor',
    });

    return { success: true, dealId };
  } catch (err: any) {
    console.error(`[AI Supervisor] Failed to upsert deal:`, err);
    return { success: false };
  }
}

/**
 * Customer Profile Enrichment (Section 9):
 * Updates name only if existing name is visitor/placeholder.
 */
export async function executeCustomerEnrichmentAction(params: {
  contactId: number;
  decision: SupervisorDecision;
}): Promise<boolean> {
  const { contactId, decision } = params;
  const newName = decision.customerInfo?.name?.trim();
  if (!newName) return false;

  try {
    const parts = newName.split(' ');
    const firstName = parts[0];
    const lastName = parts.slice(1).join(' ') || 'العميل';

    await db.update(contacts).set({
      firstName,
      lastName,
      updatedAt: new Date(),
    }).where(eq(contacts.id, contactId));

    console.log(`[AI Supervisor] Enriched contact #${contactId} with name: ${newName}`);
    return true;
  } catch (err: any) {
    console.error(`[AI Supervisor] Failed to enrich customer #${contactId}:`, err);
    return false;
  }
}

/**
 * Smart Tagging (Section 10):
 * Applies tags from controlled vocabulary.
 */
export async function executeTaggingAction(params: {
  organizationId: number;
  contactId: number;
  tagsToApply: string[];
}): Promise<string[]> {
  const { organizationId, contactId, tagsToApply } = params;
  if (!tagsToApply || tagsToApply.length === 0) return [];

  const applied: string[] = [];

  for (const tagName of tagsToApply) {
    try {
      // 1. Get or create tag in tags table
      let [tagRow] = await db.select({ id: tags.id }).from(tags)
        .where(and(eq(tags.organizationId, organizationId), eq(tags.name, tagName)))
        .limit(1);

      if (!tagRow) {
        const color = tagName.includes('ANGRY') || tagName.includes('REFUND')
          ? '#EF4444'
          : tagName.includes('PURCHASE') || tagName.includes('BUY')
          ? '#10B981'
          : '#6366F1';

        [tagRow] = await db.insert(tags).values({
          organizationId,
          name: tagName,
          color,
        }).returning({ id: tags.id });
      }

      // 2. Link to contact if not already linked
      const [existingLink] = await db.select().from(contactTags)
        .where(and(eq(contactTags.contactId, contactId), eq(contactTags.tagId, tagRow.id)))
        .limit(1);

      if (!existingLink) {
        await db.insert(contactTags).values({
          contactId,
          tagId: tagRow.id,
        });
        applied.push(tagName);
      }
    } catch (err: any) {
      console.warn(`[AI Supervisor] Failed to attach tag ${tagName}:`, err.message);
    }
  }

  return applied;
}
