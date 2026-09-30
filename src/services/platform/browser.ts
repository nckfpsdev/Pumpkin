/**
 * pumpkin - Browser Platform Implementation
 */

import { PlatformAdapter, PlatformCapabilities, NotificationOptions } from './PlatformAdapter';
import { StreamSettings } from '../../types';

export class BrowserPlatformAdapter implements PlatformAdapter {
  public readonly isWeb = true;
  public readonly isDesktop = false;
  public readonly isAndroid = false;
  public readonly isWindows = false;
  public readonly isMacOS = false;
  public readonly isLinux = false;
  public readonly os = 'web' as const;
  public readonly name = 'Web Browser';

  public readonly capabilities: PlatformCapabilities = {
    hasNativeTitleBar: false,
    hasSystemTray: false,
    hasMediaProjection: false,
    supportsPushToTalkGlobal: false,
    supports1080p60: true,
    hasTouchScreen: typeof navigator !== 'undefined' && (navigator.maxTouchPoints > 0 || 'ontouchstart' in window),
  };

  constructor() {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    (this as { isWindows: boolean }).isWindows = /Windows/i.test(ua);
    (this as { isMacOS: boolean }).isMacOS = /Macintosh|Mac OS X/i.test(ua);
    (this as { isLinux: boolean }).isLinux = /Linux/i.test(ua) && !/Android/i.test(ua);
  }

  public async minimizeToTray(): Promise<void> {
    // Web browsers do not have system tray support
  }

  public async closeWindow(): Promise<void> {
    if (typeof window !== 'undefined') {
      window.close();
    }
  }

  public async setTitle(title: string): Promise<void> {
    if (typeof document !== 'undefined') {
      document.title = title;
    }
  }

  public onWindowCloseRequested(callback: () => void): () => void {
    if (typeof window === 'undefined') return () => {};
    const handler = () => {
      callback();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }

  public openExternalUrl(url: string): void {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  public notify(options: NotificationOptions): void {
    if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
      return; // Do not notify if user is actively focused on the tab
    }

    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(options.title, {
          body: options.body,
          icon: options.icon || '/icons/icon-128x128.png',
        });
      } catch (e) {
        console.warn('[BrowserPlatform] Notification error:', e);
      }
    }
  }

  public async acquireScreenStream(settings: Partial<StreamSettings>): Promise<MediaStream> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      throw new Error('Compartilhamento de tela não suportado no navegador atual.');
    }

    const profile = settings.profile ?? '1080p60';
    let width = 1920;
    let height = 1080;
    let fps = 60;

    if (profile === '1080p30') {
      fps = 30;
    } else if (profile === '720p60') {
      width = 1280;
      height = 720;
      fps = 60;
    } else if (profile === '720p30') {
      width = 1280;
      height = 720;
      fps = 30;
    }

    const constraints: DisplayMediaStreamOptions = {
      video: {
        width: { ideal: width },
        height: { ideal: height },
        frameRate: { ideal: fps, max: fps },
      },
      audio: settings.captureAudio
        ? {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
          }
        : false,
    };

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia(constraints);
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack && 'contentHint' in videoTrack) {
        try {
          (videoTrack as unknown as { contentHint: string }).contentHint = settings.contentHint || 'detail';
        } catch {}
      }
      return stream;
    } catch {
      return await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: Boolean(settings.captureAudio),
      });
    }
  }
}
