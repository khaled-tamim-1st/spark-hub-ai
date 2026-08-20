import WebSocket from 'ws';
import { db } from '@workspace/db';
import { voiceSessions, conversations, contacts, messages, channels } from '@workspace/db';
import { eq, and, desc } from 'drizzle-orm';
import type { 
  TelephonyProvider, 
  CallInitiateParams, 
  CallDirection, 
  CallStatus, 
  StructuredTranscriptItem,
  CallSummaryMetadata 
} from './voice-telephony-types.js';
import { MockTelephonyProvider } from './telephony-mock-provider.js';
import { GenericSipTelephonyAdapter } from './telephony-generic-sip-adapter.js';
import { buildVoiceAgentContext } from './voice-context.js';
import { OpenAiRealtimeBridge } from './voice-openai-realtime.js';
import { generateAiReplyDetailed } from './ai-service.js';
import { crmManager } from './crm-provider.js';

export interface ActiveVoiceSessionInstance {
  sessionId: string;
  organizationId: number;
  conversationId?: number;
  contactId?: number;
  channelId?: number;
  agentId?: number;
  direction: CallDirection;
  callerNumber: string;
  calleeNumber: string;
  startTime: Date;
  answeredTime?: Date;
  provider: TelephonyProvider;
  bridge: OpenAiRealtimeBridge;
  telephonyStream?: {
    sendAudio: (chunk: Buffer) => void;
    close: () => void;
  };
}

export class VoiceService {
  private providers = new Map<string, TelephonyProvider>();
  private activeSessions = new Map<string, ActiveVoiceSessionInstance>();
  private mediaTickets = new Map<string, { sessionId: string; organizationId: number; expiresAt: number }>();

  constructor() {
    this.registerProvider(new MockTelephonyProvider());
    this.registerProvider(new GenericSipTelephonyAdapter());
  }

  public registerProvider(provider: TelephonyProvider): void {
    this.providers.set(provider.id, provider);
    console.log(`[Voice Service] Registered Telephony Provider: ${provider.name} (${provider.id})`);
  }

  public getProvider(id?: string): TelephonyProvider {
    const defaultId = process.env.TELEPHONY_PROVIDER || 'mock';
    const targetId = id || defaultId;
    const provider = this.providers.get(targetId);
    if (!provider) {
      console.warn(`[Voice Service] Provider '${targetId}' not found. Falling back to 'mock'.`);
      return this.providers.get('mock')!;
    }
    return provider;
  }

