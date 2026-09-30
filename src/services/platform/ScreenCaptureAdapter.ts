/**
 * pumpkin - Screen Capture Adapter
 * Delegates screen acquisition to the unified PlatformAdapter.
 */

import { platformAdapter } from './PlatformAdapter';
import { StreamSettings } from '../../types';

export class ScreenCaptureAdapter {
  private activeStream: MediaStream | null = null;

  public async acquireScreenStream(settings: Partial<StreamSettings>): Promise<MediaStream> {
    this.cleanup();
    this.activeStream = await platformAdapter.acquireScreenStream(settings);
    return this.activeStream;
  }

  public cleanup() {
    if (this.activeStream) {
      this.activeStream.getTracks().forEach((track) => track.stop());
      this.activeStream = null;
    }
  }
}

export const screenCaptureAdapter = new ScreenCaptureAdapter();
