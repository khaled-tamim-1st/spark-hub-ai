import type { WebSocket } from 'ws';

export type CallDirection = 'inbound' | 'outbound';
export type CallStatus = 'initiated' | 'ringing' | 'in_progress' | 'completed' | 'busy' | 'failed' | 'no_answer';
export type AudioFormat = 'pcm16' | 'g711_ulaw' | 'g711_alaw' | 'opus';
export type TransportType = 'websocket_media' | 'rtp_media' | 'direct_sip_realtime';

export interface StructuredTranscriptItem {
  role: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string; // ISO String
}

export interface CallSummaryMetadata {
  voiceSessionId: string;
  provider: string;
  durationSeconds: number;
  outcome: 'inquiry_resolved' | 'order_checked' | 'ticket_created' | 'human_handoff' | 'abandoned' | 'failed';
  nextAction?: string;
  handoffRequired?: boolean;
}

export interface CallInitiateParams {
  organizationId: number;
  fromNumber: string;
  toNumber: string;
  contactId?: number;
  conversationId?: number;
  agentId?: number;
  metadata?: Record<string, any>;
}

export interface ResolvedInboundCall {
  callId: string;
  callerNumber: string;
  calleeNumber: string;
  organizationId: number;
  channelId?: number;
  contactId?: number;
  conversationId?: number;
  metadata?: Record<string, any>;
}

export interface TelephonyProvider {
  /** Provider identifier e.g. 'mock', 'generic_sip', 'direct_sip_realtime', 'twilio' */
  readonly id: string;
  readonly name: string;
  readonly transportType: TransportType;
  readonly defaultAudioFormat: AudioFormat;

  /** Initiate outbound signaling */
  initiateCall(params: CallInitiateParams): Promise<{ callId: string; status: CallStatus }>;

  /** Terminate call signaling */
  hangupCall(callId: string): Promise<boolean>;

  /** Securely parse and verify inbound webhook payload & signatures */
  verifyAndParseInboundWebhook(reqBody: any, headers?: Record<string, any>): Promise<ResolvedInboundCall | null>;
}

export interface MediaTransportHandler {
  sendAudio: (chunk: Buffer) => void;
  close: () => void;
}

export interface MediaGateway {
  /** Handle raw media connection (WebSocket or RTP relay) */
  attachMediaStream(
    sessionId: string, 
    connection: WebSocket | any, 
    onAudioIn: (chunk: Buffer) => void
  ): MediaTransportHandler;
}
