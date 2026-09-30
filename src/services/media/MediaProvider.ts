import { NetworkStats } from '../../types';

export interface RemoteStreamEvent {
  userId: string;
  stream: MediaStream;
  mediaType: 'voice' | 'screen';
}

export interface IMediaProvider {
  initialize(userId: string, iceServers: RTCIceServer[]): void;
  joinVoice(channelId: string, localAudioTrack?: MediaStreamTrack | null): Promise<void>;
  leaveVoice(channelId: string): void;
  setLocalAudioTrack(track: MediaStreamTrack | null): void;
  setMuted(muted: boolean): void;
  setDeafened(deafened: boolean): void;
  startScreenShare(channelId: string, screenStream: MediaStream): Promise<void>;
  stopScreenShare(channelId: string): void;
  handleSignalingMessage(
    fromUserId: string,
    channelId: string,
    mediaType: 'voice' | 'screen',
    signal: { sdp?: RTCSessionDescriptionInit; candidate?: RTCIceCandidateInit }
  ): Promise<void>;
  handlePeerJoined(userId: string, channelId: string): Promise<void>;
  handlePeerLeft(userId: string, channelId: string): void;
  onRemoteStream(callback: (event: RemoteStreamEvent) => void): () => void;
  onRemoteStreamEnded(callback: (userId: string, mediaType: 'voice' | 'screen') => void): () => void;
  getNetworkStats(): Promise<NetworkStats | null>;
  destroy(): void;
}
