import React from 'react';
import { Link } from '../router';
import { FileText, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { PumpkinLogo } from '../components/common/PumpkinLogo';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-[#F8F7F5] selection:bg-[#FF7A00]/25 selection:text-[#FFB347] font-sans flex flex-col justify-between">
      <header className="py-6 px-6 border-b border-white/[0.06] bg-[#080808]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <PumpkinLogo size="md" />
          </Link>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <Link to="/open-source" className="text-[#B7B2AC] hover:text-[#FF8A1F] transition-colors">
              Open Source
            </Link>
            <Link to="/" className="text-[#B7B2AC] hover:text-white flex items-center gap-1.5 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar ao início</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16 flex-1 space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-[#FFB347]">
            <FileText className="w-3.5 h-3.5" />
            <span>Termos de Uso</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Termos de Uso do pumpkin
          </h1>
          <p className="text-xs text-[#77716B]">
            Última atualização: 29 de setembro de 2026 · Versão 1.0.0
          </p>
        </div>

        <div className="space-y-6 text-sm text-[#B7B2AC] leading-relaxed">
          <section className="space-y-3 p-5 rounded-2xl bg-[#0C0A08] border border-white/[0.06]">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#FF7A00]" />
              <span>1. Uso Aceitável</span>
            </h2>
            <p>
              O pumpkin é destinado à comunicação e colaboração de desenvolvedores, equipes e criadores. É expressamente proibido utilizar o serviço para envio de spam, ataques automatizados, transmissão de conteúdo ilícito ou exploração de vulnerabilidades.
            </p>
          </section>

          <section className="space-y-3 p-5 rounded-2xl bg-[#0C0A08] border border-white/[0.06]">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#FF7A00]" />
              <span>2. Responsabilidade pelo Conteúdo</span>
            </h2>
            <p>
              Você é o único responsável pelo conteúdo compartilhado através de mensagens de chat ou transmissão de tela. Certifique-se de não expor credenciais, chaves de API secretas ou informações confidenciais não autorizadas durante compartilhamentos de tela.
            </p>
          </section>

          <section className="space-y-3 p-5 rounded-2xl bg-[#0C0A08] border border-white/[0.06]">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#FF7A00]" />
              <span>3. Disponibilidade e Qualidade</span>
            </h2>
            <p>
              O pumpkin envida os melhores esforços para manter alta disponibilidade e baixa latência. A qualidade de áudio e a taxa de quadros (até 1080p 60 FPS) são alvos dinâmicos que dependem das capacidades de hardware e da estabilidade da rede de cada participante.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-white/[0.04] py-8 px-6 text-xs text-[#77716B] bg-[#050505]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>&copy; 2026 pumpkin · Termos Claros</span>
          <div className="flex items-center gap-6">
            <Link to="/" className="hover:text-white transition-colors">
              Início
            </Link>
            <Link to="/open-source" className="text-[#FF8A1F] hover:underline">
              Open Source
            </Link>
            <Link to="/download" className="hover:text-white transition-colors">
              Downloads
            </Link>
            <Link to="/app" className="hover:text-white transition-colors">
              Web App
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
