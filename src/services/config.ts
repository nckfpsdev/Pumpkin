/**
 * pumpkin - Central Endpoint & Network Configuration
 *
 * Web builds use same-origin by default.
 * Native production builds MUST receive VITE_API_BASE_URL and VITE_WS_URL
 * at build time. We intentionally do not fall back to AI Studio/Cloud Run
 * development URLs because those can require session cookies and break
 * installed clients.
 */

const isHttpOrigin = (): boolean =>
  typeof window !== 'undefined' &&
  Boolean(window.location?.origin) &&
  window.location.origin.startsWith('http');

const getApiBaseUrl = (): string => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, '');
  }

  if (isHttpOrigin()) {
    return window.location.origin;
  }

  if (import.meta.env.DEV) {
    return 'http://localhost:3000';
  }

  return '';
};

const getWsUrl = (): string => {
  if (import.meta.env.VITE_WS_URL) {
    return import.meta.env.VITE_WS_URL;
  }

  if (isHttpOrigin()) {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}/ws`;
  }

  if (import.meta.env.DEV) {
    return 'ws://localhost:3000/ws';
  }

  return '';
};

export const API_BASE_URL = getApiBaseUrl();
export const WS_URL = getWsUrl();
export const APP_VERSION = '1.0.2';
export const APP_NAME = 'pumpkin';

export const hasProductionBackendConfig = Boolean(API_BASE_URL && WS_URL);
