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

export async function generateAiReply(options: GenerateReplyOptions): Promise<string | null> {
  const { organizationId, customerName = 'Customer', incomingText, conversationHistory = [], forceGenerate = false } = options;

  try {
    // Check if organization has AI enabled
    const [org] = await db.select({ aiEnabled: organizations.aiEnabled })
      .from(organizations)
      .where(eq(organizations.id, organizationId))
      .limit(1);

    if (org && !org.aiEnabled && !forceGenerate) {
      console.log(`[AI Service] Org #${organizationId} has AI disabled globally.`);
      return null;
    }

    // Get organization AI settings
    const [settings] = await db.select().from(aiSettings)
      .where(eq(aiSettings.organizationId, organizationId))
      .limit(1);

    if (!settings) {
      console.log(`[AI Service] Org #${organizationId} has no AI settings row.`);
      return null;
    }

    if (!settings.autoReply && !forceGenerate) {
      console.log(`[AI Service] Org #${organizationId} autoReply is set to false. Enable in AI Settings to auto-reply.`);
      return null;
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
    const model = (settings.model || 'llama3').trim();
    const temperature = Number(settings.temperature) || 0.7;

    console.log(`[AI Service] Generating response for org #${organizationId} using provider: [${provider}], model: [${model}]`);

    // Handle Ollama
    if (provider === 'ollama') {
      const baseUrl = (settings.baseUrl || 'http://localhost:11434').trim().replace(/\/+$/, '');
      const historyPrompt = conversationHistory
        .map(h => `${h.sender}: ${h.text}`)
        .join('\n');

      const fullPrompt = `${fullSystemInstruction}\n\n${historyPrompt ? `Recent conversation:\n${historyPrompt}\n` : ''}${customerName}: ${incomingText}\nAssistant:`;

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
        console.warn(`[AI Service] Ollama API call returned status ${res.status}: ${errText}`);
        return null;
      }

      const data = await res.json() as { response?: string };
      return data.response ? data.response.trim() : null;
    }

    // Handle Cloud OpenAI-compatible API (Groq, OpenAI, DeepSeek, OpenRouter, Custom)
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
      // Custom OpenAI Compatible or user custom URL
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

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(settings.apiKey ? { Authorization: `Bearer ${settings.apiKey}` } : {}),
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
      console.warn(`[AI Service] API call to ${endpoint} returned status ${res.status}: ${errText}`);
      return null;
    }

    const data = await res.json() as { choices?: Array<{ message?: { content?: string } }> };
    const reply = data.choices?.[0]?.message?.content;
    console.log(`[AI Service] Successfully generated reply (${reply?.length || 0} chars)`);
    return reply ? reply.trim() : null;
  } catch (err: any) {
    console.error('[AI Service] Error generating AI reply:', err.message || err);
    return null;
  }
}
