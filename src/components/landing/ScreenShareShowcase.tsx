import React from 'react';
import { Tv, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';

export const ScreenShareShowcase: React.FC = () => {
  return (
    <section id="compartilhamento" className="py-28 px-6 relative z-10 overflow-hidden bg-[#080808]">
      {/* DIAGONAL LIGHT BEAM EFFECT — WARM ORANGE */}
      <div
        className="absolute top-0 left-1/3 w-96 h-[800px] bg-gradient-to-r from-transparent via-[#FF7A00]/10 to-transparent blur-[110px] pointer-events-none -z-0 animate-beam-sweep"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#FF7A00]">
              <Tv className="w-4 h-4" />
              <span>Alta Fidelidade de Imagem</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F8F7F5] tracking-tight leading-[1.12]">
              Compartilhe com clareza.
            </h2>

            <p className="text-sm sm:text-base text-[#B7B2AC] font-normal leading-relaxed">
              Desenvolvido com foco especial em desenvolvedores: tipografia nítida sem artefatos de compressão, transições fluidas a 60 FPS e captura de áudio direto da aplicação.
            </p>
          </div>

          {/* Quick Spec Pills */}
          <div className="flex flex-wrap gap-2.5 font-mono text-xs text-[#B7B2AC]">
            <div className="px-3.5 py-1.5 rounded-full bg-[#12100E] border border-white/[0.08] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF7A00]" />
              <span className="text-[#F8F7F5] font-bold">1080p</span> 1920 × 1080
            </div>
            <div className="px-3.5 py-1.5 rounded-full bg-[#12100E] border border-white/[0.08] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF8A1F]" />
              <span className="text-[#F8F7F5] font-bold">60 FPS</span> Fluidez Nativa
            </div>
            <div className="px-3.5 py-1.5 rounded-full bg-[#12100E] border border-white/[0.08] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[#F8F7F5] font-bold">WebRTC</span> P2P Low Latency
            </div>
          </div>
        </div>

        {/* LARGE CINEMATIC STREAMING STAGE */}
        <div className="relative rounded-[28px] p-px bg-gradient-to-b from-white/15 via-white/[0.05] to-transparent shadow-[0_20px_70px_rgba(0,0,0,0.85)]">
          <div className="bg-[#0C0A08] rounded-[27px] overflow-hidden border border-white/[0.06]">
            {/* Stage Bar */}
            <div className="h-11 bg-[#080808] border-b border-white/[0.06] px-5 flex items-center justify-between text-xs text-[#B7B2AC]">
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white font-medium">Transmissão em Andamento</span>
                <span className="text-[#77716B]">·</span>
                <span className="text-[#77716B]">Canal: Geral</span>
              </div>

              <div className="hidden sm:flex items-center gap-4 text-[11px] font-mono text-[#77716B]">
                <span>Bitrate: 5.8 Mbps</span>
                <span>Perda de pacotes: 0.0%</span>
              </div>
            </div>

            {/* Code / Architecture Window Display */}
            <div className="p-6 sm:p-10 bg-[#050505] font-mono text-xs sm:text-sm text-[#B7B2AC] space-y-4">
              <div className="flex items-center justify-between text-[#77716B] border-b border-white/[0.06] pb-3 text-[11px]">
                <div className="flex items-center gap-3">
                  <span className="text-[#FFF1E6] font-semibold">src/services/media/MeshMediaProvider.ts</span>
                  <span className="text-emerald-400 font-mono">1080p60 Live</span>
                </div>
                <span className="text-[#FF8A1F]">contentHint: "detail"</span>
              </div>

              <div className="space-y-1.5 leading-relaxed text-[11px] sm:text-[13px] text-[#B7B2AC]">
                <p>
                  <span className="text-[#FFB347]">export async function</span> <span className="text-[#FF8A1F]">publishScreenStream</span>(
                  stream: <span className="text-[#FF7A00]">MediaStream</span>
                  ): <span className="text-[#FF7A00]">Promise&lt;void&gt;</span> &#123;
                </p>
                <p className="pl-4 sm:pl-6 text-[#77716B]">
                  // Ativa aceleração gráfica e preserva tipografia em 60 quadros por segundo
                </p>
                <p className="pl-4 sm:pl-6">
                  <span className="text-[#FFB347]">const</span> videoTrack = stream.<span className="text-[#FF8A1F]">getVideoTracks</span>()[0];
                </p>
                <p className="pl-4 sm:pl-6">
                  videoTrack.contentHint = <span className="text-[#FF8A1F]">'detail'</span>;
                </p>
                <p className="pl-4 sm:pl-6">
                  peerConnections.<span className="text-[#FFB347]">forEach</span>(peer =&gt; peer.<span className="text-[#FF8A1F]">addTrack</span>(videoTrack, stream));
                </p>
                <p>&#125;</p>
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-4 text-[#77716B] font-mono text-[11px]">
                  <span className="flex items-center gap-1.5 text-white">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF7A00]" /> Zero delay perceptível
                  </span>
                  <span className="flex items-center gap-1.5 text-white">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#FF8A1F]" /> Criptografado DTLS/SRTP
                  </span>
                  <span className="flex items-center gap-1.5 text-white">
                    <Cpu className="w-3.5 h-3.5 text-[#FFB347]" /> Baixo consumo de CPU
                  </span>
                </div>

                <div className="text-[11px] text-[#77716B] font-mono italic">
                  * Resolução alvo depende das capacidades da tela e estabilidade de rede.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
