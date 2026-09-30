import React, { useState, useEffect } from 'react';
import { useRouter, Link } from '../router';
import { platform } from '../services/platform';
import {
  Download,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { CosmicDust } from '../components/landing/CosmicDust';
import { HeroMockup } from '../components/landing/HeroMockup';
import { BentoFeatures } from '../components/landing/BentoFeatures';
import { ScreenShareShowcase } from '../components/landing/ScreenShareShowcase';
import { PlatformShowcase } from '../components/landing/PlatformShowcase';
import { CosmicMarquee } from '../components/landing/CosmicMarquee';
import { OpenSourceTrustSection } from '../components/landing/OpenSourceTrustSection';
import { PumpkinLogo } from '../components/common/PumpkinLogo';
import { PumpkinIllustration } from '../components/common/PumpkinIllustration';

export const LandingPage: React.FC = () => {
  const { navigate } = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const primaryDownloadAction = () => {
    if (platform.isWindows) {
      window.location.href = '/releases/pumpkin-Setup-1.0.0.exe';
    } else if (platform.isAndroid) {
      window.location.href = '/releases/pumpkin-1.0.0.apk';
    } else {
      navigate('/download');
    }
  };

  const primaryDownloadLabel = platform.isWindows
    ? 'Baixar para Windows (.EXE)'
    : platform.isAndroid
    ? 'Baixar para Android (.APK)'
    : 'Baixar pumpkin';

  return (
    <div className="min-h-screen bg-[#050505] text-[#F8F7F5] selection:bg-[#FF7A00]/25 selection:text-[#FFB347] overflow-x-hidden font-sans relative">
      {/* ========================================================================= */}
      {/* ATMOSPHERE BACKGROUND LAYERS (Galaxy Black, Orbs, Warm Dust, Subtle Gradients) */}
      {/* ========================================================================= */}
      {/* Top Hero Ambient Spotlight */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[640px] bg-gradient-to-b from-[#FF7A00]/12 via-[#EA580C]/08 to-transparent blur-[160px] pointer-events-none rounded-full -z-10 animate-ambient-pulse"
        aria-hidden="true"
      />
      {/* Lateral Secondary Glow */}
      <div
        className="fixed top-1/3 -right-48 w-[600px] h-[600px] bg-gradient-to-l from-[#FF8A1F]/08 via-[#FFB347]/04 to-transparent blur-[160px] pointer-events-none rounded-full -z-10"
        aria-hidden="true"
      />
      <div
        className="fixed bottom-1/4 -left-48 w-[600px] h-[600px] bg-gradient-to-r from-[#FF7A00]/07 to-transparent blur-[160px] pointer-events-none rounded-full -z-10"
        aria-hidden="true"
      />

      {/* Cosmic Dust Particle Canvas */}
      <CosmicDust />

      {/* ========================================================================= */}
      {/* FLOATING GLASS NAVBAR */}
      {/* ========================================================================= */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#080808]/85 backdrop-blur-xl border-b border-white/[0.06] py-3.5 shadow-[0_12px_36px_rgba(0,0,0,0.6)]'
            : 'bg-transparent py-5 sm:py-6'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group cursor-pointer">
            <PumpkinLogo size="md" />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-[#B7B2AC]">
            <a href="#como-funciona" className="hover:text-white transition-colors duration-200">
              Produto
            </a>
            <a href="#recursos" className="hover:text-white transition-colors duration-200">
              Recursos
            </a>
            <Link to="/open-source" className="hover:text-[#FF8A1F] transition-colors duration-200">
              Open Source
            </Link>
            <Link to="/download" className="hover:text-[#FF8A1F] transition-colors duration-200">
              Downloads
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <Link
              to="/app"
              className="hidden sm:inline-flex px-4 py-2 text-xs font-semibold text-[#B7B2AC] hover:text-white bg-white/[0.04] hover:bg-white/[0.08] rounded-xl border border-white/[0.07] transition-all duration-200"
            >
              Abrir Web App
            </Link>
            <Link
              to="/download"
              className="px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-[#FF6A00] to-[#FF8A1F] hover:brightness-110 rounded-xl shadow-lg shadow-[#FF7A00]/25 transition-all duration-200 flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Download</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* HERO SECTION (90-100vh) */}
      {/* ========================================================================= */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 px-6 relative z-10 flex flex-col items-center">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          {/* Imagem Oficial da Abóbora pumpkin */}
          <div className="flex justify-center items-center pb-2">
            <div className="relative group cursor-pointer inline-flex items-center justify-center">
              <PumpkinIllustration size="lg" glow={true} animated={true} />
            </div>
          </div>

          {/* Eyebrow / Kicker */}
          <div className="inline-flex items-center gap-2 text-xs text-[#B7B2AC] tracking-wide">
            <span className="w-2 h-2 rounded-full bg-[#FF7A00] animate-pulse" />
            <span>Versão 1.0.0 Oficial</span>
            <span aria-hidden="true" className="text-[#77716B]">·</span>
            <span>WebRTC Multiplataforma</span>
            <span aria-hidden="true" className="text-[#77716B]">·</span>
            <span className="text-[#FF8A1F] font-mono">1080p 60 FPS</span>
          </div>

          {/* GIANT HEADLINE WITH TARGETED PUMPKIN GRADIENT */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[84px] font-extrabold tracking-tight text-[#F8F7F5] leading-[1.05] max-w-4xl mx-auto">
            Converse. Compartilhe. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6A00] via-[#FF8A1F] via-60% to-[#FFB347]">
              Entre sem complicação.
            </span>
          </h1>

          {/* SUBHEADLINE */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-[#B7B2AC] leading-relaxed font-normal">
            O <strong className="text-white font-semibold">pumpkin</strong> é a plataforma de comunicação em tempo real com canais de voz de baixa latência, chat instantâneo e compartilhamento de tela até 1080p 60 FPS — sem cadastro tradicional e sem senha.
          </p>

          {/* CTAs BUTTONS */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
            <button
              onClick={primaryDownloadAction}
              className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-[#FF6A00] to-[#FF8A1F] hover:brightness-110 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-[#FF7A00]/25 hover:shadow-[#FF7A00]/40 transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>{primaryDownloadLabel}</span>
            </button>

            <Link
              to="/app"
              className="w-full sm:w-auto px-7 py-3.5 bg-[#0C0A08] hover:bg-[#12100E] text-[#F8F7F5] font-semibold text-sm rounded-xl border border-white/[0.08] hover:border-white/[0.18] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>Abrir no Navegador</span>
              <ArrowRight className="w-4 h-4 stroke-[2]" />
            </Link>
          </div>

          {/* Quiet platform indicators */}
          <div className="pt-1 text-xs text-[#77716B] font-mono flex items-center justify-center gap-2">
            <span>Windows (x64)</span>
            <span aria-hidden="true">·</span>
            <span>Android (APK / AAB)</span>
            <span aria-hidden="true">·</span>
            <span>Navegador Web</span>
          </div>

          {/* 3D FLOATING HERO MOCKUP */}
          <div className="pt-12 sm:pt-16 w-full">
            <HeroMockup />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* DISCREET HORIZONTAL MARQUEE */}
      {/* ========================================================================= */}
      <CosmicMarquee />

      {/* ========================================================================= */}
      {/* SECTION: COMO FUNCIONA (Simplicidade Radical) */}
      {/* ========================================================================= */}
      <section id="como-funciona" className="py-28 px-6 bg-[#080808] relative z-10 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-xl mx-auto">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#FF7A00]">
              Simplicidade Radical
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F8F7F5] tracking-tight">
              Como funciona o pumpkin
            </h2>
            <p className="text-sm sm:text-base text-[#B7B2AC] font-normal leading-relaxed">
              Sem formulários de dezenas de campos, sem senhas esquecidas e sem burocracia de validação de e-mail.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 bg-[#0C0A08] border border-white/[0.06] rounded-[26px] space-y-4 relative overflow-hidden group hover:border-white/[0.12] transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/25 text-[#FF7A00] font-mono font-bold flex items-center justify-center text-lg">
                01
              </div>
              <h3 className="text-xl font-bold text-[#F8F7F5]">Escolha seu apelido</h3>
              <p className="text-sm text-[#B7B2AC] leading-relaxed">
                Basta digitar o nome pelo qual seus colegas de equipe te conhecem. Não solicitamos senha, e-mail nem login social.
              </p>
            </div>

            <div className="p-8 bg-[#0C0A08] border border-white/[0.06] rounded-[26px] space-y-4 relative overflow-hidden group hover:border-white/[0.12] transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#FF8A1F]/10 border border-[#FF8A1F]/25 text-[#FF8A1F] font-mono font-bold flex items-center justify-center text-lg">
                02
              </div>
              <h3 className="text-xl font-bold text-[#F8F7F5]">Entre no servidor</h3>
              <p className="text-sm text-[#B7B2AC] leading-relaxed">
                Conecte-se instantaneamente via WebSocket criptografado. Você já visualiza a lista de membros e os canais disponíveis.
              </p>
            </div>

            <div className="p-8 bg-[#0C0A08] border border-white/[0.06] rounded-[26px] space-y-4 relative overflow-hidden group hover:border-white/[0.12] transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#FFB347]/10 border border-[#FFB347]/25 text-[#FFB347] font-mono font-bold flex items-center justify-center text-lg">
                03
              </div>
              <h3 className="text-xl font-bold text-[#F8F7F5]">Converse e compartilhe</h3>
              <p className="text-sm text-[#B7B2AC] leading-relaxed">
                Um clique para ligar o microfone via Opus e outro para transmitir sua tela em 1080p60 para toda a sala.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION: BENTO GRID RECURSOS */}
      {/* ========================================================================= */}
      <BentoFeatures />

      {/* ========================================================================= */}
      {/* SECTION: SCREEN SHARE DEDICATED SHOWCASE */}
      {/* ========================================================================= */}
      <ScreenShareShowcase />

      {/* ========================================================================= */}
      {/* SECTION: CROSS-PLATFORM (Windows, Android, Web) */}
      {/* ========================================================================= */}
      <PlatformShowcase />

      {/* ========================================================================= */}
      {/* SECTION: OPEN SOURCE & AUDITABILITY */}
      {/* ========================================================================= */}
      <OpenSourceTrustSection />

      {/* ========================================================================= */}
      {/* SECTION: PRIVACY BY PRINCIPLE */}
      {/* ========================================================================= */}
      <section className="py-24 px-6 bg-[#080808] border-t border-white/[0.04] relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto text-[#FF7A00]">
            <Shield className="w-6 h-6 stroke-[2]" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F8F7F5] tracking-tight">
            Seu microfone. Sua tela. Sua escolha.
          </h2>
          <p className="text-sm sm:text-base text-[#B7B2AC] leading-relaxed max-w-2xl mx-auto">
            O pumpkin solicita permissões estritamente sob demanda. O microfone e o compartilhamento de tela nunca operam sem sua autorização explícita e nenhum segundo de gravação é retido em servidores.
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FINAL CALL TO ACTION (Warm Ambient Glow) */}
      {/* ========================================================================= */}
      <section className="py-32 px-6 border-t border-white/[0.04] relative z-10 text-center overflow-hidden">
        {/* Intense Central Ambient Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-[#FF7A00]/15 via-[#EA580C]/12 to-[#FFB347]/10 blur-[140px] pointer-events-none rounded-full -z-10"
          aria-hidden="true"
        />

        <div className="max-w-3xl mx-auto space-y-8 relative z-10">
          <div className="flex justify-center -mb-2">
            <PumpkinIllustration size="md" glow={true} animated={true} />
          </div>

          <h2 className="text-4xl sm:text-6xl font-extrabold text-[#F8F7F5] tracking-tight leading-[1.08]">
            Entre. Converse. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6A00] to-[#FF8A1F]">
              Compartilhe agora.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-[#B7B2AC] max-w-xl mx-auto">
            Experimente a facilidade de colaborar com sua equipe em segundos, sem cadastro e com a melhor qualidade de transmissão.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="/releases/pumpkin-Setup-1.0.0.exe"
              className="px-7 py-3.5 bg-gradient-to-r from-[#FF6A00] to-[#FF8A1F] hover:brightness-110 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-[#FF7A00]/25 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Baixar para Windows</span>
            </a>

            <a
              href="/releases/pumpkin-1.0.0.apk"
              className="px-7 py-3.5 bg-[#0C0A08] hover:bg-[#12100E] text-[#F8F7F5] border border-white/[0.08] hover:border-white/[0.18] font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Baixar para Android</span>
            </a>

            <Link
              to="/app"
              className="px-7 py-3.5 bg-white/[0.04] hover:bg-white/[0.08] text-[#FFF1E6] font-bold text-xs sm:text-sm rounded-xl border border-white/[0.06] flex items-center gap-2 transition-all"
            >
              <span>Abrir Versão Web</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FOOTER */}
      {/* ========================================================================= */}
      <footer className="border-t border-white/[0.04] bg-[#050505] py-14 px-6 text-xs text-[#77716B]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <PumpkinLogo size="sm" showText={false} />
            <span className="font-mono font-bold text-white text-sm">pumpkin</span>
            <span>· Comunicação em Tempo Real</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/" className="hover:text-white transition-colors duration-200">
              Produto
            </Link>
            <Link to="/open-source" className="hover:text-[#FF8A1F] transition-colors duration-200">
              Open Source
            </Link>
            <Link to="/download" className="hover:text-white transition-colors duration-200">
              Downloads
            </Link>
            <Link to="/app" className="hover:text-white transition-colors duration-200">
              Web App
            </Link>
            <Link to="/privacy" className="hover:text-white transition-colors duration-200">
              Privacidade
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors duration-200">
              Termos
            </Link>
          </div>

          <div className="font-mono text-[11px] text-[#77716B]">
            &copy; 2026 pumpkin · v1.0.0
          </div>
        </div>
      </footer>
    </div>
  );
};
