import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import {
  User,
  Channel,
  ChatMessage,
  AudioSettings,
  StreamSettings,
  ToastMessage,
  NetworkStats,
} from '../types';
import { CHANNELS, DEFAULT_STUN_SERVERS } from '../utils/constants';
import {
  generateUUID,
  getAvatarColor,
  validateNickname,
} from '../utils/helpers';
import { signalingService } from '../services/signalingService';
import { mediaService } from '../services/mediaService';
import { mediaProvider } from '../services/media/MeshMediaProvider';
import { AudioLevelMonitor } from '../services/audioAnalyser';
import { API_BASE_URL } from '../services/config';
import { notificationAdapter } from '../services/platform/NotificationAdapter';

interface AppContextType {
  // User Session
  currentUser: User | null;
  users: User[];
  login: (nickname: string) => { success: boolean; error?: string };
  logout: () => void;

  // Channels & Chat
  channels: Channel[];
  currentTextChannel: Channel;
  selectTextChannel: (channelId: string) => void;
  messages: ChatMessage[];
  sendMessage: (content: string) => void;

  // Voice & Screen
  currentVoiceChannel: Channel | null;
  joinVoiceChannel: (channelId: string) => Promise<void>;
  leaveVoiceChannel: () => void;
  isMuted: boolean;
  isDeafened: boolean;
  toggleMute: () => void;
  toggleDeafen: () => void;
  isSharingScreen: boolean;
  activeScreenShare: { user: User; stream: MediaStream } | null;
  startScreenShare: () => Promise<void>;
  stopScreenShare: () => void;

  // Status & Metrics
  connectionStatus: 'connected' | 'connecting' | 'disconnected' | 'reconnecting';
  networkStats: NetworkStats | null;

