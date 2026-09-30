/**
 * Web Audio API Analyser for Voice Activity Detection and Microphone Testing
 */

export class AudioLevelMonitor {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private animFrameId: number | null = null;
  private isSpeaking = false;
  private silenceStartTime: number | null = null;
  private onLevelCallback: ((level: number) => void) | null = null;
  private onSpeakingChangeCallback: ((speaking: boolean) => void) | null = null;

  // Sensitivity configuration
  private threshold = 12; // percent (0-100)
  private silenceHangoverMs = 350; // hold speaking state for 350ms to prevent fluttering

  public start(
    stream: MediaStream,
    onLevel?: (level: number) => void,
    onSpeakingChange?: (speaking: boolean) => void,
    threshold = 12
  ) {
    this.stop();

    this.onLevelCallback = onLevel || null;
    this.onSpeakingChangeCallback = onSpeakingChange || null;
    this.threshold = threshold;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioContext = new AudioCtx();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.4;

      this.source = this.audioContext.createMediaStreamSource(stream);
      this.source.connect(this.analyser);

      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkAudio = () => {
        if (!this.analyser) return;

        this.analyser.getByteFrequencyData(dataArray);

        // Calculate average volume
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        const normalized = Math.min(100, Math.round((average / 128) * 100));

        if (this.onLevelCallback) {
          this.onLevelCallback(normalized);
        }

        // Voice activity detection
        const now = Date.now();
        if (normalized >= this.threshold) {
          this.silenceStartTime = null;
          if (!this.isSpeaking) {
            this.isSpeaking = true;
            this.onSpeakingChangeCallback?.(true);
          }
        } else {
          if (this.isSpeaking) {
            if (!this.silenceStartTime) {
              this.silenceStartTime = now;
            } else if (now - this.silenceStartTime > this.silenceHangoverMs) {
              this.isSpeaking = false;
              this.silenceStartTime = null;
              this.onSpeakingChangeCallback?.(false);
            }
          }
        }

        this.animFrameId = requestAnimationFrame(checkAudio);
      };

      this.animFrameId = requestAnimationFrame(checkAudio);
    } catch (err) {
      console.warn('[AudioLevelMonitor] Web Audio not supported or failed to initialize:', err);
    }
  }

  public stop() {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.analyser) {
      this.analyser.disconnect();
      this.analyser = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }

    if (this.isSpeaking) {
      this.isSpeaking = false;
      this.onSpeakingChangeCallback?.(false);
    }
  }
}
