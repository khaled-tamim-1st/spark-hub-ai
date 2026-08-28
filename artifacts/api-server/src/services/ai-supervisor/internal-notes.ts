import { db } from '@workspace/db';
import { messages } from '@workspace/db';

export const CUSTOMER_HANDOFF_TEXT =
  'نعتذر لك عن التجربة 🙏 سيتم تحويلك الآن لأحد أعضاء فريق خدمة العملاء لمساعدتك بشكل مباشر.';

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