  // Settings
  audioSettings: AudioSettings;
  streamSettings: StreamSettings;
  updateAudioSettings: (settings: Partial<AudioSettings>) => void;
  updateStreamSettings: (settings: Partial<StreamSettings>) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Modals
  isSettingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const DEFAULT_AUDIO_SETTINGS: AudioSettings = {
  audioInputDeviceId: 'default',
  audioOutputDeviceId: 'default',
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
  inputVolume: 100,
  inputMode: 'activity',
  pushToTalkKey: 'v',
};

const DEFAULT_STREAM_SETTINGS: StreamSettings = {
  profile: '1080p60',
  captureAudio: true,
  contentHint: 'detail',
};

// Helper to seamlessly migrate localStorage keys from nckdev to pumpkin
function getMigratedStorageItem(newKey: string, legacyKey: string): string | null {
  try {
    const newVal = localStorage.getItem(newKey);
    if (newVal !== null) return newVal;
    const legacyVal = localStorage.getItem(legacyKey);
    if (legacyVal !== null) {
      // Migrate forward seamlessly
      localStorage.setItem(newKey, legacyVal);
      return legacyVal;
    }
    return null;
  } catch {
    return null;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // User Session
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = getMigratedStorageItem('pumpkin_user', 'nckdev_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [users, setUsers] = useState<User[]>([]);
  const [currentTextChannelId, setCurrentTextChannelId] = useState<string>('text-geral');
  const [currentVoiceChannelId, setCurrentVoiceChannelId] = useState<string | null>(null);
  const [allMessages, setAllMessages] = useState<Record<string, ChatMessage[]>>({});

  // Voice & Screen state
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [activeScreenShare, setActiveScreenShare] = useState<{ user: User; stream: MediaStream } | null>(null);

  // Network & Status
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected' | 'reconnecting'>('disconnected');
  const [networkStats, setNetworkStats] = useState<NetworkStats | null>(null);

  // Settings
  const [audioSettings, setAudioSettings] = useState<AudioSettings>(() => {
    try {
      const saved = getMigratedStorageItem('pumpkin_audio_settings', 'nckdev_audio_settings');
      return saved ? { ...DEFAULT_AUDIO_SETTINGS, ...JSON.parse(saved) } : DEFAULT_AUDIO_SETTINGS;
    } catch {
      return DEFAULT_AUDIO_SETTINGS;
    }
  });

  const [streamSettings, setStreamSettings] = useState<StreamSettings>(() => {
    try {
      const saved = getMigratedStorageItem('pumpkin_stream_settings', 'nckdev_stream_settings');
      return saved ? { ...DEFAULT_STREAM_SETTINGS, ...JSON.parse(saved) } : DEFAULT_STREAM_SETTINGS;
    } catch {
      return DEFAULT_STREAM_SETTINGS;
    }
  });

  // UI state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Audio references
  const audioElementsRef = useRef<Map<string, HTMLAudioElement>>(new Map()); // userId -> AudioElement
  const localVoiceMonitorRef = useRef<AudioLevelMonitor>(new AudioLevelMonitor());
  const pushToTalkPressedRef = useRef(false);

  // Helper Toast
  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch ICE servers and init mediaProvider
  useEffect(() => {
    const initIceServers = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/ice-servers`);
        if (res.ok) {
          const data = await res.json();
          if (currentUser) {
            mediaProvider.initialize(currentUser.id, data.iceServers || DEFAULT_STUN_SERVERS);
          }
        }
      } catch {
        if (currentUser) {
          mediaProvider.initialize(currentUser.id, DEFAULT_STUN_SERVERS);
        }
      }
    };
    initIceServers();
  }, [currentUser?.id]);

  // Connect WebSocket when currentUser is set
  useEffect(() => {
    if (!currentUser) return;

    signalingService.connect({
      userId: currentUser.id,
      displayName: currentUser.displayName,
      avatarColor: currentUser.avatarColor,
    });

    const unsubStatus = signalingService.onStatusChange((status) => {
      setConnectionStatus(status);
      if (status === 'reconnecting') {
        addToast({ type: 'warning', title: 'Reconectando ao servidor...' });
      } else if (status === 'connected') {
        // Connected toast
      }
    });

    const unsubMessages = signalingService.onMessage((msg) => {
      switch (msg.type) {
        case 'auth:ack': {
          setUsers(msg.payload.users);
          setAllMessages(msg.payload.messages);
          break;
        }

        case 'user:joined': {
          setUsers((prev) => {
            const exists = prev.some((u) => u.id === msg.payload.user.id);
            if (exists) {
              return prev.map((u) => (u.id === msg.payload.user.id ? msg.payload.user : u));
            }
            return [...prev, msg.payload.user];
          });
          break;
        }

        case 'user:updated': {
          setUsers((prev) => prev.map((u) => (u.id === msg.payload.user.id ? msg.payload.user : u)));
          break;
        }

        case 'user:left': {
          const { userId } = msg.payload;
          setUsers((prev) => prev.filter((u) => u.id !== userId));

          // Clean up remote audio element if any
          const audioElem = audioElementsRef.current.get(userId);
          if (audioElem) {
            audioElem.pause();
            audioElem.srcObject = null;
            audioElem.remove();
            audioElementsRef.current.delete(userId);
          }

          // If leaving user was screen sharing, clear active share
          setActiveScreenShare((current) => {
            if (current && current.user.id === userId) {
              return null;
            }
            return current;
          });
          break;
        }

        case 'chat:message': {
          const { message } = msg.payload;
          setAllMessages((prev) => {
            const list = prev[message.channelId] || [];
            return {
              ...prev,
              [message.channelId]: [...list, message],
            };
          });

          if (message.userId !== currentUser.id) {
            notificationAdapter.notify({
              title: `${message.displayName} em #${CHANNELS.find((c) => c.id === message.channelId)?.name || 'chat'}`,
              body: message.content,
            });
          }
          break;
        }

        case 'voice:peer-joined': {
          const { userId, channelId } = msg.payload;
          mediaProvider.handlePeerJoined(userId, channelId);
          break;
        }

        case 'voice:peer-left': {
          const { userId, channelId } = msg.payload;
          mediaProvider.handlePeerLeft(userId, channelId);
          break;
        }

        case 'screen:started': {
          const { userId, channelId } = msg.payload;
          // Notice for remote users
          const sharer = users.find((u) => u.id === userId);
          if (sharer && userId !== currentUser.id) {
            const chName = CHANNELS.find((c) => c.id === channelId)?.name || 'Voz';
            addToast({
              type: 'info',
              title: `${sharer.displayName} começou a compartilhar a tela`,
              description: `Canal: ${chName}`,
            });
            notificationAdapter.notify({
              title: 'Compartilhamento de Tela',
              body: `${sharer.displayName} começou a transmitir em ${chName}`,
            });
          }
          break;
        }

        case 'screen:stopped': {
          const { userId } = msg.payload;
          setActiveScreenShare((current) => {
            if (current && current.user.id === userId) {
              addToast({ type: 'info', title: 'Compartilhamento de tela encerrado' });
              return null;
            }
            return current;
          });
          break;
        }

        case 'rtc:signal': {
          const { fromUserId, channelId, mediaType, signal } = msg.payload;
          mediaProvider.handleSignalingMessage(fromUserId, channelId, mediaType, signal);
          break;
        }

        case 'error': {
          addToast({ type: 'error', title: 'Aviso', description: msg.payload.message });
          break;
        }
      }
    });

    // Remote media event subscriptions
    const unsubRemoteStream = mediaProvider.onRemoteStream(({ userId, stream, mediaType }) => {
      if (mediaType === 'voice') {
        let audio = audioElementsRef.current.get(userId);
        if (!audio) {
          audio = new Audio();
          audio.autoplay = true;
          audio.setAttribute('data-user-id', userId);
          document.body.appendChild(audio);
          audioElementsRef.current.set(userId, audio);
        }
        audio.srcObject = stream;
        audio.play().catch((err) => {
          console.warn('[Audio] Autoplay blocked, user interaction required:', err);
        });
      } else if (mediaType === 'screen') {
        const sharer = users.find((u) => u.id === userId) || {
          id: userId,
          displayName: 'Participante',
          avatarColor: getAvatarColor(userId),
          isOnline: true,
          voiceChannelId: currentVoiceChannelId,
          isMuted: false,
          isDeafened: false,
          isSpeaking: false,
          isScreenSharing: true,
          screenShareChannelId: currentVoiceChannelId,
          joinedAt: Date.now(),
        };
        setActiveScreenShare({ user: sharer, stream });
      }
    });

    const unsubRemoteEnded = mediaProvider.onRemoteStreamEnded((userId, mediaType) => {
      if (mediaType === 'screen') {
        setActiveScreenShare((current) => (current?.user.id === userId ? null : current));
      } else if (mediaType === 'voice') {
        const audio = audioElementsRef.current.get(userId);
        if (audio) {
          audio.pause();
          audio.srcObject = null;
        }
      }
    });

    // Periodic network statistics check
    const statsInterval = setInterval(async () => {
      if (currentVoiceChannelId) {
        const stats = await mediaProvider.getNetworkStats();
        if (stats) setNetworkStats(stats);
      } else {
        setNetworkStats(null);
      }
    }, 4000);

    return () => {
      unsubStatus();
      unsubMessages();
      unsubRemoteStream();
      unsubRemoteEnded();
      clearInterval(statsInterval);
      signalingService.disconnect();
    };
  }, [currentUser?.id, currentVoiceChannelId]);

  // Handle Push-to-Talk global key listener
  useEffect(() => {
    if (audioSettings.inputMode !== 'push-to-talk' || !currentVoiceChannelId) return;

    const targetKey = audioSettings.pushToTalkKey.toLowerCase();

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input, textarea, or contentEditable
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key.toLowerCase() === targetKey && !pushToTalkPressedRef.current) {
        pushToTalkPressedRef.current = true;
        mediaProvider.setMuted(false);
        signalingService.send({
          type: 'voice:state',
          payload: { isMuted: false, isDeafened, isSpeaking: true },
        });
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key.toLowerCase() === targetKey && pushToTalkPressedRef.current) {
        pushToTalkPressedRef.current = false;
        mediaProvider.setMuted(true);
        signalingService.send({
          type: 'voice:state',
          payload: { isMuted: true, isDeafened, isSpeaking: false },
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [audioSettings.inputMode, audioSettings.pushToTalkKey, currentVoiceChannelId, isDeafened]);

  // Login handler
  const login = useCallback((nickname: string) => {
    const val = validateNickname(nickname);
    if (!val.isValid) {
      return { success: false, error: val.error };
    }

    const userId = currentUser?.id || generateUUID();
    const avatarColor = getAvatarColor(userId);

    const newUser: User = {
      id: userId,
      displayName: val.cleanName,
      avatarColor,
      isOnline: true,
      voiceChannelId: null,
      isMuted: false,
      isDeafened: false,
      isSpeaking: false,
      isScreenSharing: false,
      screenShareChannelId: null,
      joinedAt: Date.now(),
    };

    try {
      localStorage.setItem('pumpkin_user', JSON.stringify(newUser));
    } catch {}

    setCurrentUser(newUser);
    return { success: true };
  }, [currentUser]);

  // Logout handler
  const logout = useCallback(() => {
    if (currentVoiceChannelId) {
      leaveVoiceChannel();
    }
    signalingService.disconnect();
    try {
      localStorage.removeItem('pumpkin_user');
      localStorage.removeItem('nckdev_user');
    } catch {}
    setCurrentUser(null);
    setUsers([]);
    setAllMessages({});
  }, [currentVoiceChannelId]);

  // Channel selections
  const currentTextChannel = CHANNELS.find((c) => c.id === currentTextChannelId) || CHANNELS[0];
  const currentVoiceChannel = currentVoiceChannelId ? CHANNELS.find((c) => c.id === currentVoiceChannelId) || null : null;

  const selectTextChannel = useCallback((channelId: string) => {
    setCurrentTextChannelId(channelId);
  }, []);

  // Send Chat Message
  const sendMessage = useCallback((content: string) => {
    if (!content.trim() || !currentUser) return;
    signalingService.send({
      type: 'chat:send',
      payload: {
        channelId: currentTextChannelId,
        content: content.trim(),
      },
    });
  }, [currentTextChannelId, currentUser]);

  // Join Voice Channel
  const joinVoiceChannel = useCallback(async (channelId: string) => {
    if (!currentUser) return;

    // If clicking same channel, do nothing
    if (currentVoiceChannelId === channelId) return;

    try {
      // Step 1: Request Microphone
      const audioStream = await mediaService.getMicrophoneStream(audioSettings);
      const audioTrack = audioStream.getAudioTracks()[0];

      // Step 2: Initialize Audio Level Monitor for local speaking glow
      localVoiceMonitorRef.current.start(
        audioStream,
        undefined,
        (speaking) => {
          if (!isMuted && !isDeafened) {
            signalingService.send({
              type: 'voice:state',
              payload: { isMuted, isDeafened, isSpeaking: speaking },
            });
          }
        },
        14
      );

      // Step 3: Inform signaling server
      signalingService.send({
        type: 'voice:join',
        payload: {
          channelId,
          isMuted: audioSettings.inputMode === 'push-to-talk' ? true : isMuted,
          isDeafened,
        },
      });

      // Step 4: Setup local peer provider
      await mediaProvider.joinVoice(channelId, audioTrack);
      if (audioSettings.inputMode === 'push-to-talk') {
        mediaProvider.setMuted(true);
      } else {
        mediaProvider.setMuted(isMuted);
      }
      mediaProvider.setDeafened(isDeafened);

      setCurrentVoiceChannelId(channelId);

      const targetChannel = CHANNELS.find((c) => c.id === channelId);
      addToast({
        type: 'success',
        title: 'Conectado ao canal de voz',
        description: targetChannel?.name || 'Voz',
      });
    } catch (err: unknown) {
      const error = err as Error;
      console.error('[Voice] Failed to join voice channel:', error);

      let message = 'Não foi possível acessar seu microfone. Verifique as permissões do navegador.';
      if (error.name === 'NotFoundError') {
        message = 'Nenhum microfone detectado no dispositivo.';
      } else if (error.name === 'NotReadableError') {
        message = 'O microfone está sendo usado por outro aplicativo.';
      }

      addToast({
        type: 'error',
        title: 'Erro de Microfone',
        description: message,
      });
    }
  }, [currentUser, currentVoiceChannelId, audioSettings, isMuted, isDeafened, addToast]);

  // Leave Voice Channel
  const leaveVoiceChannel = useCallback(() => {
    if (!currentVoiceChannelId) return;

    localVoiceMonitorRef.current.stop();
    mediaService.stopMicrophone();

    if (isSharingScreen) {
      stopScreenShare();
    }

    mediaProvider.leaveVoice(currentVoiceChannelId);
    signalingService.send({
      type: 'voice:leave',
      payload: { channelId: currentVoiceChannelId },
    });

    // Cleanup remote audio elements
    audioElementsRef.current.forEach((audio) => {
      audio.pause();
      audio.srcObject = null;
      audio.remove();
    });
    audioElementsRef.current.clear();

    const oldChannel = CHANNELS.find((c) => c.id === currentVoiceChannelId);
    setCurrentVoiceChannelId(null);
    setNetworkStats(null);

    addToast({
      type: 'info',
      title: 'Desconectado do canal de voz',
      description: oldChannel?.name || 'Voz',
    });
  }, [currentVoiceChannelId, isSharingScreen, addToast]);

  // Toggle Mute
  const toggleMute = useCallback(() => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    mediaProvider.setMuted(nextMuted);

    signalingService.send({
      type: 'voice:state',
      payload: { isMuted: nextMuted, isDeafened, isSpeaking: false },
    });

    addToast({
      type: 'info',
      title: nextMuted ? 'Microfone silenciado' : 'Microfone ativado',
    });
  }, [isMuted, isDeafened, addToast]);

  // Toggle Deafen
  const toggleDeafen = useCallback(() => {
    const nextDeafened = !isDeafened;
    setIsDeafened(nextDeafened);
    // If deafening, also mute local audio
    const nextMuted = nextDeafened ? true : isMuted;
    setIsMuted(nextMuted);

    mediaProvider.setDeafened(nextDeafened);
    mediaProvider.setMuted(nextMuted);

    // Mute/unmute all active remote audio elements
    audioElementsRef.current.forEach((audio) => {
      audio.muted = nextDeafened;
    });

    signalingService.send({
      type: 'voice:state',
      payload: { isMuted: nextMuted, isDeafened: nextDeafened, isSpeaking: false },
    });

    addToast({
      type: 'info',
      title: nextDeafened ? 'Áudio ensurdecido' : 'Áudio reativado',
    });
  }, [isDeafened, isMuted, addToast]);

  // Start Screen Share
  const startScreenShare = useCallback(async () => {
    if (!currentVoiceChannelId || !currentUser) {
      addToast({
        type: 'warning',
        title: 'Aviso',
        description: 'Entre em um canal de voz antes de compartilhar sua tela.',
      });
      return;
    }

    try {
      const stream = await mediaService.getScreenStream(streamSettings);
      setIsSharingScreen(true);

      // Local preview in active screen share
      setActiveScreenShare({ user: currentUser, stream });

      // Transmit via mediaProvider and inform signaling
      await mediaProvider.startScreenShare(currentVoiceChannelId, stream);
      signalingService.send({
        type: 'screen:start',
        payload: { channelId: currentVoiceChannelId },
      });

      // Handle user stopping screen share via browser floating bar
      stream.getVideoTracks()[0].onended = () => {
        stopScreenShare();
      };

      addToast({
        type: 'success',
        title: 'Compartilhamento de tela iniciado',
        description: `Perfil: ${streamSettings.profile}`,
      });
    } catch (err: unknown) {
      const error = err as Error;
      if (error.name !== 'NotAllowedError') {
        console.error('[ScreenShare] Failed to share screen:', error);
        addToast({
          type: 'error',
          title: 'Erro ao compartilhar tela',
          description: 'Não foi possível capturar a tela selecionada.',
        });
      }
    }
  }, [currentVoiceChannelId, currentUser, streamSettings, addToast]);

  // Stop Screen Share
  const stopScreenShare = useCallback(() => {
    if (!currentVoiceChannelId) return;

    mediaService.stopScreenShare();
    mediaProvider.stopScreenShare(currentVoiceChannelId);
    signalingService.send({
      type: 'screen:stop',
      payload: { channelId: currentVoiceChannelId },
    });

    setIsSharingScreen(false);
    setActiveScreenShare((current) => (current?.user.id === currentUser?.id ? null : current));

    addToast({
      type: 'info',
      title: 'Compartilhamento de tela encerrado',
    });
  }, [currentVoiceChannelId, currentUser?.id, addToast]);

  // Update Settings
  const updateAudioSettings = useCallback((newSettings: Partial<AudioSettings>) => {
    setAudioSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('pumpkin_audio_settings', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const updateStreamSettings = useCallback((newSettings: Partial<StreamSettings>) => {
    setStreamSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('pumpkin_stream_settings', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        login,
        logout,
        channels: CHANNELS,
        currentTextChannel,
        selectTextChannel,
        messages: allMessages[currentTextChannelId] || [],
        sendMessage,
        currentVoiceChannel,
        joinVoiceChannel,
        leaveVoiceChannel,
        isMuted,
        isDeafened,
        toggleMute,
        toggleDeafen,
        isSharingScreen,
        activeScreenShare,
        startScreenShare,
        stopScreenShare,
        connectionStatus,
        networkStats,
        audioSettings,
        streamSettings,
        updateAudioSettings,
        updateStreamSettings,
        toasts,
        addToast,
        removeToast,
        isSettingsOpen,
        openSettings: () => setIsSettingsOpen(true),
        closeSettings: () => setIsSettingsOpen(false),
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