  /**
   * Generates a short-lived single-use media ticket for WebSocket stream authorization
   */
  public generateMediaTicket(sessionId: string, organizationId: number): string {
    const ticket = `vmt_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    this.mediaTickets.set(ticket, {
      sessionId,
      organizationId,
      expiresAt: Date.now() + 60_000, // 1 minute expiry
    });
    return ticket;
  }

  /**
   * Validates media ticket
   */
  public validateMediaTicket(ticket: string, sessionId: string): boolean {
    const entry = this.mediaTickets.get(ticket);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt || entry.sessionId !== sessionId) {
      this.mediaTickets.delete(ticket);
      return false;
    }
    this.mediaTickets.delete(ticket);
    return true;
  }

  /**
   * Start an outbound call to a customer
   */
  public async startOutboundCall(params: CallInitiateParams & { providerId?: string }): Promise<{
    sessionId: string;
    conversationId: number;
    status: CallStatus;
    mediaTicket: string;
  }> {
    const provider = this.getProvider(params.providerId);
    const sessionId = `voice_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // 1. Resolve Contact
    let contactId = params.contactId;
    if (!contactId && params.toNumber) {
      const [existingContact] = await db.select().from(contacts)
        .where(and(eq(contacts.organizationId, params.organizationId), eq(contacts.phone, params.toNumber)))
        .limit(1);

      if (existingContact) {
        contactId = existingContact.id;
      }
    }

    // 2. Find or create Conversation
    let conversationId = params.conversationId;
    if (!conversationId) {
      const [newConv] = await db.insert(conversations).values({
        organizationId: params.organizationId,
        channelType: 'voice',
        contactId: contactId || undefined,
        subject: `مكالمة صوتية صادرة - ${params.toNumber}`,
        status: 'open',
        aiHandled: true,
      }).returning();
      conversationId = newConv?.id;
    }

    // 3. Initiate Call Signaling on Telephony Provider
    const { callId, status } = await provider.initiateCall(params);

    // 4. Create Voice Session in DB
    await db.insert(voiceSessions).values({
      sessionId,
      organizationId: params.organizationId,
      conversationId: conversationId || undefined,
      contactId: contactId || undefined,
      agentId: params.agentId || undefined,
      providerCallId: callId,
      status,
      direction: 'outbound',
      callerNumber: params.fromNumber,
      calleeNumber: params.toNumber,
      provider: provider.id,
      metadata: JSON.stringify(params.metadata || {}),
    });

    // 5. Initialize AI Context with Tool Context
    const context = await buildVoiceAgentContext({
      organizationId: params.organizationId,
      contactId,
      callerNumber: params.fromNumber,
    });

    const bridge = new OpenAiRealtimeBridge({
      apiKey: context.openaiApiKey || '',
      systemPrompt: context.systemPrompt,
      voice: context.voiceName,
      temperature: context.temperature,
      inputFormat: provider.defaultAudioFormat,
      outputFormat: provider.defaultAudioFormat,
      toolContext: {
        organizationId: params.organizationId,
        contactId,
        conversationId,
        customerPhone: params.toNumber,
        customerName: context.customerName,
      },
    });

    const instance: ActiveVoiceSessionInstance = {
      sessionId,
      organizationId: params.organizationId,
      conversationId,
      contactId,
      agentId: params.agentId,
      direction: 'outbound',
      callerNumber: params.fromNumber,
      calleeNumber: params.toNumber,
      startTime: new Date(),
      provider,
      bridge,
    };

    this.activeSessions.set(sessionId, instance);
    this.setupBridgeEvents(instance);

    const mediaTicket = this.generateMediaTicket(sessionId, params.organizationId);

    return {
      sessionId,
      conversationId: conversationId!,
      status,
      mediaTicket,
    };
  }

