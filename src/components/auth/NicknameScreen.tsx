import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Shield, Zap, Sparkles } from 'lucide-react';
import { PumpkinLogo } from '../common/PumpkinLogo';
import { PumpkinIllustration } from '../common/PumpkinIllustration';

export const NicknameScreen: React.FC = () => {
  const { login } = useApp();
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = login(nickname);
    if (!result.success) {
      setError(result.error || 'Erro ao entrar.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#050505] text-[#F8F7F5] p-4 relative overflow-hidden select-none">
      {/* Background warm ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#FF7A00]/12 via-[#FF8A1F]/08 to-transparent blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[250px] bg-gradient-to-tl from-[#FFB347]/06 to-transparent blur-[100px] pointer-events-none rounded-full" />

      {/* Main card */}
      <div className="w-full max-w-md bg-[#0C0A08]/90 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-8 shadow-2xl relative z-10">
        {/* Brand header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="mb-2">
            <PumpkinIllustration size="sm" glow={true} animated={true} />
          </div>
          <PumpkinLogo size="lg" className="mb-3" />
          <p className="text-xs uppercase tracking-widest text-[#B7B2AC] font-medium">
            Realtime Voice &bull; Chat &bull; Screen Sharing
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="nickname-input" className="block text-xs font-semibold uppercase tracking-wider text-[#B7B2AC] mb-2">
              Escolha seu apelido
            </label>
            <div className="relative">
              <input
                id="nickname-input"
                type="text"
                autoFocus
                maxLength={24}
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Ex: Nicholas, DevAlpha, Rafael..."
                className="w-full px-4 py-3 bg-[#12100E] border border-white/[0.08] rounded-xl text-[#F8F7F5] placeholder-[#77716B] focus:outline-none focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00] transition-all text-sm font-medium"
              />
              <span className="absolute right-3 top-3.5 text-xs text-[#77716B] font-mono">
                {nickname.length}/24
              </span>
            </div>
            {error && (
              <p className="mt-2 text-xs text-rose-400 font-medium flex items-center gap-1.5 animate-fadeIn">
                <span>&bull;</span> {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || nickname.trim().length < 2}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-[#FF6A00] to-[#FF8A1F] hover:brightness-110 text-slate-950 font-bold text-sm rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#FF7A00]/25 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99]"
          >
            <span>Entrar no pumpkin</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>

        {/* Feature badges list */}
        <div className="mt-8 pt-6 border-t border-white/[0.06] space-y-2.5">
          <div className="flex items-center gap-2.5 text-xs text-[#B7B2AC]">
            <Zap className="w-3.5 h-3.5 text-[#FF7A00] shrink-0" />
            <span>Sem cadastro, sem senha. Conexão instantânea.</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-[#B7B2AC]">
            <Sparkles className="w-3.5 h-3.5 text-[#FF8A1F] shrink-0" />
            <span>Canais de voz WebRTC com Opus em tempo real.</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-[#B7B2AC]">
            <Shield className="w-3.5 h-3.5 text-[#FFB347] shrink-0" />
            <span>Compartilhamento de tela fluido até 1080p 60 FPS.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
