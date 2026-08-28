import { db } from '@workspace/db';
import { conversations, messages } from '@workspace/db';
import { eq } from 'drizzle-orm';

export const CUSTOMER_HANDOFF_TEXT =
  'نعتذر لك عن التجربة 🙏 سيتم تحويلك الآن لأحد أعضاء فريق خدمة العملاء لمساعدتك بشكل مباشر.';

export const HUMAN_REQUEST_REPLY =
  'أهلاً بك، تم إيقاف الرد الآلي وتحويل طلبك لفريق خدمة العملاء، وسيتواصل معك أحد الموظفين في أقرب وقت ممكن. 🙏';

/**
 * Fast-path detection for human agent / customer support requests
 */
export function isHumanAgentRequested(text?: string | null): boolean {
  if (!text) return false;
  const t = text.toLowerCase().trim();

  const patterns = [
    /خدم[ةه]\s*العملا[ءإ]/,
    /خدم[ةه]\s*عملا[ءإ]/,
    /عنصر\s*بشر[يى]/,
    /موظف/,
    /بشر[يى]/,
    /إنسان|انسان/,
    /شخص\s*(حقيقي)?/,
    /آدمي|ادمي/,
    /حولن[يى]/,
    /أبغ[يى]\s*(أ)?كلم/,
    /ابغ[يى]\s*(ا)?كلم/,
    /عايز\s*(أ)?كلم/,
    /عاوز\s*(أ)?كلم/,
    /بدي\s*احك[يى]/,
    /تحدث\s*مع/,
    /محادث[ةه]\s*بشر/,
    /اتصال\s*بشر/,
    /\bhuman\b/i,
    /\bagent\b/i,
    /\brepresentative\b/i,
    /\bsupport\s*team\b/i,
    /\breal\s*person\b/i,
  ];

  return patterns.some((p) => p.test(t));
}

/**
 * Immediate Human Handoff Handler (Fast-path):
 * 1. Sets conversation.aiHandled = false
 * 2. Inserts customer-facing reply message: HUMAN_REQUEST_REPLY
 * 3. Inserts yellow Internal Note for dashboard agents
 */
export async function handleImmediateHumanHandoff(params: {
  conversationId: number;
  incomingText: string;
}): Promise<{ handoffMessage: any; internalNote: any }> {
  const { conversationId, incomingText } = params;

  // 1. Stop AI Auto-Reply on this conversation
  await db.update(conversations).set({
    aiHandled: false,
    updatedAt: new Date(),
  }).where(eq(conversations.id, conversationId));

  // 2. Create customer-facing handoff message
  const [handoffMessage] = await db.insert(messages).values({
    conversationId,
    senderType: 'ai',
    senderName: 'فريق خدمة العملاء',
    content: HUMAN_REQUEST_REPLY,
    messageType: 'text',
    isPrivate: false,
    status: 'delivered',
  }).returning();

  // 3. Create isolated yellow Internal Note for support staff
  const internalNote = await createInternalNote({
    conversationId,
    content: `🚨 طلب تحويل لموظف بشري (Human Request Detected)

طلب العميل:
"${incomingText}"

الإجراء التلقائي:
تم إيقاف الرد الآلي فوراً، وإشعار العميل بأن أحد ممثلي خدمة العملاء سيتواصل معه في أقرب وقت.

التوجيه لموظف الدعم:
يرجى متابعة المحادثة والتواصل مع العميل لحل استفساره مباشرة.`,
    source: 'ai_supervisor',
  });

  return { handoffMessage, internalNote };
}

export interface InternalNoteParams {
  conversationId: number;
  content: string;
  source?: 'ai_supervisor' | 'manual_agent';
}

/**
 * 1. Dedicated, Isolated Internal Note Creator:
 * Guarantees that the note is marked as internal_note and isPrivate=true.
 * Internal notes are strictly stored in the database for human agents in Dashboard,
 * and CANNOT be queried by customer widgets or sent via WhatsApp/Meta.
 */
export async function createInternalNote(params: InternalNoteParams): Promise<any> {
  const { conversationId, content, source = 'ai_supervisor' } = params;

  try {
    const [note] = await db.insert(messages).values({
      conversationId,
      senderType: 'system',
      senderName: source === 'ai_supervisor' ? 'المشرف الذكي (AI Supervisor)' : 'ملاحظة داخلية',
      content,
      messageType: 'internal_note',
      isPrivate: true,
      status: 'delivered',
    }).returning();

    console.log(`[Internal Note] Created internal note #${note.id} for conversation #${conversationId} (source: ${source})`);
    return note;
  } catch (err: any) {
    console.error(`[Internal Note] Failed to create internal note for conv #${conversationId}:`, err);
    throw err;
  }
}

/**
 * 2. Central Outbound Safety Guard:
 * Checks if content belongs to an internal note or supervisor alert.
 * Any outbound sender (WhatsApp, Meta, Widget) MUST reject sending this content.
 */
export function isInternalNoteContent(content?: string | null): boolean {
  if (!content) return false;
  const lower = content.toLowerCase();
  return (
    content.includes('🚨 AI Supervisor') ||
    content.includes('AI Supervisor Alert') ||
    content.includes('تنبيه تصعيد ذكي') ||
    content.includes('التوجيه المقترح لموظف الدعم') ||
    content.includes('التوجيه للموظف:') ||
    lower.includes('angierscore') ||
    lower.includes('escalationreason') ||
    lower.includes('internalguidance')
  );
}

/**
 * Central Guard assertion: throws if content is internal
 */
export function assertNotInternalNote(content: string, channelName: string): void {
  if (isInternalNoteContent(content)) {
    const errorMsg = `[CRITICAL SECURITY] Blocked attempt to send internal note to external channel (${channelName})`;
    console.error(errorMsg);
    throw new Error('Internal notes cannot be sent externally');
  }
}