  /**
   * Handle an inbound call from Telephony Gateway Webhook
   */
  public async handleInboundCall(reqBody: any, headers?: Record<string, any>, providerId?: string): Promise<{
    sessionId: string;
    conversationId: number;
    mediaTicket: string;
    streamUrl: string;
  }> {
    const provider = this.getProvider(providerId);
    const parsed = await provider.verifyAndParseInboundWebhook(reqBody, headers);

    if (!parsed) {
      throw new Error('Invalid inbound webhook or unauthorized signature');
    }

    const sessionId = `voice_in_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // 1. Create Conversation
    const [conv] = await db.insert(conversations).values({
      organizationId: parsed.organizationId,
      channelId: parsed.channelId,
      contactId: parsed.contactId,
      channelType: 'voice',
      subject: `مكالمة صوتية واردة من ${parsed.callerNumber}`,
      status: 'open',
      aiHandled: true,
    }).returning();

    // 2. Create Voice Session in DB
    await db.insert(voiceSessions).values({
      sessionId,
      organizationId: parsed.organizationId,
      conversationId: conv?.id,
      contactId: parsed.contactId,
      channelId: parsed.channelId,
      providerCallId: parsed.callId,
      status: 'ringing',
      direction: 'inbound',
      callerNumber: parsed.callerNumber,
      calleeNumber: parsed.calleeNumber,
      provider: provider.id,
      metadata: JSON.stringify(parsed.metadata || {}),
    });

    // 3. Initialize AI Context & Realtime Bridge with Tools
    const context = await buildVoiceAgentContext({
      organizationId: parsed.organizationId,
      contactId: parsed.contactId,
      callerNumber: parsed.callerNumber,
    });

    const bridge = new OpenAiRealtimeBridge({
      apiKey: context.openaiApiKey || '',
      systemPrompt: context.systemPrompt,
      voice: context.voiceName,
      temperature: context.temperature,
      inputFormat: provider.defaultAudioFormat,
      outputFormat: provider.defaultAudioFormat,
      toolContext: {
        organizationId: parsed.organizationId,
        contactId: parsed.contactId,
        conversationId: conv?.id,
        customerPhone: parsed.callerNumber,
        customerName: context.customerName,
      },
    });

    const instance: ActiveVoiceSessionInstance = {
      sessionId,
      organizationId: parsed.organizationId,
      conversationId: conv?.id,
      contactId: parsed.contactId,
      channelId: parsed.channelId,
      direction: 'inbound',
      callerNumber: parsed.callerNumber,
      calleeNumber: parsed.calleeNumber,
      startTime: new Date(),
      provider,
      bridge,
    };

    this.activeSessions.set(sessionId, instance);
    this.setupBridgeEvents(instance);

    const mediaTicket = this.generateMediaTicket(sessionId, parsed.organizationId);

    return {
      sessionId,
      conversationId: conv?.id!,
      mediaTicket,
      streamUrl: `/api/voice/ws/${sessionId}?ticket=${mediaTicket}`,
    };
  }

  /**
   * Connects the Media Stream (from SIP RTP Media Gateway or WebSocket)
   */
  public async attachMediaWebSocket(sessionId: string, ws: WebSocket): Promise<void> {
    const instance = this.activeSessions.get(sessionId);
    if (!instance) {
      console.warn(`[Voice Service] Session ${sessionId} not found for media stream attachment.`);
      ws.close(1008, 'Session not found');
      return;
    }

    try {
      console.log(`[Voice Service] Attaching media stream for session: ${sessionId}`);

      // 1. Connect to OpenAI Realtime
      if (instance.bridge) {
        await instance.bridge.connect();
      }

      // 2. Setup Telephony Audio Stream
      const telephonyStream = (instance.provider as any).handleMediaStream(sessionId, ws, (chunk: Buffer) => {
        instance.bridge.sendAudioChunk(chunk);
      });

      instance.telephonyStream = telephonyStream;
      instance.answeredTime = new Date();

      // 3. Forward OpenAI voice response back to Telephony stream
      instance.bridge.on('audio.delta', (audioBuffer: Buffer) => {
        telephonyStream.sendAudio(audioBuffer);
      });

      // Update DB session status to in_progress
      await db.update(voiceSessions)
        .set({ status: 'in_progress', answeredAt: instance.answeredTime, updatedAt: new Date() })
        .where(eq(voiceSessions.sessionId, sessionId));

      setTimeout(() => {
        instance.bridge.triggerInitialGreeting();
      }, 400);

      ws.on('close', () => {
        console.log(`[Voice Service] Media stream closed for session: ${sessionId}`);
        this.endVoiceSession(sessionId, 'completed');
      });

    } catch (err: any) {
      console.error(`[Voice Service] Error attaching media stream for session ${sessionId}:`, err);
      ws.send(JSON.stringify({ event: 'error', error: err.message }));
      await this.endVoiceSession(sessionId, 'failed', err.message);
    }
  }

  private setupBridgeEvents(instance: ActiveVoiceSessionInstance): void {
    instance.bridge.on('speech_started', () => {
      console.log(`[Voice Service] Caller started speaking in session ${instance.sessionId}`);
    });

    instance.bridge.on('error', (err) => {
      console.error(`[Voice Service] Bridge error in session ${instance.sessionId}:`, err.message);
    });
  }

  /**
   * Terminate active voice session, calculate duration, save structured transcript & summary
   */
  public async endVoiceSession(
    sessionId: string, 
    finalStatus: CallStatus = 'completed',
    errorReason?: string
  ): Promise<void> {
    const instance = this.activeSessions.get(sessionId);
    if (!instance) return;

    this.activeSessions.delete(sessionId);

    const endTime = new Date();
    const durationSeconds = Math.max(0, Math.round((endTime.getTime() - instance.startTime.getTime()) / 1000));
    const structuredTranscripts = instance.bridge.getStructuredTranscripts();
    const plainTranscript = instance.bridge.getTranscript();

    console.log(`[Voice Service] Ending session ${sessionId} (${finalStatus}). Duration: ${durationSeconds}s. Structured turns: ${structuredTranscripts.length}`);

    try {
      // 1. Generate post-call summary using existing AI service
      let summary = '';
      if (plainTranscript.trim().length > 10) {
        const summaryRes = await generateAiReplyDetailed({
          organizationId: instance.organizationId,
          customerName: 'Customer',
          incomingText: `يرجى تلخيص هذه المكالمة الهاتفية في نقاط مختصرة مع تحديد النتيجة والمهام:\n\n${plainTranscript}`,
          forceGenerate: true,
        });
        summary = summaryRes.reply || '';
      }

      // 2. Update DB voiceSessions record with structured data
      await db.update(voiceSessions).set({
        status: finalStatus,
        durationSeconds,
        transcript: plainTranscript || 'لا يوجد نص مسجل للمكالمة',
        transcriptJson: JSON.stringify(structuredTranscripts),
        summary: summary || 'تمت المكالمة بنجاح.',
        errorReason: errorReason || null,
        endedAt: endTime,
        updatedAt: endTime,
      }).where(eq(voiceSessions.sessionId, sessionId));

      // 3. Post summary message with structured metadata in conversation
      if (instance.conversationId) {
        const callMetadata: CallSummaryMetadata = {
          voiceSessionId: sessionId,
          provider: instance.provider.id,
          durationSeconds,
          outcome: finalStatus === 'completed' ? 'inquiry_resolved' : 'failed',
          handoffRequired: false,
        };

        const callContent = `📞 **تقرير المكالمة الصوتية (Voice Call Summary)**
- **الحالة:** ${finalStatus === 'completed' ? 'مكتملة بنجاح ✅' : finalStatus}
- **المدة:** ${Math.floor(durationSeconds / 60)} دقيقة و ${durationSeconds % 60} ثانية
- **الطرف الآخر:** ${instance.calleeNumber || instance.callerNumber}

📝 **الملخص:**
${summary || 'تم تسجيل المكالمة.'}

💬 **نص الحوار:**
${plainTranscript || 'لا يوجد نص'}`;

        await db.insert(messages).values({
          conversationId: instance.conversationId,
          senderType: 'ai',
          senderName: 'Voice AI Agent',
          content: callContent,
          messageType: 'voice_call',
          status: 'delivered',
        });

        await db.update(conversations).set({
          lastMessage: `📞 مكالمة صوتية (${durationSeconds}s)`,
          lastMessageAt: endTime,
          updatedAt: endTime,
        }).where(eq(conversations.id, instance.conversationId));
      }

      // 4. Decoupled CRM Activity Synchronization (Local DB + HubSpot)
      try {
        const crm = crmManager.getProvider(process.env.CRM_PROVIDER || 'spark_hub');
        await crm.logCallActivity({
          contactId: instance.contactId,
          phoneNumber: instance.callerNumber || instance.calleeNumber,
          direction: instance.direction === 'inbound' ? 'INBOUND' : 'OUTBOUND',
          durationSeconds,
          status: finalStatus === 'completed' ? 'COMPLETED' : 'FAILED',
          summary,
          transcript: plainTranscript,
          timestamp: endTime,
        }, instance.organizationId);
      } catch (crmErr) {
        console.warn(`[Voice Service] CRM synchronization notice:`, crmErr);
      }

      // 5. Cleanup Bridge & Stream
      instance.bridge.close();
      if (instance.telephonyStream) {
        instance.telephonyStream.close();
      }
    } catch (err) {
      console.error(`[Voice Service] Error finalizing voice session ${sessionId}:`, err);
    }
  }

  public getActiveSession(sessionId: string): ActiveVoiceSessionInstance | undefined {
    return this.activeSessions.get(sessionId);
  }

  public listActiveSessions(): ActiveVoiceSessionInstance[] {
    return Array.from(this.activeSessions.values());
  }
}

export const voiceService = new VoiceService();
