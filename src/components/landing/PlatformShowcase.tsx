import React from 'react';
import { Laptop, Smartphone, Globe, Download, ArrowRight } from 'lucide-react';
import { Link } from '../../router';

export const PlatformShowcase: React.FC = () => {
  return (
    <section id="plataformas" className="py-28 px-6 relative z-10 bg-[#050505]">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-4 max-w-xl mx-auto">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#FF7A00]">
            Multiplataforma Sem Concessões
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F8F7F5] tracking-tight">
            Onde você estiver.
          </h2>
          <p className="text-sm sm:text-base text-[#B7B2AC] font-normal leading-relaxed">
            Uma única experiência unificada em todos os seus dispositivos. Conecte-se do computador de trabalho, do smartphone na rua ou de qualquer navegador.
          </p>
        </div>

        {/* 3 DISTINCT PLATFORM CARDS WITH WARM PUMPKIN ACCENTS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* WINDOWS CARD - Pumpkin Orange Glow */}
          <div className="group p-8 bg-[#0C0A08] hover:bg-[#12100E] border border-white/[0.06] hover:border-[#FF7A00]/40 rounded-[28px] transition-all duration-300 flex flex-col justify-between space-y-8 relative overflow-hidden shadow-lg hover:shadow-[0_0_40px_rgba(255,122,0,0.18)]">
            <div className="space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/25 text-[#FF7A00] flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <Laptop className="w-7 h-7 stroke-[1.8]" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-[#F8F7F5]">Windows Desktop</h3>
                <p className="text-xs text-[#77716B] font-mono mt-1">
                  Instalador oficial NSIS · 64-bit
                </p>
              </div>

              <p className="text-sm text-[#B7B2AC] leading-relaxed">
                App desktop leve, integração nativa com a bandeja do sistema (System Tray), atalhos globais de mute e aceleração gráfica por hardware.
              </p>
            </div>

            <a
              href="/releases/pumpkin-Setup-1.0.0.exe"
              download
              className="w-full py-3.5 px-4 bg-white/[0.05] hover:bg-[#FF7A00] text-white hover:text-slate-950 font-bold text-xs rounded-xl border border-white/10 hover:border-transparent transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-lg cursor-pointer"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Baixar .EXE</span>
            </a>
          </div>

          {/* ANDROID CARD - Bright Orange Glow */}
          <div className="group p-8 bg-[#0C0A08] hover:bg-[#12100E] border border-white/[0.06] hover:border-[#FF8A1F]/40 rounded-[28px] transition-all duration-300 flex flex-col justify-between space-y-8 relative overflow-hidden shadow-lg hover:shadow-[0_0_40px_rgba(255,138,31,0.16)]">
            <div className="space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-[#FF8A1F]/10 border border-[#FF8A1F]/25 text-[#FF8A1F] flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <Smartphone className="w-7 h-7 stroke-[1.8]" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-[#F8F7F5]">Android Mobile</h3>
                <p className="text-xs text-[#77716B] font-mono mt-1">
                  Pacote APK &amp; Google Play AAB
                </p>
              </div>

              <p className="text-sm text-[#B7B2AC] leading-relaxed">
                Chamadas em segundo plano com Foreground Service contínuo, captura de tela via MediaProjection do Android 14+ e baixo consumo de bateria.
              </p>
            </div>

            <a
              href="/releases/pumpkin-1.0.0.apk"
              download
              className="w-full py-3.5 px-4 bg-white/[0.05] hover:bg-[#FF8A1F] text-white hover:text-slate-950 font-bold text-xs rounded-xl border border-white/10 hover:border-transparent transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-lg cursor-pointer"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Baixar .APK Direto</span>
            </a>
          </div>

          {/* WEB BROWSER CARD - Warm Amber Glow */}
          <div className="group p-8 bg-[#0C0A08] hover:bg-[#12100E] border border-white/[0.06] hover:border-[#FFB347]/40 rounded-[28px] transition-all duration-300 flex flex-col justify-between space-y-8 relative overflow-hidden shadow-lg hover:shadow-[0_0_40px_rgba(255,179,71,0.15)]">
            <div className="space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-[#FFB347]/10 border border-[#FFB347]/25 text-[#FFB347] flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <Globe className="w-7 h-7 stroke-[1.8]" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-[#F8F7F5]">Navegador Web</h3>
                <p className="text-xs text-[#77716B] font-mono mt-1">
                  Chrome · Firefox · Edge · Safari
                </p>
              </div>

              <p className="text-sm text-[#B7B2AC] leading-relaxed">
                Acesse instantaneamente sem baixar absolutamente nada. Funciona em qualquer aba moderna com WebRTC e WebSockets criptografados.
              </p>
            </div>

            <Link
              to="/app"
              className="w-full py-3.5 px-4 bg-white/[0.05] hover:bg-gradient-to-r hover:from-[#FF6A00] hover:to-[#FF8A1F] text-white hover:text-slate-950 font-bold text-xs rounded-xl border border-white/10 hover:border-transparent transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-lg"
            >
              <span>Abrir no Navegador</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
