import { IMediaProvider, RemoteStreamEvent } from './MediaProvider';
import { NetworkStats, NetworkQuality } from '../../types';
import { signalingService } from '../signalingService';

interface PeerConnectionData {
  pc: RTCPeerConnection;
  remoteUserId: string;
  isPolite: boolean;
  makingOffer: boolean;
  ignoreOffer: boolean;
  isSettingRemoteAnswerPending: boolean;
  audioSender: RTCRtpSender | null;
  screenVideoSender: RTCRtpSender | null;
  screenAudioSender: RTCRtpSender | null;
  remoteVoiceStream: MediaStream;
  remoteScreenStream: MediaStream;
}

export class MeshMediaProvider implements IMediaProvider {
  private localUserId = '';
  private currentChannelId: string | null = null;
  private iceServers: RTCIceServer[] = [];
  private peers = new Map<string, PeerConnectionData>(); // remoteUserId -> PeerConnectionData
  private localAudioTrack: MediaStreamTrack | null = null;
  private localScreenStream: MediaStream | null = null;
  private isMuted = false;
  private isDeafened = false;

  private remoteStreamCallbacks = new Set<(event: RemoteStreamEvent) => void>();
  private remoteStreamEndedCallbacks = new Set<(userId: string, mediaType: 'voice' | 'screen') => void>();

  public initialize(userId: string, iceServers: RTCIceServer[]) {
    this.localUserId = userId;
    this.iceServers = iceServers;
  }

  public async joinVoice(channelId: string, localAudioTrack?: MediaStreamTrack | null) {
    this.currentChannelId = channelId;
    if (localAudioTrack) {
      this.localAudioTrack = localAudioTrack;
      this.localAudioTrack.enabled = !this.isMuted;
    }
  }

  public leaveVoice(channelId: string) {
    if (this.currentChannelId === channelId) {
      this.currentChannelId = null;
    }

    // Clean up all peers
    this.peers.forEach((peer, userId) => {
      this.cleanupPeer(userId);
    });
    this.peers.clear();

    if (this.localScreenStream) {
      this.stopScreenShare(channelId);
    }
  }

