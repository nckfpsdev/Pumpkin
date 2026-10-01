import { ClientSignalMessage, ServerSignalMessage } from '../types';
import { WS_URL } from './config';

type MessageHandler = (msg: ServerSignalMessage) => void;
type StatusHandler = (status: 'connected' | 'connecting' | 'disconnected' | 'reconnecting') => void;

class SignalingService {
  private ws: WebSocket | null = null;
  private messageHandlers: Set<MessageHandler> = new Set();
  private statusHandlers: Set<StatusHandler> = new Set();
  private reconnectTimer: NodeJS.Timeout | null = null;
  private pingInterval: NodeJS.Timeout | null = null;
  private reconnectAttempts = 0;
  private isIntentionallyClosed = false;
  private currentStatus: 'connected' | 'connecting' | 'disconnected' | 'reconnecting' = 'disconnected';
  private pendingAuth: { userId: string; displayName: string; avatarColor: string } | null = null;

  public connect(authData: { userId: string; displayName: string; avatarColor: string }) {
    this.pendingAuth = authData;
    this.isIntentionallyClosed = false;

    if (!WS_URL) {
      console.error(
        '[Signaling] VITE_WS_URL is not configured. Native production releases must be built with a public WSS endpoint.'
      );
      this.setStatus('disconnected');
      return;
    }

    this.initSocket();
  }

  private setStatus(status: 'connected' | 'connecting' | 'disconnected' | 'reconnecting') {
    this.currentStatus = status;
    this.statusHandlers.forEach((handler) => handler(status));
  }

  public getStatus() {
    return this.currentStatus;
  }

  private initSocket() {
    if (!WS_URL) {
      this.setStatus('disconnected');
      return;
    }

    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.setStatus(this.reconnectAttempts > 0 ? 'reconnecting' : 'connecting');

    try {
      this.ws = new WebSocket(WS_URL);

      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
        this.setStatus('connected');

        if (this.pendingAuth) {
          this.send({
            type: 'auth',
            payload: this.pendingAuth,
          });
        }

        if (this.pingInterval) clearInterval(this.pingInterval);
        this.pingInterval = setInterval(() => {
          this.send({ type: 'ping' });
        }, 15000);
      };

      this.ws.onmessage = (event) => {
        try {
          const msg: ServerSignalMessage = JSON.parse(event.data);
          this.messageHandlers.forEach((handler) => handler(msg));
        } catch (err) {
          console.error('[Signaling] Failed to parse message:', err);
        }
      };

      this.ws.onclose = () => {
        if (this.pingInterval) clearInterval(this.pingInterval);

        if (!this.isIntentionallyClosed) {
          this.setStatus('disconnected');
          this.scheduleReconnect();
        } else {
          this.setStatus('disconnected');
        }
      };

      this.ws.onerror = (err) => {
        console.warn('[Signaling] WebSocket error:', err);
        this.ws?.close();
      };
    } catch (err) {
      console.error('[Signaling] Failed to create WebSocket:', err);
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (!WS_URL || this.isIntentionallyClosed) {
      this.setStatus('disconnected');
      return;
    }

    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    const delay = Math.min(1000 * Math.pow(1.5, this.reconnectAttempts), 8000);
    this.reconnectAttempts++;

    this.reconnectTimer = setTimeout(() => {
      if (!this.isIntentionallyClosed) {
        this.initSocket();
      }
    }, delay);
  }

  public send(message: ClientSignalMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  public onMessage(handler: MessageHandler) {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  public onStatusChange(handler: StatusHandler) {
    this.statusHandlers.add(handler);
    handler(this.currentStatus);
    return () => this.statusHandlers.delete(handler);
  }

  public disconnect() {
    this.isIntentionallyClosed = true;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.pingInterval) clearInterval(this.pingInterval);
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.setStatus('disconnected');
  }
}

export const signalingService = new SignalingService();
