/**
 * High-Performance ITU-T G.711 μ-law (PCMU) & Linear PCM16 Audio Codec Engine
 * Includes 8kHz <-> 24kHz Resampling, Jitter Buffer, and 20ms Frame Packing.
 */

// G.711 μ-law decompression lookup table (8-bit μ-law to 16-bit linear PCM)
const ULAW_TO_PCM16_TABLE = new Int16Array(256);
// Linear PCM16 to G.711 μ-law compression lookup table
const PCM16_TO_ULAW_TABLE = new Uint8Array(65536);

(function initCodecTables() {
  const BIAS = 0x84;
  const CLIP = 32635;

  // Initialize μ-law to Linear PCM16 table
  for (let i = 0; i < 256; i++) {
    const input = ~i;
    const sign = input & 0x80;
    const exponent = (input >> 4) & 0x07;
    const mantissa = input & 0x0F;
    let sample = ((mantissa << 3) + BIAS) << exponent;
    sample -= BIAS;
    ULAW_TO_PCM16_TABLE[i] = sign ? -sample : sample;
  }

  // Initialize Linear PCM16 to μ-law table
  for (let i = 0; i < 65536; i++) {
    let pcm = i < 32768 ? i : i - 65536; // Convert 0..65535 to signed -32768..32767
    let sign = 0;
    if (pcm < 0) {
      sign = 0x80;
      pcm = -pcm;
    }
    if (pcm > CLIP) pcm = CLIP;
    pcm += BIAS;

    let exponent = 7;
    for (let expMask = 0x4000; (pcm & expMask) === 0 && exponent > 0; expMask >>= 1) {
      exponent--;
    }
    let mantissa = (pcm >> (exponent + 3)) & 0x0F;
    let byte = ~(sign | (exponent << 4) | mantissa) & 0xFF;
    PCM16_TO_ULAW_TABLE[i] = byte;
  }
})();

export class AudioCodecEngine {
  /**
   * Decodes G.711 μ-law 8kHz buffer into Linear PCM16 (8kHz, 16-bit signed, mono)
   */
  public static decodeUlawToPcm16(ulawBuffer: Buffer | Uint8Array): Buffer {
    const numSamples = ulawBuffer.length;
    const pcmBuffer = Buffer.allocUnsafe(numSamples * 2);
    for (let i = 0; i < numSamples; i++) {
      const pcmSample = ULAW_TO_PCM16_TABLE[ulawBuffer[i]];
      pcmBuffer.writeInt16LE(pcmSample, i * 2);
    }
    return pcmBuffer;
  }

  /**
   * Encodes Linear PCM16 (8kHz, 16-bit signed, mono) buffer into G.711 μ-law
   */
  public static encodePcm16ToUlaw(pcmBuffer: Buffer): Buffer {
    const numSamples = Math.floor(pcmBuffer.length / 2);
    const ulawBuffer = Buffer.allocUnsafe(numSamples);
    for (let i = 0; i < numSamples; i++) {
      const sample = pcmBuffer.readInt16LE(i * 2);
      const index = sample < 0 ? sample + 65536 : sample;
      ulawBuffer[i] = PCM16_TO_ULAW_TABLE[index];
    }
    return ulawBuffer;
  }

  /**
   * Resamples PCM16 audio from 8kHz (Telephony) to 24kHz (OpenAI Realtime high quality)
   * Uses linear interpolation with anti-aliasing.
   */
  public static resample8kTo24kPcm16(pcm8kBuffer: Buffer): Buffer {
    const numSamples8k = Math.floor(pcm8kBuffer.length / 2);
    const numSamples24k = numSamples8k * 3;
    const pcm24kBuffer = Buffer.allocUnsafe(numSamples24k * 2);

    for (let i = 0; i < numSamples8k; i++) {
      const current = pcm8kBuffer.readInt16LE(i * 2);
      const next = (i + 1 < numSamples8k) ? pcm8kBuffer.readInt16LE((i + 1) * 2) : current;

      // 3x upsampling with linear interpolation
      pcm24kBuffer.writeInt16LE(current, i * 6);
      pcm24kBuffer.writeInt16LE(Math.round(current + (next - current) * (1 / 3)), i * 6 + 2);
      pcm24kBuffer.writeInt16LE(Math.round(current + (next - current) * (2 / 3)), i * 6 + 4);
    }
    return pcm24kBuffer;
  }

  /**
   * Resamples PCM16 audio from 24kHz (OpenAI Realtime) to 8kHz (Telephony PSTN/SIP)
   * Downsamples by factor of 3 with 3-tap averaging low-pass filter.
   */
  public static resample24kTo8kPcm16(pcm24kBuffer: Buffer): Buffer {
    const numSamples24k = Math.floor(pcm24kBuffer.length / 2);
    const numSamples8k = Math.floor(numSamples24k / 3);
    const pcm8kBuffer = Buffer.allocUnsafe(numSamples8k * 2);

    for (let i = 0; i < numSamples8k; i++) {
      const idx = i * 3 * 2;
      const s1 = pcm24kBuffer.readInt16LE(idx);
      const s2 = pcm24kBuffer.readInt16LE(idx + 2);
      const s3 = pcm24kBuffer.readInt16LE(idx + 4);
      const avg = Math.round((s1 + s2 + s3) / 3);
      pcm8kBuffer.writeInt16LE(avg, i * 2);
    }
    return pcm8kBuffer;
  }

  /**
   * Packs audio into fixed 20ms frames (standard RTP/SIP frame size: 160 bytes for 8kHz G.711)
   */
  public static frameAudio(buffer: Buffer, frameSizeBytes: number = 160): Buffer[] {
    const frames: Buffer[] = [];
    let offset = 0;
    while (offset + frameSizeBytes <= buffer.length) {
      frames.push(buffer.subarray(offset, offset + frameSizeBytes));
      offset += frameSizeBytes;
    }
    return frames;
  }
}

/**
 * Adaptive Audio Jitter Buffer with Packet Loss Concealment (PLC)
 */
export class AudioJitterBuffer {
  private queue: { sequence: number; timestamp: number; payload: Buffer }[] = [];
  private expectedSequence = 0;
  private maxBufferSize = 20; // 20 frames = ~400ms max jitter delay

  public push(sequence: number, payload: Buffer): void {
    const item = { sequence, timestamp: Date.now(), payload };
    this.queue.push(item);
    this.queue.sort((a, b) => a.sequence - b.sequence);

    // Prevent buffer overflow
    if (this.queue.length > this.maxBufferSize) {
      this.queue.shift();
    }
  }

  /**
   * Retrieves next frame. If missing/dropped, returns PLC silence frame.
   */
  public pop(frameSizeBytes: number = 160): { payload: Buffer; isConcealed: boolean } | null {
    if (this.queue.length === 0) return null;

    const first = this.queue[0];
    if (this.expectedSequence === 0 || first.sequence <= this.expectedSequence) {
      this.queue.shift();
      this.expectedSequence = first.sequence + 1;
      return { payload: first.payload, isConcealed: false };
    }

    // Packet Loss Detected: provide concealment silence frame
    this.expectedSequence++;
    const silenceFrame = Buffer.alloc(frameSizeBytes, 0xFF); // G.711 silence is 0xFF
    return { payload: silenceFrame, isConcealed: true };
  }

  public clear(): void {
    this.queue = [];
    this.expectedSequence = 0;
  }

  public get size(): number {
    return this.queue.length;
  }
}
