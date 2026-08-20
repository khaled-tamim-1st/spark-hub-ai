import { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, Sparkles, Loader2, User, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { getToken } from '@/lib/auth';

interface VoiceCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactName?: string;
  phoneNumber: string;
  contactId?: number;
  conversationId?: number;
  onCallEnded?: () => void;
}

export function VoiceCallModal({
  isOpen,
  onClose,
  contactName = 'Customer',
  phoneNumber,
  contactId,
  conversationId,
  onCallEnded,
}: VoiceCallModalProps) {
  const [callStatus, setCallStatus] = useState<'idle' | 'initiating' | 'ringing' | 'connected' | 'ended' | 'error'>('idle');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [transcripts, setTranscripts] = useState<Array<{ speaker: string; text: string }>>([]);
  const [aiSpeechState, setAiSpeechState] = useState<'listening' | 'speaking' | 'idle'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { toast } = useToast();

  const wsRef = useRef<WebSocket | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioWorkletNodeRef = useRef<ScriptProcessorNode | null>(null);

  useEffect(() => {
    if (isOpen) {
      startCall();
    } else {
      cleanupCall();
    }
    return () => {
      cleanupCall();
    };
  }, [isOpen]);

  useEffect(() => {
    if (callStatus === 'connected') {
      timerRef.current = setInterval(() => {
        setCallDuration(d => d + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callStatus]);

  const startCall = async () => {
    setCallStatus('initiating');
    setCallDuration(0);
    setTranscripts([]);
    setErrorMessage(null);

    try {
      const token = getToken();
      const res = await fetch('/api/voice/calls/outbound', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          toNumber: phoneNumber,
          contactId,
          conversationId,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to start call');
      }

      const data = await res.json();
      setSessionId(data.sessionId);
      setCallStatus('ringing');

      // Connect media stream via WebSocket
      connectMediaStream(data.sessionId);
    } catch (err: any) {
      console.error('Call failed:', err);
      setCallStatus('error');
      setErrorMessage(err.message || 'Call initialization failed');
    }
  };

  const connectMediaStream = async (sid: string) => {
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/voice/ws/${sid}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      // Setup Web Audio Context for playing audio and capturing mic
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = audioCtx;

      ws.onopen = async () => {
        setCallStatus('connected');
        setAiSpeechState('speaking');

        // Request user microphone for full-duplex conversation
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
              sampleRate: 24000,
            },
          });
          mediaStreamRef.current = stream;

          const source = audioCtx.createMediaStreamSource(stream);
          // Script processor to capture PCM16 chunks
          const processor = audioCtx.createScriptProcessor(4096, 1, 1);
          audioWorkletNodeRef.current = processor;

          processor.onaudioprocess = (e) => {
            if (isMuted || ws.readyState !== WebSocket.OPEN) return;
            const inputData = e.inputBuffer.getChannelData(0);
            // Convert Float32 to Int16 PCM
            const pcmBuffer = new ArrayBuffer(inputData.length * 2);
            const pcmView = new DataView(pcmBuffer);
            for (let i = 0; i < inputData.length; i++) {
              let s = Math.max(-1, Math.min(1, inputData[i]));
              pcmView.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
            }
            ws.send(pcmBuffer);
          };

          source.connect(processor);
          processor.connect(audioCtx.destination);
        } catch (micErr) {
          console.warn('Microphone permission not granted (listening mode only):', micErr);
        }
      };

      ws.onmessage = async (event) => {
        try {
          if (event.data instanceof Blob) {
            // Raw PCM audio chunk from OpenAI
            const arrayBuffer = await event.data.arrayBuffer();
            playPcmChunk(audioCtx, arrayBuffer);
            setAiSpeechState('speaking');
          } else {
            const parsed = JSON.parse(event.data);
            if (parsed.event === 'media' && parsed.media?.payload) {
              const binary = atob(parsed.media.payload);
              const bytes = new Uint8Array(binary.length);
              for (let i = 0; i < binary.length; i++) {
                bytes[i] = binary.charCodeAt(i);
              }
              playPcmChunk(audioCtx, bytes.buffer);
              setAiSpeechState('speaking');
            } else if (parsed.event === 'transcript' && parsed.text) {
              setTranscripts(prev => [...prev, { speaker: parsed.speaker || 'AI', text: parsed.text }]);
            }
          }
        } catch (err) {
          console.error('Audio processing error:', err);
        }
      };

      ws.onclose = () => {
        setCallStatus('ended');
      };

      ws.onerror = (err) => {
        console.error('Voice WebSocket error:', err);
      };
    } catch (err: any) {
      console.error('Media stream connection error:', err);
      setCallStatus('error');
      setErrorMessage(err.message);
    }
  };

  const playPcmChunk = (audioCtx: AudioContext, pcmBuffer: ArrayBuffer) => {
    if (isSpeakerMuted) return;
    try {
      const int16Array = new Int16Array(pcmBuffer);
      const float32Array = new Float32Array(int16Array.length);
      for (let i = 0; i < int16Array.length; i++) {
        float32Array[i] = int16Array[i] / 32768;
      }
      const audioBuffer = audioCtx.createBuffer(1, float32Array.length, 24000);
      audioBuffer.getChannelData(0).set(float32Array);

      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);
      source.start();
    } catch (e) {
      console.warn('Audio playback glitch:', e);
    }
  };

  const handleEndCall = async () => {
    if (sessionId) {
      try {
        const token = getToken();
        await fetch(`/api/voice/calls/${sessionId}/hangup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
        });
      } catch (err) {
        console.error('Error hanging up call:', err);
      }
    }
    setCallStatus('ended');
    cleanupCall();
    if (onCallEnded) onCallEnded();
  };

  const cleanupCall = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleEndCall(); onClose(); }}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-border bg-card shadow-2xl rounded-2xl">
        <DialogHeader className="p-6 pb-2 text-center flex flex-col items-center">
          <div className="relative mb-4">
            {/* Animated Pulse Ring */}
            <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 ${
              callStatus === 'connected' 
                ? 'bg-gradient-to-tr from-emerald-500/20 to-teal-500/30 ring-4 ring-emerald-500/20 animate-pulse'
                : callStatus === 'ringing' || callStatus === 'initiating'
                ? 'bg-gradient-to-tr from-blue-500/20 to-indigo-500/30 ring-4 ring-blue-500/20 animate-bounce'
                : 'bg-muted'
            }`}>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
                callStatus === 'connected' ? 'bg-emerald-500 text-white' :
                callStatus === 'ringing' || callStatus === 'initiating' ? 'bg-indigo-600 text-white' :
                'bg-muted-foreground text-background'
              }`}>
                <Phone className="w-8 h-8" />
              </div>
            </div>
            {callStatus === 'connected' && (
              <span className="absolute bottom-1 right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
              </span>
            )}
          </div>

          <DialogTitle className="text-xl font-bold text-foreground">
            {contactName}
          </DialogTitle>
          <DialogDescription className="text-sm font-mono text-muted-foreground mt-1">
            {phoneNumber}
          </DialogDescription>

          {/* Status Badge */}
          <div className="mt-3 flex items-center gap-2">
            {callStatus === 'initiating' && (
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                <Loader2 className="w-3 h-3 mr-1 animate-spin" /> جاري الاتصال...
              </Badge>
            )}
            {callStatus === 'ringing' && (
              <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                <Activity className="w-3 h-3 mr-1 animate-pulse" /> رنين (Ringing)...
              </Badge>
            )}
            {callStatus === 'connected' && (
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                <Sparkles className="w-3 h-3 mr-1" /> متصل — Realtime AI ({formatDuration(callDuration)})
              </Badge>
            )}
            {callStatus === 'ended' && (
              <Badge variant="outline" className="bg-muted text-muted-foreground">
                انتهت المكالمة ({formatDuration(callDuration)})
              </Badge>
            )}
            {callStatus === 'error' && (
              <Badge variant="destructive">
                فشل الاتصال
              </Badge>
            )}
          </div>
        </DialogHeader>

        {/* Error message card */}
        {errorMessage && (
          <div className="mx-6 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive text-center">
            {errorMessage}
          </div>
        )}

        {/* Voice AI Visualizer / Transcript Area */}
        <div className="px-6 py-4 bg-muted/30 border-y border-border/50 min-h-[140px] max-h-[180px] overflow-y-auto flex flex-col justify-center items-center text-center">
          {callStatus === 'connected' ? (
            <div className="space-y-2 w-full">
              <div className="flex items-center justify-center gap-1.5 h-8">
                {[40, 70, 30, 85, 55, 90, 45, 65, 30, 80, 50].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 bg-emerald-500 rounded-full transition-all duration-200"
                    style={{
                      height: aiSpeechState === 'speaking' ? `${(h * (callDuration % 3 + 1)) % 32 + 8}px` : '4px',
                      opacity: aiSpeechState === 'speaking' ? 0.9 : 0.3,
                    }}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {aiSpeechState === 'speaking' ? 'المساعد الصوتي يتحدث الآن...' : 'جاري الاستماع لصوت المتصل...'}
              </p>
            </div>
          ) : callStatus === 'initiating' || callStatus === 'ringing' ? (
            <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground text-xs">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span>جاري توجيه المكالمة إلى Voice AI Gateway...</span>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">
              يتم تسجيل وتحليل المكالمة صوتياً بالذكاء الاصطناعي مع حفظ التقرير في المحادثة.
            </span>
          )}
        </div>

        {/* Controls Footer */}
        <div className="p-6 bg-card flex items-center justify-center gap-4">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={`w-12 h-12 rounded-full border-border ${isMuted ? 'bg-destructive/10 text-destructive border-destructive/20' : ''}`}
            onClick={() => setIsMuted(!isMuted)}
            disabled={callStatus !== 'connected'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>

          <Button
            type="button"
            variant="destructive"
            className="h-14 px-8 rounded-full shadow-lg shadow-destructive/25 flex items-center gap-2 font-semibold text-base"
            onClick={handleEndCall}
          >
            <PhoneOff className="w-5 h-5" />
            إنهاء المكالمة
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className={`w-12 h-12 rounded-full border-border ${isSpeakerMuted ? 'bg-destructive/10 text-destructive border-destructive/20' : ''}`}
            onClick={() => setIsSpeakerMuted(!isSpeakerMuted)}
            disabled={callStatus !== 'connected'}
          >
            {isSpeakerMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
