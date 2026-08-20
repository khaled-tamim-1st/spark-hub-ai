import { db } from '@workspace/db';
import { aiSettings, knowledgeDocs, organizations, contacts, conversations } from '@workspace/db';
import { eq, and } from 'drizzle-orm';

export interface VoiceAgentContextOptions {
  organizationId: number;
  contactId?: number;
  conversationId?: number;
  callerNumber?: string;
  customerName?: string;
}

export interface VoiceAgentContextResult {
  systemPrompt: string;
  voiceName: 'alloy' | 'echo' | 'shimmer' | 'ash' | 'ballad' | 'coral' | 'sage' | 'verse';
  temperature: number;
  openaiApiKey: string | null;
  organizationName: string;
  customerName: string;
}

/**
 * Builds the exact system prompt & customer context for Voice AI,
 * reusing the same Knowledge Base, AI settings, and Customer Data from the text AI Agent.
 */
export async function buildVoiceAgentContext(options: VoiceAgentContextOptions): Promise<VoiceAgentContextResult> {
  const { organizationId, contactId, callerNumber, customerName } = options;

  // 1. Fetch organization details
  const [org] = await db.select()
    .from(organizations)
    .where(eq(organizations.id, organizationId))
    .limit(1);

  const orgName = org?.name || 'Spark Hub Enterprise';

  // 2. Fetch contact info if available
  let resolvedCustomerName = customerName || 'العميل';
  let contactContext = '';
  if (contactId) {
    const [c] = await db.select().from(contacts).where(eq(contacts.id, contactId)).limit(1);
    if (c) {
      resolvedCustomerName = `${c.firstName} ${c.lastName}`.trim() || resolvedCustomerName;
      contactContext = `بيانات العميل المتصل:
- الاسم: ${c.firstName} ${c.lastName}
- رقم الهاتف: ${c.phone || callerNumber || 'غير متوفر'}
- البريد الإلكتروني: ${c.email || 'غير متوفر'}
- الشركة: ${c.companyName || 'غير متوفر'}`;
    }
  } else if (callerNumber) {
    // Try finding contact by phone
    const [c] = await db.select().from(contacts)
      .where(and(eq(contacts.organizationId, organizationId), eq(contacts.phone, callerNumber)))
      .limit(1);
    if (c) {
      resolvedCustomerName = `${c.firstName} ${c.lastName}`.trim() || resolvedCustomerName;
      contactContext = `بيانات العميل المتصل:
- الاسم: ${c.firstName} ${c.lastName}
- رقم الهاتف: ${callerNumber}
- البريد الإلكتروني: ${c.email || 'غير متوفر'}
- الشركة: ${c.companyName || 'غير متوفر'}`;
    }
  }

  // 3. Fetch Knowledge Base Docs for this Organization
  const docs = await db.select({ title: knowledgeDocs.title, content: knowledgeDocs.content })
    .from(knowledgeDocs)
    .where(and(eq(knowledgeDocs.organizationId, organizationId), eq(knowledgeDocs.status, 'ready')))
    .limit(10);

  const kbContext = docs.map(d => `### ${d.title}\n${d.content}`).join('\n\n');

  // 4. Fetch Organization AI Settings
  const [settings] = await db.select().from(aiSettings)
    .where(eq(aiSettings.organizationId, organizationId))
    .limit(1);

  // 5. Check API Key from environment or tenant settings
  let openaiApiKey: string | null = process.env.OPENAI_API_KEY || null;
  if (!openaiApiKey && settings?.provider === 'openai' && settings.apiKey && !settings.apiKey.includes('••••')) {
    openaiApiKey = settings.apiKey;
  }

  const basePrompt = settings?.systemPrompt || 
    'أنت موظف خدمة عملاء ذكي ومحترف ومرحب يعمل لدى الشركة. تجيب عن استفسارات المتصلين صوتياً بأسلوب طبيعي وموجز ولطيف.';

  const fullVoicePrompt = `${basePrompt}

=== معلومات المنظمة ===
اسم المنظمة: ${orgName}

${contactContext ? `=== بيانات المتصل ===\n${contactContext}\n` : ''}
${kbContext ? `=== قاعدة المعرفة والمنتجات (Knowledge Base) ===\n${kbContext}\n==============================\nاستخدم معلومات قاعدة المعرفة أعلاه للإجابة على أي أسئلة تخص الشركة والمنتجات بدقة.\n` : ''}
إرشادات المكالمة الصوتية الفورية (Realtime Voice Guidelines):
1. تحدث بلهجة/لغة طبيعية وسلسة ومختصرة مناسبة للمكالمات الصوتية (تجنب الإجابات الطويلة جداً التي تستغرق وقتاً طويلاً في الاستماع).
2. خاطب المتصل باسمه (${resolvedCustomerName}) بلباقة واحترام.
3. إذا طلب المتصل التحدث مع موظف بشري أو واجه مشكلة تتطلب تصعيداً، أخبره بلطف أنك ستقوم بتحويل طلبه لفريق الدعم أو تسجيل طلب متابعة فوري له.
4. لا تذكر أنك نموذج لغوي أو روبوت ما لم يسأل العميل مباشرة، بل قدم نفسك كممثل خدمة عملاء ذكي للشركة.
5. أجب مباشرة بدون مقدمات رسمية زائدة في كل جملة.`;

  return {
    systemPrompt: fullVoicePrompt,
    voiceName: 'alloy',
    temperature: Number(settings?.temperature ?? 0.7),
    openaiApiKey: openaiApiKey?.trim() || null,
    organizationName: orgName,
    customerName: resolvedCustomerName,
  };
}