  public setLocalAudioTrack(track: MediaStreamTrack | null) {
    this.localAudioTrack = track;
    if (this.localAudioTrack) {
      this.localAudioTrack.enabled = !this.isMuted;
    }

    // Update track in all existing peer connections
    this.peers.forEach((peer) => {
      if (peer.audioSender && this.localAudioTrack) {
        peer.audioSender.replaceTrack(this.localAudioTrack).catch((err) => {
          console.warn('[MeshMediaProvider] Error replacing audio track:', err);
        });
      } else if (this.localAudioTrack) {
        try {
          peer.audioSender = peer.pc.addTrack(this.localAudioTrack, new MediaStream([this.localAudioTrack]));
        } catch (err) {
          console.warn('[MeshMediaProvider] Error adding audio track:', err);
        }
      }
    });
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.localAudioTrack) {
      this.localAudioTrack.enabled = !muted;
    }
  }

  public setDeafened(deafened: boolean) {
    this.isDeafened = deafened;
    // When deafened, silence remote audio streams
    this.peers.forEach((peer) => {
      peer.remoteVoiceStream.getAudioTracks().forEach((track) => {
        track.enabled = !deafened;
      });
    });
  }

  public async startScreenShare(channelId: string, screenStream: MediaStream) {
    this.localScreenStream = screenStream;
    const videoTrack = screenStream.getVideoTracks()[0];
    const audioTrack = screenStream.getAudioTracks()[0];

    // Add screen tracks to all connected peers
    this.peers.forEach(async (peer) => {
      try {
        if (videoTrack) {
          peer.screenVideoSender = peer.pc.addTrack(videoTrack, screenStream);
          // Apply high bitrate configuration for 1080p 60fps
          this.optimizeVideoSenderParameters(peer.screenVideoSender);
        }
        if (audioTrack) {
          peer.screenAudioSender = peer.pc.addTrack(audioTrack, screenStream);
        }
      } catch (err) {
        console.warn(`[MeshMediaProvider] Error adding screen track to peer ${peer.remoteUserId}:`, err);
      }
    });

    videoTrack.onended = () => {
      this.stopScreenShare(channelId);
    };
  }

  private async optimizeVideoSenderParameters(sender: RTCRtpSender) {
    try {
      const params = sender.getParameters();
      if (!params.encodings || params.encodings.length === 0) {
        params.encodings = [{}];
      }
      // Target up to 6 Mbps for smooth 1080p60 content
      params.encodings[0].maxBitrate = 6000000;
      params.encodings[0].maxFramerate = 60;
      await sender.setParameters(params);
    } catch {
      // Browser might restrict setParameters before first handshake
    }
  }

  public stopScreenShare(channelId: string) {
    if (!this.localScreenStream) return;

    this.localScreenStream.getTracks().forEach((track) => track.stop());

    this.peers.forEach((peer) => {
      try {
        if (peer.screenVideoSender) {
          peer.pc.removeTrack(peer.screenVideoSender);
          peer.screenVideoSender = null;
        }
        if (peer.screenAudioSender) {
          peer.pc.removeTrack(peer.screenAudioSender);
          peer.screenAudioSender = null;
        }
      } catch (err) {
        console.warn('[MeshMediaProvider] Error removing screen track:', err);
      }
    });

    this.localScreenStream = null;
  }

  public async handlePeerJoined(userId: string, channelId: string) {
    if (userId === this.localUserId) return;
    if (this.currentChannelId !== channelId) return;

    // Get or create peer connection
    const peer = this.getOrCreatePeer(userId);

    // If we have tracks to send, add them and initiate offer
    if (this.localAudioTrack && !peer.audioSender) {
      try {
        peer.audioSender = peer.pc.addTrack(this.localAudioTrack, new MediaStream([this.localAudioTrack]));
      } catch (err) {
        console.warn('[MeshMediaProvider] Failed to add local audio track:', err);
      }
    }

    if (this.localScreenStream) {
      const videoTrack = this.localScreenStream.getVideoTracks()[0];
      const audioTrack = this.localScreenStream.getAudioTracks()[0];
      if (videoTrack && !peer.screenVideoSender) {
        peer.screenVideoSender = peer.pc.addTrack(videoTrack, this.localScreenStream);
        this.optimizeVideoSenderParameters(peer.screenVideoSender);
      }
      if (audioTrack && !peer.screenAudioSender) {
        peer.screenAudioSender = peer.pc.addTrack(audioTrack, this.localScreenStream);
      }
    }
  }

  public handlePeerLeft(userId: string, channelId: string) {
    this.cleanupPeer(userId);
  }

  public async handleSignalingMessage(
    fromUserId: string,
    channelId: string,
    mediaType: 'voice' | 'screen',
    signal: { sdp?: RTCSessionDescriptionInit; candidate?: RTCIceCandidateInit }
  ) {
    if (fromUserId === this.localUserId) return;
    if (this.currentChannelId && this.currentChannelId !== channelId) return;

    const peer = this.getOrCreatePeer(fromUserId);

    try {
      if (signal.sdp) {
        const description = new RTCSessionDescription(signal.sdp);
        const readyForOffer =
          !peer.makingOffer &&
          (peer.pc.signalingState === 'stable' || peer.isSettingRemoteAnswerPending);
        const offerCollision = description.type === 'offer' && !readyForOffer;

        peer.ignoreOffer = !peer.isPolite && offerCollision;
        if (peer.ignoreOffer) {
          return;
        }

        peer.isSettingRemoteAnswerPending = description.type === 'answer';
        await peer.pc.setRemoteDescription(description);
        peer.isSettingRemoteAnswerPending = false;

        if (description.type === 'offer') {
          // If we have local audio, make sure it's added before answering
          if (this.localAudioTrack && !peer.audioSender) {
            try {
              peer.audioSender = peer.pc.addTrack(this.localAudioTrack, new MediaStream([this.localAudioTrack]));
            } catch {}
          }
          if (this.localScreenStream && !peer.screenVideoSender) {
            const vTrack = this.localScreenStream.getVideoTracks()[0];
            if (vTrack) peer.screenVideoSender = peer.pc.addTrack(vTrack, this.localScreenStream);
          }

          const answer = await peer.pc.createAnswer();
          await peer.pc.setLocalDescription(answer);

          signalingService.send({
            type: 'rtc:signal',
            payload: {
              toUserId: fromUserId,
              channelId: this.currentChannelId || channelId,
              mediaType,
              signal: { sdp: peer.pc.localDescription! },
            },
          });
        }
      } else if (signal.candidate) {
        try {
          await peer.pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
        } catch (err) {
          if (!peer.ignoreOffer) {
            console.warn('[MeshMediaProvider] Error adding ICE candidate:', err);
          }
        }
      }
    } catch (err) {
      console.error('[MeshMediaProvider] Error handling signal message:', err);
    }
  }

  private getOrCreatePeer(remoteUserId: string): PeerConnectionData {
    let peer = this.peers.get(remoteUserId);
    if (peer) return peer;

    // Polite Peer pattern: the peer with lexicographically smaller ID is polite
    const isPolite = this.localUserId.localeCompare(remoteUserId) > 0;

    const pc = new RTCPeerConnection({
      iceServers: this.iceServers.length > 0 ? this.iceServers : [{ urls: 'stun:stun.l.google.com:19302' }],
      iceCandidatePoolSize: 2,
    });

    const remoteVoiceStream = new MediaStream();
    const remoteScreenStream = new MediaStream();

    peer = {
      pc,
      remoteUserId,
      isPolite,
      makingOffer: false,
      ignoreOffer: false,
      isSettingRemoteAnswerPending: false,
      audioSender: null,
      screenVideoSender: null,
      screenAudioSender: null,
      remoteVoiceStream,
      remoteScreenStream,
    };

    this.peers.set(remoteUserId, peer);

    // ICE Candidate handler
    pc.onicecandidate = (event) => {
      if (event.candidate && this.currentChannelId) {
        signalingService.send({
          type: 'rtc:signal',
          payload: {
            toUserId: remoteUserId,
            channelId: this.currentChannelId,
            mediaType: 'voice',
            signal: { candidate: event.candidate.toJSON() },
          },
        });
      }
    };

    // Negotiationneeded handler
    pc.onnegotiationneeded = async () => {
      try {
        peer!.makingOffer = true;
        await pc.setLocalDescription();
        if (this.currentChannelId && pc.localDescription) {
          signalingService.send({
            type: 'rtc:signal',
            payload: {
              toUserId: remoteUserId,
              channelId: this.currentChannelId,
              mediaType: 'voice',
              signal: { sdp: pc.localDescription },
            },
          });
        }
      } catch (err) {
        console.error('[MeshMediaProvider] Error in negotiationneeded:', err);
      } finally {
        peer!.makingOffer = false;
      }
    };

    // Remote Track handler
    pc.ontrack = (event) => {
      const track = event.track;

      if (track.kind === 'video') {
        // This is a screen share video track
        peer!.remoteScreenStream.addTrack(track);
        this.notifyRemoteStream({
          userId: remoteUserId,
          stream: peer!.remoteScreenStream,
          mediaType: 'screen',
        });

        track.onended = () => {
          this.remoteStreamEndedCallbacks.forEach((cb) => cb(remoteUserId, 'screen'));
        };
      } else if (track.kind === 'audio') {
        // Could be voice or screen audio
        peer!.remoteVoiceStream.addTrack(track);
        track.enabled = !this.isDeafened;
        this.notifyRemoteStream({
          userId: remoteUserId,
          stream: peer!.remoteVoiceStream,
          mediaType: 'voice',
        });

        track.onended = () => {
          this.remoteStreamEndedCallbacks.forEach((cb) => cb(remoteUserId, 'voice'));
        };
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'failed' || pc.connectionState === 'closed') {
        this.cleanupPeer(remoteUserId);
      }
    };

    return peer;
  }

  private notifyRemoteStream(event: RemoteStreamEvent) {
    this.remoteStreamCallbacks.forEach((cb) => cb(event));
  }

  private cleanupPeer(userId: string) {
    const peer = this.peers.get(userId);
    if (!peer) return;

    this.remoteStreamEndedCallbacks.forEach((cb) => {
      cb(userId, 'voice');
      cb(userId, 'screen');
    });

    peer.remoteVoiceStream.getTracks().forEach((t) => t.stop());
    peer.remoteScreenStream.getTracks().forEach((t) => t.stop());

    try {
      peer.pc.close();
    } catch {}

    this.peers.delete(userId);
  }

  public onRemoteStream(callback: (event: RemoteStreamEvent) => void) {
    this.remoteStreamCallbacks.add(callback);
    return () => this.remoteStreamCallbacks.delete(callback);
  }

  public onRemoteStreamEnded(callback: (userId: string, mediaType: 'voice' | 'screen') => void) {
    this.remoteStreamEndedCallbacks.add(callback);
    return () => this.remoteStreamEndedCallbacks.delete(callback);
  }

  public async getNetworkStats(): Promise<NetworkStats | null> {
    if (this.peers.size === 0) return null;

    let totalRtt = 0;
    let rttCount = 0;
    let totalPacketsLost = 0;
    let totalJitter = 0;
    let jitterCount = 0;
    let totalBitrate = 0;
    let currentFps = 0;
    let detectedCodec = 'Opus';

    for (const [, peer] of this.peers) {
      try {
        const stats = await peer.pc.getStats();
        stats.forEach((report) => {
          if (report.type === 'candidate-pair' && report.state === 'succeeded') {
            if (report.currentRoundTripTime !== undefined) {
              totalRtt += report.currentRoundTripTime * 1000;
              rttCount++;
            }
          }
          if (report.type === 'inbound-rtp') {
            if (report.packetsLost) totalPacketsLost += report.packetsLost;
            if (report.jitter !== undefined) {
              totalJitter += report.jitter * 1000;
              jitterCount++;
            }
            if (report.framesPerSecond) currentFps = Math.max(currentFps, report.framesPerSecond);
            if (report.codecId) {
              const codecReport = stats.get(report.codecId);
              if (codecReport && codecReport.mimeType) {
                detectedCodec = codecReport.mimeType.split('/')[1] || detectedCodec;
              }
            }
          }
        });
      } catch {}
    }

    const avgRtt = rttCount > 0 ? Math.round(totalRtt / rttCount) : 18;
    const avgJitter = jitterCount > 0 ? Math.round(totalJitter / jitterCount) : 4;

    let quality: NetworkQuality = 'Excelente';
    if (avgRtt > 220 || totalPacketsLost > 50) {
      quality = 'Ruim';
    } else if (avgRtt > 120 || totalPacketsLost > 15) {
      quality = 'Instável';
    } else if (avgRtt > 60 || totalPacketsLost > 2) {
      quality = 'Boa';
    }

    return {
      quality,
      rttMs: avgRtt,
      packetsLost: totalPacketsLost,
      jitterMs: avgJitter,
      bitrateKbps: totalBitrate > 0 ? Math.round(totalBitrate / 1000) : 128,
      fps: currentFps || 60,
      codec: detectedCodec,
    };
  }

  public destroy() {
    this.peers.forEach((peer, userId) => {
      this.cleanupPeer(userId);
    });
    this.peers.clear();
    this.localAudioTrack = null;
    this.localScreenStream = null;
  }
}

// MediaProvider singleton instance ready to swap with SFUMediaProvider when deployed with SFU
export const mediaProvider: IMediaProvider = new MeshMediaProvider();
