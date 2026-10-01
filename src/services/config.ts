/**
 * pumpkin - Central Endpoint & Network Configuration
 *
 * Browser builds use same-origin by default.
 * Native production builds MUST receive VITE_API_BASE_URL and VITE_WS_URL
 * at build time. We intentionally never fall back to AI Studio preview URLs.
 */

const isTauriRuntime = (): boolean =>
  typeof window !== 'undefined' &&
  Boolean(
    (window as unknown as { __TAURI__?: unknown }).__TAURI__ ||
    (window as unknown as { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__
  );

const isHttpOrigin = (): boolean =>
  typeof window !== 'undefined' &&
  Boolean(window.location?.origin) &&
  window.location.origin.startsWith('http');

const getApiBaseUrl = (): string => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, '');
  }

  if (isTauriRuntime()) {
    return import.meta.env.DEV ? 'http://localhost:3000' : '';
  }

  if (isHttpOrigin()) {
    return window.location.origin;
  }

  return import.meta.env.DEV ? 'http://localhost:3000' : '';
};

const getWsUrl = (): string => {
  if (import.meta.env.VITE_WS_URL) {
    return import.meta.env.VITE_WS_URL;
  }

  if (isTauriRuntime()) {
    return import.meta.env.DEV ? 'ws://localhost:3000/ws' : '';
  }

  if (isHttpOrigin()) {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}/ws`;
  }

  return import.meta.env.DEV ? 'ws://localhost:3000/ws' : '';
};

export const API_BASE_URL = getApiBaseUrl();
export const WS_URL = getWsUrl();
export const APP_VERSION = '1.0.2';
export const APP_NAME = 'pumpkin';

export const hasProductionBackendConfig = Boolean(API_BASE_URL && WS_URL);
