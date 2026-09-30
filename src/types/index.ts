/**
 * pumpkin - Core Type Definitions
 */

export interface User {
  id: string;
  displayName: string;
  avatarColor: string;
  isOnline: boolean;
  voiceChannelId: string | null;
  isMuted: boolean;
  isDeafened: boolean;
  isSpeaking: boolean;
  isScreenSharing: boolean;
  screenShareChannelId: string | null;
  joinedAt: number;
}

export type ChannelType = 'text' | 'voice';

export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  description?: string;
  userLimit?: number;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  userId: string;
  displayName: string;
  avatarColor: string;
  content: string;
  createdAt: number;
}

export type NetworkQuality = 'Excelente' | 'Boa' | 'Instável' | 'Ruim';

export interface NetworkStats {
  quality: NetworkQuality;
  rttMs: number;
  packetsLost: number;
  jitterMs: number;
  bitrateKbps: number;
  fps: number;
  codec?: string;
}

export type ScreenShareProfile = '1080p60' | '1080p30' | '720p60' | '720p30' | 'auto';

export interface AudioSettings {
  audioInputDeviceId: string;
  audioOutputDeviceId: string;
  echoCancellation: boolean;
  noiseSuppression: boolean;
  autoGainControl: boolean;
  inputVolume: number;
  inputMode: 'activity' | 'push-to-talk';
  pushToTalkKey: string;
}

export interface StreamSettings {
  profile: ScreenShareProfile;
  captureAudio: boolean;
  contentHint: 'detail' | 'motion' | 'text';
}

export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  description?: string;
}

// WebSocket Signaling Messages
export type ClientSignalMessage =
  | { type: 'auth'; payload: { userId: string; displayName: string; avatarColor: string } }
  | { type: 'ping' }
  | { type: 'chat:send'; payload: { channelId: string; content: string } }
  | { type: 'voice:join'; payload: { channelId: string; isMuted: boolean; isDeafened: boolean } }
  | { type: 'voice:leave'; payload: { channelId: string } }
  | { type: 'voice:state'; payload: { isMuted: boolean; isDeafened: boolean; isSpeaking: boolean } }
  | { type: 'screen:start'; payload: { channelId: string } }
  | { type: 'screen:stop'; payload: { channelId: string } }
  | {
      type: 'rtc:signal';
      payload: {
        toUserId: string;
        channelId: string;
        mediaType: 'voice' | 'screen';
        signal: {
          sdp?: RTCSessionDescriptionInit;
          candidate?: RTCIceCandidateInit;
        };
      };
    };

export type ServerSignalMessage =
  | { type: 'pong' }
  | { type: 'auth:ack'; payload: { user: User; users: User[]; messages: Record<string, ChatMessage[]> } }
  | { type: 'user:joined'; payload: { user: User } }
  | { type: 'user:updated'; payload: { user: User } }
  | { type: 'user:left'; payload: { userId: string } }
  | { type: 'chat:message'; payload: { message: ChatMessage } }
  | { type: 'voice:peer-joined'; payload: { userId: string; channelId: string } }
  | { type: 'voice:peer-left'; payload: { userId: string; channelId: string } }
  | { type: 'screen:started'; payload: { userId: string; channelId: string } }
  | { type: 'screen:stopped'; payload: { userId: string; channelId: string } }
  | {
      type: 'rtc:signal';
      payload: {
        fromUserId: string;
        channelId: string;
        mediaType: 'voice' | 'screen';
        signal: {
          sdp?: RTCSessionDescriptionInit;
          candidate?: RTCIceCandidateInit;
        };
      };
    }
  | { type: 'error'; payload: { message: string } };
