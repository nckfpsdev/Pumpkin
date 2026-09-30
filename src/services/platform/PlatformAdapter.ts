/**
 * pumpkin - Unified Platform Adapter Interface & Factory
 * 
 * Centralizes all platform-specific logic (isWeb, isDesktop, isAndroid)
 * behind a single, clean interface implemented by browser.ts, desktop.ts, and android.ts.
 */

import { StreamSettings } from '../../types';
import { BrowserPlatformAdapter } from './browser';
import { DesktopPlatformAdapter } from './desktop';
import { AndroidPlatformAdapter } from './android';

export interface PlatformCapabilities {
  hasNativeTitleBar: boolean;
  hasSystemTray: boolean;
  hasMediaProjection: boolean;
  supportsPushToTalkGlobal: boolean;
  supports1080p60: boolean;
  hasTouchScreen: boolean;
}

export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
}

export interface PlatformAdapter {
  readonly isWeb: boolean;
  readonly isDesktop: boolean;
  readonly isAndroid: boolean;
  readonly isWindows: boolean;
  readonly isMacOS: boolean;
  readonly isLinux: boolean;
  readonly os: 'web' | 'windows' | 'android' | 'linux' | 'macos';
  readonly name: string;
  readonly capabilities: PlatformCapabilities;

  minimizeToTray(): Promise<void>;
  closeWindow(): Promise<void>;
  setTitle(title: string): Promise<void>;
  onWindowCloseRequested(callback: () => void): () => void;
  openExternalUrl(url: string): void;
  notify(options: NotificationOptions): void;
  acquireScreenStream(settings: Partial<StreamSettings>): Promise<MediaStream>;
  onBackButtonPressed?(callback: () => boolean): () => void;
}

export type IPlatformAdapter = PlatformAdapter;

function createPlatformAdapter(): PlatformAdapter {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const isTauri = typeof window !== 'undefined' && Boolean(
    (window as unknown as { __TAURI__?: unknown }).__TAURI__ ||
    (window as unknown as { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__
  );

  const isAndroid = /Android/i.test(ua) || (
    typeof window !== 'undefined' &&
    Boolean(
      (window as unknown as { __PUMPKIN_ANDROID__?: unknown }).__PUMPKIN_ANDROID__ ||
      (window as unknown as { __NCKDEV_ANDROID__?: unknown }).__NCKDEV_ANDROID__
    )
  );

  if (isAndroid) {
    return new AndroidPlatformAdapter();
  }

  if (isTauri) {
    return new DesktopPlatformAdapter();
  }

  return new BrowserPlatformAdapter();
}

export const platformAdapter: PlatformAdapter = createPlatformAdapter();
export const platform = platformAdapter;
