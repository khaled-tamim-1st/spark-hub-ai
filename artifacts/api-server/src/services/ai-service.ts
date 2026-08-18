import { db } from '@workspace/db';
import { aiSettings, knowledgeDocs, organizations } from '@workspace/db';
import { eq, and } from 'drizzle-orm';

export interface GenerateReplyOptions {
  organizationId: number;
  customerName?: string;
  incomingText: string;
  conversationHistory?: Array<{ sender: string; text: string }>;
  forceGenerate?: boolean;
}

export interface AiServiceResult {
  success: boolean;
  reply?: string;
  error?: string;
}

export async function generateAiReplyDetailed(options: GenerateReplyOptions): Promise<AiServiceResult> {
  const { organizationId, customerName = 'Customer', incomingText, conversationHistory = [], forceGenerate = false } = options;

  try {
    // Check if organization has AI enabled
    const [org] = await db.select({ aiEnabled: organizations.aiEnabled })
      .from(organizations)
      .where(eq(organizations.id, organizationId))
      .limit(1);

    if (org && !org.aiEnabled && !forceGenerate) {
      const msg = `Organization #${organizationId} has AI disabled globally in SaaS Admin.`;
      console.log(`[AI Service] ${msg}`);
      return { success: false, error: msg };
    }

    // Get organization AI settings
    const [settings] = await db.select().from(aiSettings)
      .where(eq(aiSettings.organizationId, organizationId))
      .limit(1);

    if (!settings) {
      const msg = `Organization #${organizationId} has no AI configuration yet.`;
      console.log(`[AI Service] ${msg}`);
      return { success: false, error: msg };
    }

    if (!settings.autoReply && !forceGenerate) {
      const msg = `Auto-reply is currently disabled in AI Settings.`;
      console.log(`[AI Service] ${msg}`);
      return { success: false, error: msg };
    }

    // Fetch knowledge base documents
    const docs = await db.select({ title: knowledgeDocs.title, content: knowledgeDocs.content })
      .from(knowledgeDocs)
      .where(and(eq(knowledgeDocs.organizationId, organizationId), eq(knowledgeDocs.status, 'ready')))
      .limit(10);

    const kbContext = docs.map(d => `### Document: ${d.title}\n${d.content}`).join('\n\n');

    const systemPrompt = settings.systemPrompt || 
      'You are a helpful, professional, and friendly customer support AI assistant. Answer clearly and concisely using the provided Knowledge Base when relevant.';

    const fullSystemInstruction = `${systemPrompt}

${kbContext ? `=== COMPANY KNOWLEDGE BASE ===\n${kbContext}\n==============================\n` : ''}
Instructions:
- Address the customer politely (Customer name: ${customerName}).
- Use information from the Knowledge Base if available.
- Keep the response concise, formatted for WhatsApp or live chat (bullet points if needed).
- If you do not know the answer, politely offer to connect them to a human agent.`;

    const provider = (settings.provider || 'ollama').toLowerCase().trim();
    const model = (settings.model || (provider === 'groq' ? 'llama-3.3-70b-versatile' : 'llama3')).trim();
    const temperature = Number(settings.temperature) || 0.7;

    console.log(`[AI Service] Processing for org #${organizationId} -> Provider: [${provider}], Model: [${model}]`);

    // 1. Handle Ollama (Local VPS)
    if (provider === 'ollama') {
      const baseUrl = (settings.baseUrl || 'http://localhost:11434').trim().replace(/\/+$/, '');
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
              num_predict: settings.maxTokens || 600,
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
    const apiKey = (settings.apiKey || '').trim();
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
      const cleanUrl = (settings.baseUrl || '').trim().replace(/\/+$/, '');
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
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens: settings.maxTokens || 800,
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
        return { success: false, error: `${provider.toUpperCase()} Error (${res.status}): ${parsedMessage}` };
      }

      const data = await res.json() as { choices?: Array<{ message?: { content?: string } }> };
      const reply = data.choices?.[0]?.message?.content?.trim();
      if (!reply) {
        return { success: false, error: 'Provider returned an empty response.' };
      }

      console.log(`[AI Service] Generated ${reply.length} chars successfully from [${model}]`);
      return { success: true, reply };
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
  const res = await generateAiReplyDetailed(options);
  return res.success ? (res.reply ?? null) : null;
}
