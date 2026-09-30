import React from 'react';
import { Tv, Mic, MessageSquare, Zap, Globe, Shield, Sparkles } from 'lucide-react';

export const BentoFeatures: React.FC = () => {
  return (
    <section id="recursos" className="py-28 px-6 relative z-10">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* SECTION HEADER */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#FF7A00]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Engenharia de Próxima Geração</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F8F7F5] tracking-tight leading-[1.15]">
            Construído para quem valoriza clareza e velocidade.
          </h2>

          <p className="text-sm sm:text-base text-[#B7B2AC] font-normal leading-relaxed">
            Sem burocracia de cadastro. Cada recurso foi desenhado para eliminar atrito entre a sua ideia e a sua equipe.
          </p>
        </div>

        {/* ASYMMETRIC BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* CARD 1: SCREEN SHARE (Large Spotlight Card - 8 cols on desktop) */}
          <div className="md:col-span-8 p-7 sm:p-9 bg-[#0C0A08] border border-white/[0.06] hover:border-white/[0.14] rounded-[28px] transition-all duration-300 group flex flex-col justify-between space-y-6 relative overflow-hidden">
            {/* Subtle card ambient highlight */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#FF7A00]/12 via-[#FF8A1F]/06 to-transparent blur-3xl pointer-events-none -z-0" />

            <div className="relative z-10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF7A00]/15 border border-[#FF7A00]/30 text-[#FF8A1F] flex items-center justify-center">
                <Tv className="w-5 h-5 stroke-[2]" />
              </div>
              <h3 className="text-2xl font-bold text-[#F8F7F5]">
                Compartilhamento em 1080p a 60 FPS
              </h3>
              <p className="text-sm text-[#B7B2AC] max-w-xl leading-relaxed">
                Transmita código, apresentações ou janelas inteiras com fidelidade de texto impecável via <span className="text-[#FF8A1F] font-mono text-xs">contentHint="detail"</span>. Fluidez total com aceleração por hardware.
              </p>
            </div>

            {/* Interactive Preview element inside Card */}
            <div className="relative z-10 bg-[#080808] rounded-2xl border border-white/[0.06] p-4 font-mono text-xs space-y-3 shadow-inner">
              <div className="flex items-center justify-between text-[#77716B] text-[11px] border-b border-white/[0.04] pb-2">
                <span className="text-[#FFF1E6]">Stream Target Profile</span>
                <span className="text-[#FF8A1F] font-bold">1920 × 1080 @ 60 FPS</span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[11px]">
                <span className="px-2.5 py-1 rounded-md bg-[#181410] text-[#FF8A1F] border border-[#FF7A00]/25">
                  WebRTC MediaStream
                </span>
                <span className="px-2.5 py-1 rounded-md bg-[#181410] text-[#FFB347] border border-[#FFB347]/25">
                  VP9 / H.264
                </span>
                <span className="px-2.5 py-1 rounded-md bg-[#181410] text-emerald-400 border border-emerald-400/20">
                  Zero Buffer Lag
                </span>
              </div>
            </div>
          </div>

          {/* CARD 2: VOICE CHANNELS (Vertical Card - 4 cols on desktop) */}
          <div className="md:col-span-4 p-7 sm:p-9 bg-[#0C0A08] border border-white/[0.06] hover:border-white/[0.14] rounded-[28px] transition-all duration-300 group flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-gradient-to-tr from-[#FF7A00]/12 to-transparent blur-3xl pointer-events-none -z-0" />

            <div className="relative z-10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF8A1F]/15 border border-[#FF8A1F]/30 text-[#FFB347] flex items-center justify-center">
                <Mic className="w-5 h-5 stroke-[2]" />
              </div>
              <h3 className="text-2xl font-bold text-[#F8F7F5]">
                Voz em Tempo Real
              </h3>
              <p className="text-sm text-[#B7B2AC] leading-relaxed">
                Codec Opus a 48 kHz. Detecção de voz ativa (VAD) via Web Audio API e cancelamento nativo de eco.
              </p>
            </div>

            {/* Waveform graphic inside Card */}
            <div className="relative z-10 bg-[#080808] rounded-2xl border border-white/[0.06] p-4 flex flex-col items-center justify-center space-y-3">
              <div className="flex items-center gap-1.5 h-10" aria-label="Waveform do canal">
                <span className="w-1 bg-[#FF7A00] rounded-full animate-wave-1 inline-block" />
                <span className="w-1 bg-[#FF8A1F] rounded-full animate-wave-2 inline-block" />
                <span className="w-1 bg-[#FFB347] rounded-full animate-wave-3 inline-block" />
                <span className="w-1 bg-[#FFF1E6] rounded-full animate-wave-4 inline-block" />
                <span className="w-1 bg-[#FF8A1F] rounded-full animate-wave-5 inline-block" />
                <span className="w-1 bg-[#FF7A00] rounded-full animate-wave-3 inline-block" />
                <span className="w-1 bg-[#FFB347] rounded-full animate-wave-2 inline-block" />
                <span className="w-1 bg-[#FF8A1F] rounded-full animate-wave-1 inline-block" />
              </div>
              <div className="text-[11px] font-mono text-[#77716B]">
                Opus 48,000 Hz · Mesh P2P
              </div>
            </div>
          </div>

          {/* CARD 3: REALTIME CHAT (Horizontal Card - 6 cols on desktop) */}
          <div className="md:col-span-6 p-7 sm:p-8 bg-[#0C0A08] border border-white/[0.06] hover:border-white/[0.14] rounded-[28px] transition-all duration-300 group flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFB347]/15 border border-[#FFB347]/30 text-[#FFB347] flex items-center justify-center">
                <MessageSquare className="w-5 h-5 stroke-[2]" />
              </div>
              <h3 className="text-xl font-bold text-[#F8F7F5]">
                Chat Instantâneo com Histórico
              </h3>
              <p className="text-sm text-[#B7B2AC] leading-relaxed">
                Mensagens sincronizadas por WebSocket em sub-milissegundos. Histórico preservado por canal com proteção integrada contra flood e spam.
              </p>
            </div>

            <div className="bg-[#080808] rounded-xl border border-white/[0.06] p-3 text-xs space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">Equipe</span>
                <span className="text-[10px] font-mono text-[#77716B]">14:40</span>
              </div>
              <p className="text-[#B7B2AC] text-xs">
                Release oficial v1.0.0 aprovado. Todos os pacotes Windows e Android validados!
              </p>
            </div>
          </div>

          {/* CARD 4: ZERO ATTRITION / SEM CADASTRO (6 cols on desktop) */}
          <div className="md:col-span-6 p-7 sm:p-8 bg-[#0C0A08] border border-white/[0.06] hover:border-white/[0.14] rounded-[28px] transition-all duration-300 group flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF7A00]/15 border border-[#FF7A00]/30 text-[#FF7A00] flex items-center justify-center">
                <Zap className="w-5 h-5 stroke-[2]" />
              </div>
              <h3 className="text-xl font-bold text-[#F8F7F5]">
                Sem Formulários ou Senhas
              </h3>
              <p className="text-sm text-[#B7B2AC] leading-relaxed">
                Digite seu apelido e você já está dentro da sala. Nada de verificação de e-mail, senhas de 16 dígitos ou onboarding desnecessário.
              </p>
            </div>

            <div className="bg-[#080808] rounded-xl border border-white/[0.06] p-3 flex items-center justify-between text-xs font-mono">
              <div className="text-[#B7B2AC]">
                Apelido: <span className="text-[#F8F7F5] font-bold">Nicholas</span>
              </div>
              <span className="text-emerald-400 font-semibold text-[11px]">
                Pronto para entrar
              </span>
            </div>
          </div>

          {/* CARD 5: MULTIPLATAFORMA REAL (6 cols on desktop) */}
          <div className="md:col-span-6 p-7 sm:p-8 bg-[#0C0A08] border border-white/[0.06] hover:border-white/[0.14] rounded-[28px] transition-all duration-300 group flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#F97316]/15 border border-[#F97316]/30 text-[#FF8A1F] flex items-center justify-center">
                <Globe className="w-5 h-5 stroke-[2]" />
              </div>
              <h3 className="text-xl font-bold text-[#F8F7F5]">
                Multiplataforma Unificada
              </h3>
              <p className="text-sm text-[#B7B2AC] leading-relaxed">
                Windows, Android ou Web Browser. A mesma arquitetura e protocolo WebRTC operando em harmonia em qualquer tela.
              </p>
            </div>
            <div className="text-xs text-[#77716B] font-mono pt-1">
              Windows (NSIS) · Android (MediaProjection) · Web (SPA)
            </div>
          </div>

          {/* CARD 6: PRIVACIDADE TRANSPARENTE (6 cols on desktop) */}
          <div className="md:col-span-6 p-7 sm:p-8 bg-[#0C0A08] border border-white/[0.06] hover:border-white/[0.14] rounded-[28px] transition-all duration-300 group flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <Shield className="w-5 h-5 stroke-[2]" />
              </div>
              <h3 className="text-xl font-bold text-[#F8F7F5]">
                Privacidade por Princípio
              </h3>
              <p className="text-sm text-[#B7B2AC] leading-relaxed">
                Nenhum áudio ou vídeo é gravado em servidores. Sensores de microfone e tela só são ativados com a sua ação consciente.
              </p>
            </div>
            <div className="text-xs text-[#77716B] font-mono pt-1">
              Sem telemetria oculta · Sem coleta invasiva
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
