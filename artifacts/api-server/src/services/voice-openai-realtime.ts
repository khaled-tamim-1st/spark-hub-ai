import WebSocket from 'ws';
import { EventEmitter } from 'node:events';
import type { AudioFormat, StructuredTranscriptItem } from './voice-telephony-types.js';
import { SHARED_AI_TOOLS, executeAiTool, type ToolExecutionContext } from './ai-tools.js';

export interface RealtimeBridgeOptions {
  apiKey: string;
  systemPrompt: string;
  voice?: string;
  temperature?: number;
  inputFormat?: AudioFormat;
  outputFormat?: AudioFormat;
  toolContext?: ToolExecutionContext;
}

/**
 * Speech-to-Speech Realtime Bridge using OpenAI Realtime API.
 * Handles bidirectional audio streaming, server VAD, and real-time Tool Calling.
 */
export class OpenAiRealtimeBridge extends EventEmitter {
  private ws: WebSocket | null = null;
  private isConnected = false;
  private isSessionConfigured = false;
  private structuredTranscripts: StructuredTranscriptItem[] = [];
  private currentAssistantTranscript = '';
  private options: RealtimeBridgeOptions;

  constructor(options: RealtimeBridgeOptions) {
    super();
    this.options = {
      voice: 'alloy',
      temperature: 0.7,
      inputFormat: 'pcm16',
      outputFormat: 'pcm16',
      ...options,
    };
  }

  /**
   * Connect to OpenAI Realtime WebSocket
   */
  public async connect(): Promise<void> {
    if (!this.options.apiKey || this.options.apiKey.trim().length === 0) {
      throw new Error('OPENAI_API_KEY is not configured on the server. Please set OPENAI_API_KEY in your environment or SaaS Admin AI settings.');
    }

    return new Promise((resolve, reject) => {
      const url = 'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01';
      
      const ws = new WebSocket(url, {
        headers: {
          'Authorization': `Bearer ${this.options.apiKey}`,
          'OpenAI-Beta': 'realtime=v1',
        },
      });

      this.ws = ws;

      const connectionTimeout = setTimeout(() => {
        if (!this.isConnected) {
          ws.terminate();
          reject(new Error('Connection to OpenAI Realtime API timed out (15s).'));
        }
      }, 15000);

      ws.on('open', () => {
        clearTimeout(connectionTimeout);
        this.isConnected = true;
        this.configureSession();
        resolve();
      });

      ws.on('message', async (data: WebSocket.RawData) => {
        try {
          const rawStr = data.toString('utf-8');
          const event = JSON.parse(rawStr);
          await this.handleOpenAiEvent(event);
        } catch (err) {
          console.error('[OpenAI Realtime] Failed to parse event JSON:', err);
        }
      });

      ws.on('error', (err) => {
        clearTimeout(connectionTimeout);
        console.error('[OpenAI Realtime] WebSocket Error:', err);
        this.emit('error', err);
        if (!this.isConnected) {
          reject(err);
        }
      });

      ws.on('close', (code, reason) => {
        this.isConnected = false;
        console.log(`[OpenAI Realtime] Connection closed (${code}): ${reason.toString()}`);
        this.emit('close', { code, reason: reason.toString() });
      });
    });
  }

  /**
   * Configures the active session with system prompt, voice, tools, audio formats, and VAD
   */
  private configureSession(): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const inputAudioFormat = this.options.inputFormat === 'g711_ulaw' ? 'g711_ulaw' : 
                             this.options.inputFormat === 'g711_alaw' ? 'g711_alaw' : 'pcm16';
    const outputAudioFormat = this.options.outputFormat === 'g711_ulaw' ? 'g711_ulaw' : 
                              this.options.outputFormat === 'g711_alaw' ? 'g711_alaw' : 'pcm16';

    // Map shared AI tools to OpenAI Realtime tool schema
    const realtimeTools = SHARED_AI_TOOLS.map(t => ({
      type: 'function',
      name: t.name,
      description: t.description,
      parameters: t.parameters,
    }));

    const sessionUpdate = {
      type: 'session.update',
      session: {
        modalities: ['audio', 'text'],
        instructions: this.options.systemPrompt,
        voice: this.options.voice || 'alloy',
        input_audio_format: inputAudioFormat,
        output_audio_format: outputAudioFormat,
        input_audio_transcription: {
          model: 'whisper-1',
        },
        turn_detection: {
          type: 'server_vad',
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 500,
        },
        tools: realtimeTools,
        tool_choice: 'auto',
        temperature: this.options.temperature || 0.7,
      },
    };

