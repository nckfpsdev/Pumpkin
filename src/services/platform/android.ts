/**
 * pumpkin - Android Mobile Platform Implementation
 */

import { PlatformAdapter, PlatformCapabilities, NotificationOptions } from './PlatformAdapter';
import { StreamSettings } from '../../types';

export class AndroidPlatformAdapter implements PlatformAdapter {
  public readonly isWeb = false;
  public readonly isDesktop = false;
  public readonly isAndroid = true;
  public readonly isWindows = false;
  public readonly isMacOS = false;
  public readonly isLinux = false;
  public readonly os = 'android' as const;
  public readonly name = 'pumpkin for Android';

  public readonly capabilities: PlatformCapabilities = {
    hasNativeTitleBar: false,
    hasSystemTray: false,
    hasMediaProjection: true,
    supportsPushToTalkGlobal: false,
    supports1080p60: false, // Mobile targets 30fps to preserve battery and thermal performance
    hasTouchScreen: true,
  };

  private getBridge() {
    const win = window as unknown as {
      __PUMPKIN_ANDROID__?: {
        moveToBackground?: () => void;
        exitApp?: () => void;
        isAvailable?: boolean;
        startNativeCapture?: () => Promise<MediaStream>;
      };
      __NCKDEV_ANDROID__?: {
        moveToBackground?: () => void;
        exitApp?: () => void;
        isAvailable?: boolean;
        startNativeCapture?: () => Promise<MediaStream>;
      };
    };
    return win.__PUMPKIN_ANDROID__ || win.__NCKDEV_ANDROID__;
  }

  public async minimizeToTray(): Promise<void> {
    // In Android, minimizing corresponds to moving the task to background
    try {
      const androidBridge = this.getBridge();
      if (androidBridge?.moveToBackground) {
        androidBridge.moveToBackground();
      }
    } catch {}
  }

  public async closeWindow(): Promise<void> {
    try {
      const androidBridge = this.getBridge();
      if (androidBridge?.exitApp) {
        androidBridge.exitApp();
      } else {
        window.close();
      }
    } catch {
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
      console.warn('[AndroidPlatform] Failed to show notification:', e);
    }
  }

  public async acquireScreenStream(settings: Partial<StreamSettings>): Promise<MediaStream> {
    // Check if running inside Android MediaProjection native bridge
    const androidBridge = this.getBridge();

    if (androidBridge?.isAvailable && androidBridge.startNativeCapture) {
      try {
        return await androidBridge.startNativeCapture();
      } catch (err) {
        console.warn('[AndroidPlatform] Native MediaProjection intent cancelled or failed, falling back:', err);
      }
    }

    // Fallback to standard getDisplayMedia supported in modern Chromium Android
    if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
      const width = Math.min(1280, typeof window !== 'undefined' ? window.innerWidth * 2 : 1280);
      const height = Math.min(720, typeof window !== 'undefined' ? window.innerHeight * 2 : 720);

      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            width: { ideal: width },
            height: { ideal: height },
            frameRate: { ideal: 30, max: 30 },
          },
          audio: false,
        });
        return stream;
      } catch {
        return await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false,
        });
      }
    }

    throw new Error('Compartilhamento de tela não suportado nesta versão do Android.');
  }

  public onBackButtonPressed(callback: () => boolean): () => void {
    if (typeof window === 'undefined') return () => {};

    const handlePopState = (e: PopStateEvent) => {
      // If callback returns true, default exit is prevented
      const handled = callback();
      if (handled) {
        e.preventDefault();
        window.history.pushState(null, '', window.location.href);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }
}
