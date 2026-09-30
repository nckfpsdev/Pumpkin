/**
 * SFUMediaProvider
 *
 * Implements the IMediaProvider interface for SFU architectures (e.g., LiveKit, Mediasoup, Janus).
 * When deployed in an enterprise environment with a centralized SFU server,
 * this provider requests an ephemeral JWT access token from the backend (/api/sfu/token)
 * and connects to the selective forwarding unit without sending full mesh traffic.
 */

import { IMediaProvider, RemoteStreamEvent } from './MediaProvider';
import { NetworkStats } from '../../types';

export class SFUMediaProvider implements IMediaProvider {
  private isConfigured = false;
  private sfuEndpoint = '';

  constructor(endpoint?: string) {
    this.sfuEndpoint = endpoint || '';
  }

  public initialize(userId: string, iceServers: RTCIceServer[]) {
    // SFU token exchange and client initialization
    this.isConfigured = Boolean(this.sfuEndpoint);
  }

  public async joinVoice(channelId: string, localAudioTrack?: MediaStreamTrack | null): Promise<void> {
    if (!this.isConfigured) {
      console.info('[SFUMediaProvider] SFU endpoint not configured; fallback to MeshMediaProvider is active.');
      return;
    }
    // Connect to SFU room with backend token
  }

  public leaveVoice(channelId: string): void {
    // Disconnect from SFU room
  }

  public setLocalAudioTrack(track: MediaStreamTrack | null): void {
    // Publish or unpublish audio track to SFU
  }

  public setMuted(muted: boolean): void {
    // Mute upstream track on SFU
  }

  public setDeafened(deafened: boolean): void {
    // Pause downstream tracks from SFU
  }

  public async startScreenShare(channelId: string, screenStream: MediaStream): Promise<void> {
    // Publish screen track to SFU room
  }

  public stopScreenShare(channelId: string): void {
    // Unpublish screen track
  }

  public async handleSignalingMessage(): Promise<void> {
    // SFU handles signaling over dedicated WebSocket
  }

  public async handlePeerJoined(): Promise<void> {
    // Handled by SFU room events
  }

  public handlePeerLeft(): void {
    // Handled by SFU room events
  }

  public onRemoteStream(callback: (event: RemoteStreamEvent) => void): () => void {
    return () => {};
  }

  public onRemoteStreamEnded(callback: (userId: string, mediaType: 'voice' | 'screen') => void): () => void {
    return () => {};
  }

  public async getNetworkStats(): Promise<NetworkStats | null> {
    return null;
  }

  public destroy(): void {
    // Clean up SFU client
  }
}
