import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  X,
  Tv,
  CheckCircle2,
} from 'lucide-react';

export const ScreenShareView: React.FC = () => {
  const { activeScreenShare, stopScreenShare, currentUser, streamSettings } = useApp();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [streamResolution, setStreamResolution] = useState<string>('Detectando...');

  const isLocalUser = activeScreenShare?.user.id === currentUser?.id;

  // Bind MediaStream to Video element
  useEffect(() => {
    if (videoRef.current && activeScreenShare?.stream) {
      videoRef.current.srcObject = activeScreenShare.stream;
      videoRef.current.play().catch((err) => {
        console.warn('[ScreenShareView] Video autoplay blocked:', err);
      });

      // Poll actual track settings for resolution
      const videoTrack = activeScreenShare.stream.getVideoTracks()[0];
      if (videoTrack) {
        const updateSettings = () => {
          const settings = videoTrack.getSettings();
          if (settings.width && settings.height) {
            const fps = settings.frameRate ? `@ ${Math.round(settings.frameRate)}fps` : '';
            setStreamResolution(`${settings.width}x${settings.height} ${fps}`);
          }
        };

        updateSettings();
        const interval = setInterval(updateSettings, 2000);
        return () => clearInterval(interval);
      }
    }
  }, [activeScreenShare?.stream]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      try {
        await containerRef.current.requestFullscreen();
      } catch (err) {
        console.warn('[ScreenShareView] Fullscreen request failed:', err);
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
    setIsAudioMuted(val === 0);
  };

  const toggleAudioMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isAudioMuted;
    videoRef.current.muted = nextMuted;
    setIsAudioMuted(nextMuted);
  };

  if (!activeScreenShare) return null;

  return (
    <div
      ref={containerRef}
      className={`relative w-full bg-[#050608] flex flex-col items-center justify-center border-b border-white/10 group select-none transition-all ${
        isFullscreen ? 'h-screen w-screen p-0' : 'h-[360px] md:h-[460px] xl:h-[520px]'
      }`}
    >
      {/* Real Video Element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocalUser || isAudioMuted}
        className="w-full h-full object-contain pointer-events-none"
      />

      {/* Floating Top Bar Overlay */}
      <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-xs font-medium text-white">
            <Tv className="w-3.5 h-3.5 text-[#00e5ff]" />
            <span>
              {isLocalUser ? 'Você está compartilhando a tela' : `${activeScreenShare.user.displayName} está compartilhando a tela`}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-[10px] text-slate-300 font-mono">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>{streamResolution}</span>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2">
          {/* Audio volume for remote streams */}
          {!isLocalUser && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10">
              <button
                onClick={toggleAudioMute}
                aria-label={isAudioMuted ? 'Desmutar áudio do stream' : 'Mutar áudio do stream'}
                className="text-slate-300 hover:text-white"
              >
                {isAudioMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isAudioMuted ? 0 : volume}
                onChange={handleVolumeChange}
                aria-label="Volume da transmissão de tela"
                className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#00e5ff]"
              />
            </div>
          )}

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Sair da tela cheia' : 'Entrar em tela cheia'}
            title={isFullscreen ? 'Sair da tela cheia (ESC)' : 'Entrar em tela cheia'}
            className="p-1.5 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close / Stop Button */}
          {isLocalUser && (
            <button
              onClick={stopScreenShare}
              aria-label="Parar transmissão da tela"
              title="Parar transmissão"
              className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Parar</span>
            </button>
          )}
        </div>
      </div>

      {/* Subtle bottom info bar on hover */}
      <div className="absolute bottom-2 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-slate-400 bg-black/60 px-2 py-0.5 rounded backdrop-blur border border-white/5 pointer-events-none">
        Target: {streamSettings.profile} &bull; WebRTC 1080p60
      </div>
    </div>
  );
};
