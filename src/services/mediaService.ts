import { AudioSettings, ScreenShareProfile, StreamSettings } from '../types';
import { screenCaptureAdapter } from './platform/ScreenCaptureAdapter';

export class MediaService {
  private localAudioStream: MediaStream | null = null;
  private localScreenStream: MediaStream | null = null;

  public async getMicrophoneStream(settings: Partial<AudioSettings>): Promise<MediaStream> {
    // If an existing audio stream is active, stop it first
    this.stopMicrophone();

    const audioConstraints: MediaTrackConstraints = {
      echoCancellation: settings.echoCancellation ?? true,
      noiseSuppression: settings.noiseSuppression ?? true,
      autoGainControl: settings.autoGainControl ?? true,
    };

    if (settings.audioInputDeviceId && settings.audioInputDeviceId !== 'default') {
      audioConstraints.deviceId = { exact: settings.audioInputDeviceId };
    }

    try {
      this.localAudioStream = await navigator.mediaDevices.getUserMedia({
        audio: audioConstraints,
        video: false,
      });

      return this.localAudioStream;
    } catch (err: unknown) {
      const error = err as Error;
      // If exact device failed, fallback to any available audio device
      if (audioConstraints.deviceId) {
        console.warn('[MediaService] Exact device failed, falling back to default mic:', error);
        delete audioConstraints.deviceId;
        this.localAudioStream = await navigator.mediaDevices.getUserMedia({
          audio: audioConstraints,
          video: false,
        });
        return this.localAudioStream;
      }
      throw error;
    }
  }

  public async getScreenStream(settings: Partial<StreamSettings>): Promise<MediaStream> {
    this.stopScreenShare();
    this.localScreenStream = await screenCaptureAdapter.acquireScreenStream(settings);
    return this.localScreenStream;
  }

  public getLocalAudioStream(): MediaStream | null {
    return this.localAudioStream;
  }

  public getLocalScreenStream(): MediaStream | null {
    return this.localScreenStream;
  }

  public stopMicrophone() {
    if (this.localAudioStream) {
      this.localAudioStream.getTracks().forEach((track) => track.stop());
      this.localAudioStream = null;
    }
  }

  public stopScreenShare() {
    screenCaptureAdapter.cleanup();
    if (this.localScreenStream) {
      this.localScreenStream.getTracks().forEach((track) => track.stop());
      this.localScreenStream = null;
    }
  }

  public async enumerateDevices(): Promise<{ inputs: MediaDeviceInfo[]; outputs: MediaDeviceInfo[] }> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      return { inputs: [], outputs: [] };
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const inputs = devices.filter((d) => d.kind === 'audioinput');
      const outputs = devices.filter((d) => d.kind === 'audiooutput');
      return { inputs, outputs };
    } catch (err) {
      console.warn('[MediaService] Failed to enumerate devices:', err);
      return { inputs: [], outputs: [] };
    }
  }
}

export const mediaService = new MediaService();
