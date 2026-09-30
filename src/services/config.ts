/**
 * pumpkin - Central Endpoint & Network Configuration
 */

const getApiBaseUrl = (): string => {
  // Explicit environment variable takes precedence
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // If running in browser or webview with valid HTTP(S) origin
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    if (window.location.origin.startsWith('http')) {
      return window.location.origin;
    }
  }

  // Fallback for native standalone builds
  return 'https://ais-dev-nje4yrkvioahqn5r6u3asg-590954087514.us-east1.run.app';
};

const getWsUrl = (): string => {
  // Explicit environment variable takes precedence
  if (import.meta.env.VITE_WS_URL) {
    return import.meta.env.VITE_WS_URL;
  }

  // Browser / WebView detection
  if (typeof window !== 'undefined' && window.location && window.location.host) {
    if (window.location.origin.startsWith('http')) {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      return `${protocol}//${window.location.host}/ws`;
    }
  }

  // Fallback for native standalone builds
  return 'wss://ais-dev-nje4yrkvioahqn5r6u3asg-590954087514.us-east1.run.app/ws';
};

export const API_BASE_URL = getApiBaseUrl();
export const WS_URL = getWsUrl();
export const APP_VERSION = '1.0.0';
export const APP_NAME = 'pumpkin';
