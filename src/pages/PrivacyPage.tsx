import React from 'react';
import { Link } from '../router';
import { Shield, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { PumpkinLogo } from '../components/common/PumpkinLogo';

export const PrivacyPage: React.FC = () => {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-400">
            <Shield className="w-3.5 h-3.5" />
            <span>Compromisso de Privacidade</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Política de Privacidade do pumpkin
          </h1>
          <p className="text-xs text-[#77716B]">
            Última atualização: 29 de setembro de 2026 &bull; Versão 1.0.0
          </p>
        </div>

        <div className="space-y-6 text-sm text-[#B7B2AC] leading-relaxed">
          <section className="space-y-3 p-5 rounded-2xl bg-[#0C0A08] border border-white/[0.06]">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#FF7A00]" />
              <span>1. Zero Cadastro e Sem Coleta de Senhas</span>
            </h2>
            <p>
              O pumpkin foi construído com base no princípio do mínimo privilégio. Não exigimos e-mail, senha, número de telefone nem vinculação de contas de terceiros. Seu apelido é armazenado exclusivamente no seu navegador ou dispositivo local via <code className="text-xs bg-white/10 px-1.5 py-0.5 rounded text-white font-mono">localStorage</code>.
            </p>
          </section>

          <section className="space-y-3 p-5 rounded-2xl bg-[#0C0A08] border border-white/[0.06]">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#FF7A00]" />
              <span>2. Uso Consciente de Microfone e Tela</span>
            </h2>
            <p>
              As permissões de microfone e captura de tela são solicitadas apenas quando você decide explicitamente entrar em um canal de voz ou iniciar uma transmissão. O pumpkin <strong>nunca</strong> ativa sensores de mídia em segundo plano sem sua autorização expressa.
            </p>
          </section>

          <section className="space-y-3 p-5 rounded-2xl bg-[#0C0A08] border border-white/[0.06]">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#FF7A00]" />
              <span>3. Não Gravação de Áudio ou Vídeo</span>
            </h2>
            <p>
              O pumpkin é uma plataforma de transmissão em tempo real, não de gravação. Nenhuma conversa de voz, trilha de áudio ou captura de tela é gravada ou arquivada em nossos servidores.
            </p>
          </section>

          <section className="space-y-3 p-5 rounded-2xl bg-[#0C0A08] border border-white/[0.06]">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#FF7A00]" />
              <span>4. Comunicação Criptografada</span>
            </h2>
            <p>
              Todas as transmissões de mídia WebRTC utilizam protocolos criptografados padrão da indústria (DTLS/SRTP). A sinalização e o chat em tempo real trafegam exclusivamente sobre conexões seguras HTTPS e WSS.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-white/[0.04] py-8 px-6 text-xs text-[#77716B] bg-[#050505]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>&copy; 2026 pumpkin · Privacidade Transparente</span>
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
