import React, { useState, useRef, useEffect } from 'react';
import { Radio, Tv, Volume2, Hash } from 'lucide-react';

export const HeroMockup: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 1.5, y: -2 });
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchOrReduced, setIsTouchOrReduced] = useState(false);

  useEffect(() => {
    // Detect touch device or prefers-reduced-motion
    const isTouch = typeof navigator !== 'undefined' && (navigator.maxTouchPoints > 0 || 'ontouchstart' in window);
    const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setIsTouchOrReduced(isTouch || reducedMotion);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchOrReduced || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Constrain tilt strictly between -2.5 and +2.5 degrees
    const rotateY = ((x - centerX) / centerX) * 2.5;
    const rotateX = -((y - centerY) / centerY) * 2.5;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Smooth reset to quiet default angle
    setRotate({ x: 1.5, y: -2 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative max-w-5xl mx-auto w-full transition-transform duration-300 ease-out"
      style={{
        perspective: '1200px',
      }}
    >
      {/* ATMOSPHERE HALO — WARM PUMPKIN ORANGE & AMBER */}
      <div
        className="absolute -inset-4 sm:-inset-8 bg-gradient-to-r from-[#FF7A00]/16 via-[#FF8A1F]/12 to-[#FFB347]/10 blur-[90px] sm:blur-[130px] rounded-[36px] pointer-events-none -z-10 animate-ambient-pulse"
        aria-hidden="true"
      />

      {/* 3D FLOATING WINDOW SHELL */}
      <div
        className={`relative rounded-[22px] sm:rounded-[28px] p-px bg-gradient-to-b from-white/15 via-white/[0.05] to-transparent shadow-[0_24px_80px_rgba(0,0,0,0.85)] transition-transform duration-500 ease-out ${
          !isTouchOrReduced && !isHovered ? 'animate-cosmic-float' : ''
        }`}
        style={{
          transform: isTouchOrReduced
            ? 'none'
            : `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="bg-[#0C0A08]/95 backdrop-blur-xl rounded-[21px] sm:rounded-[27px] overflow-hidden border border-white/[0.06] text-left">
          {/* WINDOW TOP TITLEBAR */}
          <div className="h-10 bg-[#080808]/90 border-b border-white/[0.06] px-4 flex items-center justify-between text-xs text-[#B7B2AC] select-none">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5" aria-hidden="true">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <div className="flex items-center gap-2 pl-2">
                <img src="/pumpkin.svg" alt="pumpkin" className="w-4 h-4 object-contain filter drop-shadow-[0_1px_3px_rgba(255,106,0,0.5)]" />
                <span className="font-mono text-[11px] text-[#B7B2AC] tracking-wide">
                  pumpkin <span className="text-[#77716B]">·</span> servidor oficial
                </span>
              </div>
            </div>

            {/* REALTIME LATENCY BADGE */}
            <div className="flex items-center gap-2 font-mono text-[11px] text-[#FF8A1F]">
              <span className="w-2 h-2 rounded-full bg-[#FF7A00] animate-pulse" />
              <span>WebRTC 18ms</span>
            </div>
          </div>

          {/* APPLICATION INTERIOR GRID */}
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[380px] sm:min-h-[440px]">
            {/* SIDEBAR: CHANNELS & MEMBERS (4 cols on desktop) */}
            <div className="hidden md:flex md:col-span-4 flex-col bg-[#080808] border-r border-white/[0.06] p-4 justify-between select-none">
              <div className="space-y-5">
                {/* Text Channels */}
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#77716B] mb-2 px-1">
                    Canais de Texto
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="px-3 py-1.5 rounded-lg bg-white/[0.06] text-white font-medium flex items-center gap-2 border border-white/[0.06]">
                      <Hash className="w-3.5 h-3.5 text-[#FF7A00]" />
                      <span>geral</span>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg text-[#B7B2AC] hover:text-white flex items-center gap-2 transition-colors">
                      <Hash className="w-3.5 h-3.5 text-[#77716B]" />
                      <span>desenvolvimento</span>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg text-[#B7B2AC] hover:text-white flex items-center gap-2 transition-colors">
                      <Hash className="w-3.5 h-3.5 text-[#77716B]" />
                      <span>showcase</span>
                    </div>
                  </div>
                </div>

                {/* Voice Channels */}
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#77716B] mb-2 px-1">
                    Canais de Voz (Opus 48kHz)
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#12100E] border border-[#FF7A00]/25 space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-white font-semibold">
                      <div className="flex items-center gap-2 text-[#FF8A1F]">
                        <Volume2 className="w-3.5 h-3.5 text-[#FF7A00]" />
                        <span>Canal de Voz · Geral</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#77716B]">3 online</span>
                    </div>

                    {/* Participants List */}
                    <div className="space-y-1.5 pl-2 pt-1 border-t border-white/[0.04]">
                      {/* Active speaker Nicholas */}
                      <div className="flex items-center justify-between text-xs text-white">
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#FF6A00] to-[#FF8A1F] text-black font-extrabold text-[9px] flex items-center justify-center ring-2 ring-[#FF7A00]/70 shadow-[0_0_8px_rgba(255,122,0,0.45)]">
                              N
                            </div>
                          </div>
                          <span className="font-medium text-[#F8F7F5]">Nicholas</span>
                        </div>
                        {/* Live waveform indicator */}
                        <div className="flex items-center gap-0.5" aria-label="Microfone ativo">
                          <span className="w-0.5 bg-[#FF7A00] rounded-full animate-wave-1 inline-block" />
                          <span className="w-0.5 bg-[#FF8A1F] rounded-full animate-wave-2 inline-block" />
                          <span className="w-0.5 bg-[#FFB347] rounded-full animate-wave-3 inline-block" />
                          <span className="w-0.5 bg-[#FF7A00] rounded-full animate-wave-4 inline-block" />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-[#B7B2AC]">
                        <div className="w-5 h-5 rounded-full bg-[#181410] text-[#B7B2AC] font-bold text-[9px] flex items-center justify-center">
                          R
                        </div>
                        <span>Rafael</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-[#B7B2AC]">
                        <div className="w-5 h-5 rounded-full bg-[#181410] text-[#FFF1E6] font-bold text-[9px] flex items-center justify-center">
                          A
                        </div>
                        <span>Amanda</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom user status bar */}
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#FF7A00]/20 border border-[#FF7A00]/40 text-[#FF8A1F] flex items-center justify-center font-bold font-mono text-[10px]">
                    dev
                  </div>
                  <span className="font-semibold text-white">Você</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Conectado
                </span>
              </div>
            </div>

            {/* MAIN STAGE: 1080p SCREEN SHARE & CHAT FEED (8 cols on desktop) */}
            <div className="col-span-1 md:col-span-8 flex flex-col bg-[#050505] overflow-hidden">
              {/* SCREEN SHARE PRESENTATION STAGE */}
              <div className="relative h-48 sm:h-64 bg-[#080808] border-b border-white/[0.06] flex items-center justify-center p-3 sm:p-5 overflow-hidden">
                {/* Screen Share Overlay Status */}
                <div className="absolute top-3 left-3 z-10 flex items-center gap-2 text-[10px] font-mono px-2.5 py-1 rounded-md bg-[#0C0A08]/80 backdrop-blur border border-white/10 text-white">
                  <Tv className="w-3.5 h-3.5 text-[#FF8A1F]" />
                  <span>Nicholas compartilhando tela</span>
                  <span className="text-[#77716B]">·</span>
                  <span className="text-[#FF8A1F] font-bold">1080p 60fps</span>
                </div>

                {/* Simulated IDE / Terminal Presentation Window */}
                <div className="w-full h-full bg-[#0C0A08] rounded-xl border border-white/[0.08] p-3.5 sm:p-4 font-mono text-xs text-[#B7B2AC] shadow-inner flex flex-col justify-between overflow-hidden">
                  <div className="flex items-center justify-between text-[#77716B] border-b border-white/[0.06] pb-2 text-[10px]">
                    <span className="text-[#FFF1E6] font-medium">server.ts — pumpkin WebRTC Engine</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Transmitindo ao vivo
                    </span>
                  </div>

                  <div className="space-y-1 text-[11px] sm:text-xs text-[#B7B2AC] pt-2">
                    <div>
                      <span className="text-[#FFB347]">const</span> peer = <span className="text-[#FF8A1F]">new</span> <span className="text-[#FF7A00]">RTCPeerConnection</span>(config);
                    </div>
                    <div>
                      peer.<span className="text-[#FFB347]">addTrack</span>(screenStream.<span className="text-[#FF8A1F]">getVideoTracks</span>()[0]);
                    </div>
                    <div className="text-[#77716B]">
                      // Ultra low-latency WebRTC mesh &amp; 1080p60 hardware acceleration
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[#77716B] pt-2 border-t border-white/[0.04]">
                    <span>Codec: VP9 / H.264 High Profile</span>
                    <span className="text-[#FF8A1F] font-mono">60.0 FPS · 5.8 Mbps</span>
                  </div>
                </div>
              </div>

              {/* REALTIME CHAT STREAM */}
              <div className="p-3.5 sm:p-4 space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#FF6A00] to-[#FF8A1F] text-black font-bold text-[10px] flex items-center justify-center shrink-0">
                    N
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-white">Nicholas</span>
                      <span className="text-[10px] font-mono text-[#77716B]">14:32</span>
                    </div>
                    <p className="text-[#B7B2AC] mt-0.5 text-xs">
                      Compartilhando a implementação do WebRTC com 1080p60. Conseguem ler os detalhes do código?
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-[#181410] border border-white/[0.08] text-[#FFF1E6] font-bold text-[10px] flex items-center justify-center shrink-0">
                    R
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-white">Rafael</span>
                      <span className="text-[10px] font-mono text-[#77716B]">14:33</span>
                    </div>
                    <p className="text-[#B7B2AC] mt-0.5 text-xs">
                      Ficou excelente! Texto perfeitamente nítido e delay imperceptível no áudio.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
