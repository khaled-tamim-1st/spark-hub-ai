import type { WebSocket } from 'ws';
import type { 
  TelephonyProvider, 
  CallInitiateParams, 
  CallStatus, 
  ResolvedInboundCall, 
  TransportType, 
  AudioFormat 
} from './voice-telephony-types.js';
import { resolveInboundCallContext } from './voice-customer-resolver.js';

export interface GenericSipConfig {
  gatewayUrl?: string;
  webhookSecret?: string;
  defaultAudioFormat?: 'g711_ulaw' | 'pcm16';
}

/**
 * Generic SIP Trunk & Telephony Adapter.
 * Bridges SIP signaling & RTP media streams from standard SIP PBXs (FreeSWITCH, Asterisk, Kamailio, LiveKit SIP)
 * or Egyptian Telecom providers into the Unified Realtime Voice core.
 */
export class GenericSipTelephonyAdapter implements TelephonyProvider {
  public readonly id = 'generic_sip';
  public readonly name = 'Generic SIP / Telephony Gateway Adapter';
  public readonly transportType: TransportType = 'websocket_media';
  public readonly defaultAudioFormat: AudioFormat;

  private gatewayUrl: string;
  private webhookSecret: string;

  constructor(config?: GenericSipConfig) {
    this.gatewayUrl = config?.gatewayUrl || process.env.TELEPHONY_SIP_GATEWAY_URL || 'http://localhost:8080';
    this.webhookSecret = config?.webhookSecret || process.env.TELEPHONY_WEBHOOK_SECRET || '';
    this.defaultAudioFormat = config?.defaultAudioFormat || 'g711_ulaw';
  }

  public async initiateCall(params: CallInitiateParams): Promise<{ callId: string; status: CallStatus }> {
    const callId = `sip_call_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    try {
      if (this.gatewayUrl && !this.gatewayUrl.includes('localhost')) {
        const res = await fetch(`${this.gatewayUrl.replace(/\/+$/, '')}/api/calls`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(this.webhookSecret ? { 'X-Telephony-Secret': this.webhookSecret } : {}),
          },
          body: JSON.stringify({
            callId,
            from: params.fromNumber,
            to: params.toNumber,
            organizationId: params.organizationId,
            metadata: params.metadata,
          }),
        });

        if (!res.ok) {
          const errText = await res.text().catch(() => '');
          console.warn(`[SIP Gateway] Outbound call API status ${res.status}: ${errText}`);
        }
      }
    } catch (err: any) {
      console.warn(`[SIP Gateway] External gateway notice:`, err.message);
    }

    return { callId, status: 'ringing' };
  }

  public async hangupCall(callId: string): Promise<boolean> {
    try {
      if (this.gatewayUrl && !this.gatewayUrl.includes('localhost')) {
        await fetch(`${this.gatewayUrl.replace(/\/+$/, '')}/api/calls/${callId}/hangup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(this.webhookSecret ? { 'X-Telephony-Secret': this.webhookSecret } : {}),
          },
        });
      }
      return true;
    } catch (err: any) {
      console.warn(`[SIP Gateway] Hangup error:`, err.message);
      return false;
    }
  }

  public async verifyAndParseInboundWebhook(reqBody: any, headers?: Record<string, any>): Promise<ResolvedInboundCall | null> {
    if (!reqBody) return null;

    // Secure webhook signature / secret validation
    if (this.webhookSecret) {
      const headerSecret = headers?.['x-telephony-secret'] || headers?.['x-signature'];
      if (headerSecret !== this.webhookSecret) {
        console.warn('[SIP Gateway] Unauthorized webhook: Signature/Secret mismatch');
        return null;
      }
    }

    const rawCaller = reqBody.from || reqBody.From || reqBody.caller || reqBody.cli || '';
    const rawCallee = reqBody.to || reqBody.To || reqBody.callee || reqBody.did || '';
    const callId = reqBody.callId || reqBody.CallSid || reqBody.sessionId || `sip_${Date.now()}`;

    const resolved = await resolveInboundCallContext({
      callerNumber: rawCaller,
      calleeNumber: rawCallee,
      inboundOrgIdHint: reqBody.organizationId ? Number(reqBody.organizationId) : undefined,
    });

    return {
      callId,
      callerNumber: resolved.normalizedCaller,
      calleeNumber: resolved.normalizedCallee,
      organizationId: resolved.organizationId,
      channelId: resolved.channelId,
      contactId: resolved.contactId,
      metadata: reqBody,
    };
  }

  public handleMediaStream(callId: string, ws: WebSocket, onAudioIn: (chunk: Buffer) => void) {
    ws.on('message', (data: WebSocket.RawData) => {
      try {
        if (Buffer.isBuffer(data)) {
          onAudioIn(data);
        } else {
          const parsed = JSON.parse(data.toString());
          if (parsed.event === 'media' && parsed.media?.payload) {
            const buffer = Buffer.from(parsed.media.payload, 'base64');
            onAudioIn(buffer);
          } else if (parsed.event === 'audio' && parsed.payload) {
            const buffer = Buffer.from(parsed.payload, 'base64');
            onAudioIn(buffer);
          }
        }
      } catch {
        if (Buffer.isBuffer(data)) {
          onAudioIn(data);
        }
      }
    });

    return {
      sendAudio: (chunk: Buffer) => {
        if (ws.readyState === 1) {
          const msg = JSON.stringify({
            event: 'media',
            media: {
              payload: chunk.toString('base64'),
            },
          });
          ws.send(msg);
        }
      },
      close: () => {
        if (ws.readyState === 1) {
          ws.close();
        }
      },
    };
  }
}
