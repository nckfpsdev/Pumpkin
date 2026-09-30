/**
 * pumpkin - Desktop (Windows / macOS / Linux) Platform Implementation
 */

import { PlatformAdapter, PlatformCapabilities, NotificationOptions } from './PlatformAdapter';
import { StreamSettings } from '../../types';

export class DesktopPlatformAdapter implements PlatformAdapter {
  public readonly isWeb = false;
  public readonly isDesktop = true;
  public readonly isAndroid = false;
  public readonly isWindows: boolean;
  public readonly isMacOS: boolean;
  public readonly isLinux: boolean;
  public readonly os: 'windows' | 'macos' | 'linux';
  public readonly name: string;

  public readonly capabilities: PlatformCapabilities;

  constructor() {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    this.isWindows = /Windows/i.test(ua);
    this.isMacOS = /Macintosh|Mac OS X/i.test(ua);
    this.isLinux = /Linux/i.test(ua) && !/Android/i.test(ua);

    if (this.isWindows) {
      this.os = 'windows';
      this.name = 'pumpkin Desktop (Windows)';
    } else if (this.isMacOS) {
      this.os = 'macos';
      this.name = 'pumpkin Desktop (macOS)';
    } else {
      this.os = 'linux';
      this.name = 'pumpkin Desktop (Linux)';
    }

    this.capabilities = {
      hasNativeTitleBar: true,
      hasSystemTray: this.isWindows,
      hasMediaProjection: false,
      supportsPushToTalkGlobal: true,
      supports1080p60: true,
      hasTouchScreen: false,
    };
  }

  public async minimizeToTray(): Promise<void> {
    try {
      const tauri = (window as unknown as { __TAURI__?: { window?: { getCurrentWindow?: () => { hide: () => Promise<void> } } } }).__TAURI__;
      if (tauri?.window?.getCurrentWindow) {
        await tauri.window.getCurrentWindow().hide();
      }
    } catch (e) {
      console.warn('[DesktopPlatform] Failed to minimize to tray:', e);
    }
  }

  public async closeWindow(): Promise<void> {
    try {
      const tauri = (window as unknown as { __TAURI__?: { window?: { getCurrentWindow?: () => { close: () => Promise<void> } } } }).__TAURI__;
      if (tauri?.window?.getCurrentWindow) {
        await tauri.window.getCurrentWindow().close();
      } else {
        window.close();
      }
    } catch {
      window.close();
    }
  }

  public async setTitle(title: string): Promise<void> {
    document.title = title;
    try {
      const tauri = (window as unknown as { __TAURI__?: { window?: { getCurrentWindow?: () => { setTitle: (t: string) => Promise<void> } } } }).__TAURI__;
      if (tauri?.window?.getCurrentWindow) {
        await tauri.window.getCurrentWindow().setTitle(title);
      }
    } catch {}
  }

  public onWindowCloseRequested(callback: () => void): () => void {
    const handler = () => {
      callback();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }

  public openExternalUrl(url: string): void {
    try {
      const tauri = (window as unknown as { __TAURI__?: { shell?: { open: (u: string) => Promise<void> } } }).__TAURI__;
      if (tauri?.shell?.open) {
        tauri.shell.open(url);
      } else {
        window.open(url, '_blank');
      }
    } catch {
      window.open(url, '_blank');
    }
  }

  public notify(options: NotificationOptions): void {
    if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
      return;
    }

    try {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(options.title, {
          body: options.body,
          icon: options.icon || '/icons/icon-128x128.png',
        });
      }
    } catch (e) {
      console.warn('[DesktopPlatform] Failed to show desktop notification:', e);
    }
  }

  public async acquireScreenStream(settings: Partial<StreamSettings>): Promise<MediaStream> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      throw new Error('Captura de tela indisponível no cliente desktop.');
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
