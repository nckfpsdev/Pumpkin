import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Mic,
  MicOff,
  Headphones,
  VolumeX,
  Monitor,
  MonitorOff,
  Settings,
  PhoneOff,
  Radio,
} from 'lucide-react';
import { getInitials } from '../../utils/helpers';

export const VoiceControlBar: React.FC = () => {
  const {
    currentUser,
    currentVoiceChannel,
    leaveVoiceChannel,
    isMuted,
    isDeafened,
    toggleMute,
    toggleDeafen,
    isSharingScreen,
    startScreenShare,
    stopScreenShare,
    openSettings,
    audioSettings,
    networkStats,
  } = useApp();

  if (!currentUser) return null;

  return (
    <div className="bg-[#0b0e14] border-t border-white/10 px-3 py-2.5 flex flex-col gap-2">
      {/* Voice Status indicator bar if connected to voice channel */}
      {currentVoiceChannel && (
        <div className="flex items-center justify-between px-1 py-1 rounded bg-[#131720] border border-white/5 text-[11px]">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium truncate">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span className="truncate">{currentVoiceChannel.name}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            {networkStats && (
              <span
                className={`text-[10px] font-mono ${
                  networkStats.quality === 'Excelente'
                    ? 'text-emerald-400'
                    : networkStats.quality === 'Boa'
                    ? 'text-sky-400'
                    : networkStats.quality === 'Instável'
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
                title={`RTT: ${networkStats.rttMs}ms | Perda: ${networkStats.packetsLost} | Jitter: ${networkStats.jitterMs}ms`}
              >
                {networkStats.rttMs}ms &bull; {networkStats.quality}
              </span>
            )}

            <button
              onClick={leaveVoiceChannel}
              title="Desconectar do canal de voz"
              aria-label="Desconectar do canal de voz"
              className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
            >
              <PhoneOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main control row */}
      <div className="flex items-center justify-between gap-1">
        {/* User preview */}
        <div className="flex items-center gap-2 min-w-0 mr-1">
          <div
            style={{ backgroundColor: currentUser.avatarColor }}
            className="w-7 h-7 rounded-full flex items-center justify-center text-slate-950 font-bold text-xs shrink-0"
          >
            {getInitials(currentUser.displayName)}
          </div>
          <div className="truncate">
            <div className="text-xs font-semibold text-white truncate leading-tight">
              {currentUser.displayName}
            </div>
            <div className="text-[10px] text-slate-500 truncate leading-tight">
              {audioSettings.inputMode === 'push-to-talk'
                ? `PTT [${audioSettings.pushToTalkKey.toUpperCase()}]`
                : currentVoiceChannel
                ? 'Voz Conectada'
                : 'Online'}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Mic */}
          <button
            onClick={toggleMute}
            disabled={!currentVoiceChannel}
            aria-label={isMuted ? 'Ativar microfone' : 'Silenciar microfone'}
            title={
              !currentVoiceChannel
                ? 'Entre em um canal de voz para usar o microfone'
                : isMuted
                ? 'Ativar microfone (M)'
                : 'Silenciar microfone (M)'
            }
            className={`p-2 rounded-lg transition-all ${
              !currentVoiceChannel
                ? 'text-slate-600 cursor-not-allowed'
                : isMuted
                ? 'bg-rose-500/15 text-rose-400 hover:bg-rose-500/25'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Headphones (Deafen) */}
          <button
            onClick={toggleDeafen}
            disabled={!currentVoiceChannel}
            aria-label={isDeafened ? 'Reativar áudio' : 'Ensurdecer áudio'}
            title={
              !currentVoiceChannel
                ? 'Entre em um canal de voz'
                : isDeafened
                ? 'Reativar áudio (D)'
                : 'Ensurdecer áudio (D)'
            }
            className={`p-2 rounded-lg transition-all ${
              !currentVoiceChannel
                ? 'text-slate-600 cursor-not-allowed'
                : isDeafened
                ? 'bg-rose-500/15 text-rose-400 hover:bg-rose-500/25'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {isDeafened ? <VolumeX className="w-4 h-4" /> : <Headphones className="w-4 h-4" />}
          </button>

          {/* Screen Share */}
          <button
            onClick={isSharingScreen ? stopScreenShare : startScreenShare}
            disabled={!currentVoiceChannel}
            aria-label={isSharingScreen ? 'Parar compartilhamento' : 'Compartilhar tela'}
            title={
              !currentVoiceChannel
                ? 'Entre em um canal de voz para compartilhar sua tela'
                : isSharingScreen
                ? 'Parar transmissão da tela'
                : 'Compartilhar tela (até 1080p 60fps)'
            }
            className={`p-2 rounded-lg transition-all ${
              !currentVoiceChannel
                ? 'text-slate-600 cursor-not-allowed'
                : isSharingScreen
                ? 'bg-[#FF7A00]/20 text-[#FF8A1F] hover:bg-[#FF7A00]/30'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {isSharingScreen ? <MonitorOff className="w-4 h-4 text-[#FF8A1F]" /> : <Monitor className="w-4 h-4" />}
          </button>

          {/* Settings */}
          <button
            onClick={openSettings}
            aria-label="Abrir configurações"
            title="Configurações (Áudio, Stream, Conexão)"
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