    this.ws.send(JSON.stringify(sessionUpdate));
    this.isSessionConfigured = true;
    console.log('[OpenAI Realtime] Session configuration with tools sent.');
  }

  /**
   * Appends raw audio bytes from caller
   */
  public sendAudioChunk(chunk: Buffer): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const base64Audio = chunk.toString('base64');
    const audioEvent = {
      type: 'input_audio_buffer.append',
      audio: base64Audio,
    };

    this.ws.send(JSON.stringify(audioEvent));
  }

  /**
   * Triggers initial greeting
   */
  public triggerInitialGreeting(): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const responseCreate = {
      type: 'response.create',
      response: {
        modalities: ['audio', 'text'],
        instructions: 'ابدأ بالترحيب بالمتصل ترحيباً دافئاً ومختصراً واعرض المساعدة.',
      },
    };

    this.ws.send(JSON.stringify(responseCreate));
  }

  /**
   * Handles incoming events from OpenAI Realtime API including Tool Calling
   */
  private async handleOpenAiEvent(event: any): Promise<void> {
    switch (event.type) {
      case 'session.created':
        this.emit('session.created', event.session);
        break;

      case 'session.updated':
        this.emit('session.updated', event.session);
        break;

      case 'response.audio.delta':
        if (event.delta) {
          const audioBuffer = Buffer.from(event.delta, 'base64');
          this.emit('audio.delta', audioBuffer);
        }
        break;

      case 'response.audio_transcript.delta':
        if (event.delta) {
          this.currentAssistantTranscript += event.delta;
          this.emit('transcript.delta', { speaker: 'assistant', delta: event.delta });
        }
        break;

      case 'response.audio_transcript.done':
        if (this.currentAssistantTranscript.trim()) {
          const item: StructuredTranscriptItem = {
            role: 'assistant',
            text: this.currentAssistantTranscript.trim(),
            timestamp: new Date().toISOString(),
          };
          this.structuredTranscripts.push(item);
          this.emit('transcript.done', item);
          this.currentAssistantTranscript = '';
        }
        break;

      case 'conversation.item.input_audio_transcription.completed':
        if (event.transcript && event.transcript.trim()) {
          const item: StructuredTranscriptItem = {
            role: 'user',
            text: event.transcript.trim(),
            timestamp: new Date().toISOString(),
          };
          this.structuredTranscripts.push(item);
          this.emit('transcript.done', item);
        }
        break;

      case 'response.function_call_arguments.done': {
        // Execute Tool in Realtime!
        const { call_id, name, arguments: rawArgs } = event;
        console.log(`[OpenAI Realtime] Tool Call requested: [${name}] (call_id: ${call_id})`);

        let parsedArgs = {};
        try {
          parsedArgs = JSON.parse(rawArgs || '{}');
        } catch {}

        const toolContext: ToolExecutionContext = this.options.toolContext || {
          organizationId: 1,
        };

        const toolResult = await executeAiTool(name, parsedArgs, toolContext);
        console.log(`[OpenAI Realtime] Tool Call [${name}] executed ->`, toolResult.message);

        // Send tool output back to OpenAI Realtime
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          const toolResponse = {
            type: 'conversation.item.create',
            item: {
              type: 'function_call_output',
              call_id,
              output: JSON.stringify({
                result: toolResult.result,
                message: toolResult.message,
              }),
            },
          };
          this.ws.send(JSON.stringify(toolResponse));

          // Trigger AI to speak response verbally
          this.ws.send(JSON.stringify({ type: 'response.create' }));
        }
        break;
      }

      case 'input_audio_buffer.speech_started':
        this.emit('speech_started');
        break;

      case 'input_audio_buffer.speech_stopped':
        this.emit('speech_stopped');
        break;

      case 'error':
        console.error('[OpenAI Realtime] Error event:', event.error);
        this.emit('error', new Error(event.error?.message || 'OpenAI Realtime Error'));
        break;

      default:
        break;
    }
  }

  /**
   * Returns structured transcript
   */
  public getStructuredTranscripts(): StructuredTranscriptItem[] {
    return [...this.structuredTranscripts];
  }

  /**
   * Returns formatted plain-text transcript
   */
  public getTranscript(): string {
    return this.structuredTranscripts
      .map(item => `${item.role === 'user' ? 'العميل' : 'المساعد الصوتي'}: ${item.text}`)
      .join('\n');
  }

  /**
   * Add a manual structured transcript entry (for simulated testing)
   */
  public appendTranscript(item: StructuredTranscriptItem): void {
    this.structuredTranscripts.push(item);
  }

  /**
   * Close the WebSocket connection
   */
  public close(): void {
    if (this.ws) {
      try {
        this.ws.close();
      } catch {}
      this.ws = null;
      this.isConnected = false;
    }
  }
}
