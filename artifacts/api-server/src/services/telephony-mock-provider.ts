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

/**
 * Enhanced Mock Telephony Provider.
 * Allows realistic simulation of Inbound, Outbound, Ringing, Audio Streaming,
 * Disconnects, and Tool Interactions without needing a live paid SIP trunk.
 */
export class MockTelephonyProvider implements TelephonyProvider {
  public readonly id = 'mock';
  public readonly name = 'Simulator & Mock Telephony Provider';
  public readonly transportType: TransportType = 'websocket_media';
  public readonly defaultAudioFormat: AudioFormat = 'pcm16';

  private activeCalls = new Map<string, {
    params: CallInitiateParams;
    status: CallStatus;
    mediaWs?: WebSocket;
  }>();

  public async initiateCall(params: CallInitiateParams): Promise<{ callId: string; status: CallStatus }> {
    const callId = `mock_call_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    this.activeCalls.set(callId, {
      params,
      status: 'ringing',
    });

    console.log(`[Mock Telephony] Outbound call ringing from ${params.fromNumber} to ${params.toNumber} (Call ID: ${callId})`);
    return { callId, status: 'ringing' };
  }

  public async hangupCall(callId: string): Promise<boolean> {
    const call = this.activeCalls.get(callId);
    if (call) {
      call.status = 'completed';
      if (call.mediaWs && call.mediaWs.readyState === 1) {
        call.mediaWs.close();
      }
      this.activeCalls.delete(callId);
      console.log(`[Mock Telephony] Call ${callId} hung up.`);
      return true;
    }
    return false;
  }

  public async verifyAndParseInboundWebhook(reqBody: any, headers?: Record<string, any>): Promise<ResolvedInboundCall | null> {
    if (!reqBody) return null;

    const rawCaller = reqBody.from || reqBody.From || reqBody.caller || '+201000000000';
    const rawCallee = reqBody.to || reqBody.To || reqBody.callee || '+201000000001';
    const callId = reqBody.callId || reqBody.CallSid || `mock_inbound_${Date.now()}`;

    // Securely resolve tenant & customer
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
    const call = this.activeCalls.get(callId);
    if (call) {
      call.mediaWs = ws;
      call.status = 'in_progress';
    }

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
