import { db } from '@workspace/db';
import { aiSettings, knowledgeDocs, organizations } from '@workspace/db';
import { eq, and, isNotNull } from 'drizzle-orm';

export interface GenerateReplyOptions {
  organizationId?: number;
  customerName?: string;
  incomingText: string;
  conversationHistory?: Array<{ sender: string; text: string }>;
  forceGenerate?: boolean;
  overrideSettings?: {
    provider?: string;
    model?: string;
    apiKey?: string;
    baseUrl?: string;
    systemPrompt?: string;
    temperature?: number;
    maxTokens?: number;
  };
}

export interface AiServiceResult {
  success: boolean;
  reply?: string;
  error?: string;
}

export async function generateAiReplyDetailed(options: GenerateReplyOptions): Promise<AiServiceResult> {
  const { 
    organizationId, 
    customerName = 'العميل', 
    incomingText, 
    conversationHistory = [], 
    forceGenerate = false,
    overrideSettings 
  } = options;

  try {
    // Check if organization has AI enabled
    if (organizationId) {
      const [org] = await db.select({ aiEnabled: organizations.aiEnabled })
        .from(organizations)
        .where(eq(organizations.id, organizationId))
        .limit(1);

      if (org && !org.aiEnabled && !forceGenerate) {
        const msg = `Organization #${organizationId} has AI disabled globally in SaaS Admin.`;
        console.log(`[AI Service] ${msg}`);
        return { success: false, error: msg };
      }
    }

    // Get organization AI settings
    let [settings] = organizationId ? await db.select().from(aiSettings)
      .where(eq(aiSettings.organizationId, organizationId))
      .limit(1) : [null];

    // Fallback: If this org has no API key or is unconfigured, look for any configured org with a valid API key
    if ((!settings || !settings.apiKey || settings.apiKey.trim().length < 5) && !overrideSettings?.apiKey) {
      const allRows = await db.select().from(aiSettings);
      const configured = allRows.find(r => r.apiKey && r.apiKey.trim().length > 10 && !r.apiKey.includes('••••'));
      if (configured) {
        settings = { ...(settings || {}), ...configured } as any;
      }
    }

    if (!settings && !overrideSettings) {
      const msg = `No AI configuration found. Please configure Groq or OpenAI in SaaS Admin -> Organizations.`;
      console.log(`[AI Service] ${msg}`);
      return { success: false, error: msg };
    }

    if (settings && !settings.autoReply && !forceGenerate && !overrideSettings) {
      const msg = `Auto-reply is currently disabled in AI Settings.`;
      console.log(`[AI Service] ${msg}`);
      return { success: false, error: msg };
    }

    // Fetch knowledge base documents
    let kbContext = '';
    if (organizationId) {
      const docs = await db.select({ title: knowledgeDocs.title, content: knowledgeDocs.content })
        .from(knowledgeDocs)
        .where(and(eq(knowledgeDocs.organizationId, organizationId), eq(knowledgeDocs.status, 'ready')))
        .limit(10);
      kbContext = docs.map(d => `### ${d.title}\n${d.content}`).join('\n\n');
    }

    const defaultPrompt = 'أنت مساعد ذكي ومتخصص لخدمة عملاء المتجر. أجب دائماً بأسلوب مهذب ومحترف وودود وساعد العميل بناءً على بيانات المتجر فقط.';
    const systemPrompt = overrideSettings?.systemPrompt || settings?.systemPrompt || defaultPrompt;

    const fullSystemInstruction = `${systemPrompt}

${kbContext ? `=== قاعدة معرفة المتجر والمنتجات الرسمية (Knowledge Base) ===\n${kbContext}\n============================================================` : 'ملاحظة: لا توجد مستندات إضافية مسجلة حالياً في قاعدة المعرفة.'}

قواعد صارمة للرد ومكافحة الهبد (Strict Accuracy & Anti-Hallucination Rules):
1. الصدق التام وعدم الاختراع: ممنوع منعاً باتاً اختراع أو تأليف أي حسابات، منتجات، أسعار، سياسات، أو عروض من خيالك.
2. الالتزام بقاعدة المعرفة: جميع اقتراحاتك ومعلوماتك للعميل يجب أن تكون مستندة ومطابقة 100% لما هو مذكور فقط في قاعدة المعرفة أعلاه.
3. التعامل مع البيانات غير المتوفرة: إذا سألك العميل عن اقتراح حساب أو منتج غير مذكور في قاعدة المعرفة، لا تؤلف حسابات وهمية؛ بل وضح له بلباقة المنتجات المتاحة فقط أو وجهه لمراجعة رابط المتجر مباشرة.
4. الأسلوب: تحدث بأسلوب سعودي/عربي ودود، راقٍ وموجز وواضح، وخاطب العميل باحترام (اسم العميل: ${customerName}).`;

    const provider = (overrideSettings?.provider || settings?.provider || 'groq').toLowerCase().trim();
    let model = (overrideSettings?.model || settings?.model || '').trim();

    // Groq model fallback chain — ordered by availability (newest/most-available first)
    const GROQ_FALLBACK_MODELS = [
      'llama-3.3-70b-versatile',
      'llama-3.1-70b-versatile',
      'llama3-70b-8192',
      'llama-3.1-8b-instant',
      'llama3-8b-8192',
      'gemma2-9b-it',
      'gemma-7b-it',
    ];

    // Normalize legacy/deprecated Groq model names
    if (provider === 'groq') {
      if (
        !model ||
        model === 'llama3' ||
        model === 'llama3-70b-8192' ||
        model === 'mixtral-8x7b-32768' ||
        model.includes('120b') ||
        model.includes('20b') ||
        model === 'openai/gpt-oss-120b'
      ) {
        model = GROQ_FALLBACK_MODELS[0];
      }
    }

    if (!model) {
      model = provider === 'groq' ? GROQ_FALLBACK_MODELS[0] : 'llama3';
    }

    // Default to low temperature (0.3) for high factual accuracy in ecommerce support
    const temperature = Number(overrideSettings?.temperature ?? settings?.temperature ?? 0.3);

    console.log(`[AI Service] Processing request -> Provider: [${provider}], Model: [${model}]`);

    // 1. Handle Ollama (Local VPS)
    if (provider === 'ollama') {
      const baseUrl = (overrideSettings?.baseUrl || settings?.baseUrl || 'http://localhost:11434').trim().replace(/\/+$/, '');
      const historyPrompt = conversationHistory
        .map(h => `${h.sender}: ${h.text}`)
        .join('\n');

      const fullPrompt = `${fullSystemInstruction}\n\n${historyPrompt ? `Recent conversation:\n${historyPrompt}\n` : ''}${customerName}: ${incomingText}\nAssistant:`;

      try {
        const res = await fetch(`${baseUrl}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model,
            prompt: fullPrompt,
            stream: false,
            options: {
              temperature,
              num_predict: overrideSettings?.maxTokens || settings?.maxTokens || 600,
            },
          }),
        });

        if (!res.ok) {
          const errText = await res.text().catch(() => '');
          return { success: false, error: `Ollama error (${res.status}): ${errText || 'Is Ollama running on VPS?'}` };
        }

        const data = await res.json() as { response?: string };
        return { success: true, reply: (data.response || '').trim() };
      } catch (err: any) {
        return { success: false, error: `Could not connect to local Ollama on ${baseUrl}: ${err.message}` };
      }
    }

    // 2. Cloud Providers (Groq, OpenAI, DeepSeek, OpenRouter, Custom)
    let apiKey = (overrideSettings?.apiKey && !overrideSettings.apiKey.includes('••••')) ? overrideSettings.apiKey.trim() : '';
    if (!apiKey) {
      apiKey = (settings?.apiKey && !settings.apiKey.includes('••••')) ? settings.apiKey.trim() : '';
    }
    if (!apiKey) {
      const allRows = await db.select().from(aiSettings);
      const configured = allRows.find(r => r.apiKey && r.apiKey.trim().length > 10 && !r.apiKey.includes('••••'));
      if (configured) {
        apiKey = configured.apiKey!.trim();
      }
    }
    if (!apiKey) {
      if (provider === 'groq') apiKey = (process.env.GROQ_API_KEY || '').trim();
      else if (provider === 'openai') apiKey = (process.env.OPENAI_API_KEY || '').trim();
      else if (provider === 'deepseek') apiKey = (process.env.DEEPSEEK_API_KEY || '').trim();
    }

    if (!apiKey) {
      return { 
        success: false, 
        error: `Missing API Key for provider [${provider.toUpperCase()}]. Please open SaaS Admin -> Organizations -> Configure AI, and enter your API Token.` 
      };
    }

    let endpoint = '';
    if (provider === 'groq') {
      endpoint = 'https://api.groq.com/openai/v1/chat/completions';
    } else if (provider === 'deepseek') {
      endpoint = 'https://api.deepseek.com/v1/chat/completions';
    } else if (provider === 'openrouter') {
      endpoint = 'https://openrouter.ai/api/v1/chat/completions';
    } else if (provider === 'openai') {
      endpoint = 'https://api.openai.com/v1/chat/completions';
    } else {
      const cleanUrl = (overrideSettings?.baseUrl || settings?.baseUrl || '').trim().replace(/\/+$/, '');
      if (cleanUrl.endsWith('/v1')) {
        endpoint = `${cleanUrl}/chat/completions`;
      } else if (cleanUrl.includes('/chat/completions')) {
        endpoint = cleanUrl;
      } else {
        endpoint = cleanUrl ? `${cleanUrl}/v1/chat/completions` : 'https://api.openai.com/v1/chat/completions';
      }
    }

    const messages = [
      { role: 'system', content: fullSystemInstruction },
      ...conversationHistory.map(h => ({
        role: h.sender === 'Customer' ? 'user' : 'assistant',
        content: h.text,
      })),
      { role: 'user', content: incomingText },
    ];

    try {
      // For Groq, build a list of models to try (configured model first, then fallbacks)
      const modelsToTry: string[] = provider === 'groq'
        ? [model, ...GROQ_FALLBACK_MODELS.filter(m => m !== model)]
        : [model];

      for (const tryModel of modelsToTry) {
        console.log(`[AI Service] Trying Provider: [${provider}], Model: [${tryModel}]`);
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: tryModel,
            messages,
            temperature,
            max_tokens: overrideSettings?.maxTokens || settings?.maxTokens || 800,
          }),
        });

        if (!res.ok) {
          const errText = await res.text().catch(() => '');
          let parsedMessage = errText;
          try {
            const json = JSON.parse(errText);
            parsedMessage = json.error?.message || json.message || errText;
          } catch {}
          console.warn(`[AI Service] API error from ${endpoint} [${res.status}]: ${parsedMessage}`);

          // If model not found (404), try next model in fallback chain
          if (res.status === 404 && provider === 'groq') {
            continue;
          }
          return { success: false, error: `${provider.toUpperCase()} Error (${res.status}): ${parsedMessage}` };
        }

        const data = await res.json() as { choices?: Array<{ message?: { content?: string } }> };
        const reply = data.choices?.[0]?.message?.content?.trim();
        if (!reply) {
          return { success: false, error: 'Provider returned an empty response.' };
        }

        console.log(`[AI Service] Generated ${reply.length} chars successfully from [${tryModel}]`);
        return { success: true, reply };
      }

      return { success: false, error: `All Groq models unavailable. Please check your API key or update the model in AI Settings.` };
    } catch (fetchErr: any) {
      console.error(`[AI Service] Network error calling ${endpoint}:`, fetchErr);
      return { success: false, error: `Network error connecting to ${provider}: ${fetchErr.message}` };
    }

  } catch (err: any) {
    console.error('[AI Service] Unexpected error:', err);
    return { success: false, error: err.message || 'Internal AI service error' };
  }
}

export async function generateAiReply(options: GenerateReplyOptions): Promise<string | null> {
  const result = await generateAiReplyDetailed(options);
  return result.success ? (result.reply || null) : null;
}
