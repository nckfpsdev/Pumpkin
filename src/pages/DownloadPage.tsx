import React, { useState } from 'react';
import { useRouter, Link } from '../router';
import { platform } from '../services/platform';
import { project } from '../config/project';
import { DownloadTrustPanel } from '../components/download/DownloadTrustPanel';
import { PumpkinLogo } from '../components/common/PumpkinLogo';
import { PumpkinIllustration } from '../components/common/PumpkinIllustration';
import {
  Download,
  Laptop,
  Smartphone,
  Globe,
  FileCheck,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldCheck,
  Copy,
  Check,
  Terminal,
} from 'lucide-react';

export const DownloadPage: React.FC = () => {
  const { navigate } = useRouter();
  const [showChecksums, setShowChecksums] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [expandedWinHash, setExpandedWinHash] = useState(false);
  const [expandedApkHash, setExpandedApkHash] = useState(false);

  const windowsSha256 = '60e5f076f9c098a0e357293f4fa3fd52f1c7588cc5ba926fed5c3f69b9d37edf';
  const androidSha256 = '560ab671dd8614cdc4913eaacbf0819abb17f4a92a15b2e2b2b6e7346fd71295';

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F8F7F5] selection:bg-[#FF7A00]/25 selection:text-[#FFB347] font-sans flex flex-col justify-between">
      {/* Background warm ambient glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-b from-[#FF7A00]/10 to-transparent blur-[140px] pointer-events-none rounded-full -z-10"
        aria-hidden="true"
      />

      {/* Header */}
      <header className="py-6 px-6 border-b border-white/[0.06] bg-[#080808]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group cursor-pointer">
            <PumpkinLogo size="md" />
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-[#B7B2AC]">
            <Link to="/" className="hover:text-white transition-colors duration-200">
              Produto
            </Link>
            <Link to="/open-source" className="hover:text-[#FF8A1F] transition-colors duration-200">
              Open Source
            </Link>
            <Link to="/download" className="text-[#FF8A1F] transition-colors duration-200">
              Downloads
            </Link>
          </nav>

          <div className="flex items-center gap-3 text-xs font-semibold">
            <Link
              to="/app"
              className="px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-white rounded-xl border border-white/[0.07] transition-all"
            >
              Abrir Web App
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-16 flex-1 w-full space-y-12">
        <div className="text-center space-y-4">
          <div className="flex justify-center -mb-2">
            <PumpkinIllustration size="md" glow={true} animated={true} />
          </div>

          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#B7B2AC]">
            <span className="w-2 h-2 rounded-full bg-[#FF7A00] animate-pulse" />
            <span>Versão Oficial 1.0.0</span>
            <span aria-hidden="true" className="text-[#77716B]">·</span>
            <span>Downloads Verificáveis</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#F8F7F5]">
            Baixe o pumpkin
          </h1>
          <p className="text-base text-[#B7B2AC] max-w-lg mx-auto">
            Escolha sua plataforma preferida e comece a conversar com sua equipe em segundos.
          </p>
        </div>

        {/* Platform Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* WINDOWS CARD */}
          <div
            className={`p-6 bg-[#0C0A08] rounded-[24px] border transition-all flex flex-col justify-between space-y-6 relative ${
              platform.isWindows
                ? 'border-[#FF7A00] shadow-xl shadow-[#FF7A00]/10 ring-1 ring-[#FF7A00]/40'
                : 'border-white/[0.06] hover:border-white/[0.14]'
            }`}
          >
            {platform.isWindows && (
              <span className="absolute -top-3 left-6 px-2.5 py-0.5 rounded-full bg-[#FF7A00] text-slate-950 font-bold text-[10px] uppercase tracking-wider">
                Recomendado para seu PC
              </span>
            )}

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#FF7A00]/10 border border-[#FF7A00]/25 text-[#FF7A00] flex items-center justify-center">
                <Laptop className="w-6 h-6 stroke-[1.8]" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-white">Windows</h2>
                <div className="text-xs text-[#77716B] font-mono mt-0.5">pumpkin-Setup-1.0.0.exe</div>
              </div>

              <div className="space-y-1.5 text-xs text-[#B7B2AC] border-t border-white/[0.06] pt-3">
                <div className="flex justify-between">
                  <span className="text-[#77716B]">Compatibilidade:</span>
                  <span className="font-medium text-white">Windows 10 / 11 (64-bit)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#77716B]">Tamanho:</span>
                  <span className="font-mono text-white">65.5 KB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#77716B]">Instalador:</span>
                  <span className="text-white">NSIS Oficial</span>
                </div>
              </div>

              {/* Checksum Micro-Panel with Copy Button */}
              <div className="p-2.5 bg-[#050505] rounded-xl border border-white/[0.04] space-y-1.5 text-[11px] font-mono">
                <div className="flex items-center justify-between text-[#77716B]">
                  <span>SHA-256:</span>
                  <button
                    onClick={() => copyToClipboard(windowsSha256, 'win-card')}
                    className="text-[#FF8A1F] hover:underline flex items-center gap-1 cursor-pointer"
                    aria-label="Copiar SHA-256 Windows"
                  >
                    {copiedHash === 'win-card' ? (
                      <span className="text-emerald-400 font-bold">Copiado!</span>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="text-[#B7B2AC] break-all">
                  {expandedWinHash ? windowsSha256 : `${windowsSha256.slice(0, 10)}...${windowsSha256.slice(-8)}`}
                </div>
                <button
                  onClick={() => setExpandedWinHash(!expandedWinHash)}
                  className="text-[10px] text-[#77716B] hover:text-[#B7B2AC] underline cursor-pointer"
                >
                  {expandedWinHash ? 'Ver menos' : 'Ver hash completo'}
                </button>
              </div>
            </div>

            <a
              href="/releases/pumpkin-Setup-1.0.0.exe"
              download
              className="w-full py-3.5 bg-gradient-to-r from-[#FF6A00] to-[#FF8A1F] hover:brightness-110 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-[#FF7A00]/20 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Baixar .EXE (64-bit)</span>
            </a>
          </div>

          {/* ANDROID CARD */}
          <div
            className={`p-6 bg-[#0C0A08] rounded-[24px] border transition-all flex flex-col justify-between space-y-6 relative ${
              platform.isAndroid
                ? 'border-[#FF8A1F] shadow-xl shadow-[#FF8A1F]/10 ring-1 ring-[#FF8A1F]/40'
                : 'border-white/[0.06] hover:border-white/[0.14]'
            }`}
          >
            {platform.isAndroid && (
              <span className="absolute -top-3 left-6 px-2.5 py-0.5 rounded-full bg-[#FF8A1F] text-slate-950 font-bold text-[10px] uppercase tracking-wider">
                Recomendado para seu dispositivo
              </span>
            )}

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#FF8A1F]/10 border border-[#FF8A1F]/20 text-[#FF8A1F] flex items-center justify-center">
                <Smartphone className="w-6 h-6 stroke-[1.8]" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-white">Android</h2>
                <div className="text-xs text-[#77716B] font-mono mt-0.5">pumpkin-1.0.0.apk</div>
              </div>

              <div className="space-y-1.5 text-xs text-[#B7B2AC] border-t border-white/[0.06] pt-3">
                <div className="flex justify-between">
                  <span className="text-[#77716B]">Compatibilidade:</span>
                  <span className="font-medium text-white">Android 7.0+ (API 24)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#77716B]">Tamanho:</span>
                  <span className="font-mono text-white">65.5 KB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#77716B]">Google Play:</span>
                  <span className="text-emerald-400">Pacote .AAB Pronto</span>
                </div>
              </div>

              {/* Checksum Micro-Panel with Copy Button */}
              <div className="p-2.5 bg-[#050505] rounded-xl border border-white/[0.04] space-y-1.5 text-[11px] font-mono">
                <div className="flex items-center justify-between text-[#77716B]">
                  <span>SHA-256:</span>
                  <button
                    onClick={() => copyToClipboard(androidSha256, 'apk-card')}
                    className="text-[#FF8A1F] hover:underline flex items-center gap-1 cursor-pointer"
                    aria-label="Copiar SHA-256 Android"
                  >
                    {copiedHash === 'apk-card' ? (
                      <span className="text-emerald-400 font-bold">Copiado!</span>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="text-[#B7B2AC] break-all">
                  {expandedApkHash ? androidSha256 : `${androidSha256.slice(0, 10)}...${androidSha256.slice(-8)}`}
                </div>
                <button
                  onClick={() => setExpandedApkHash(!expandedApkHash)}
                  className="text-[10px] text-[#77716B] hover:text-[#B7B2AC] underline cursor-pointer"
                >
                  {expandedApkHash ? 'Ver menos' : 'Ver hash completo'}
                </button>
              </div>
            </div>

            <a
              href="/releases/pumpkin-1.0.0.apk"
              download
              className="w-full py-3.5 bg-[#12100E] hover:bg-[#181410] text-white border border-white/[0.08] hover:border-white/[0.18] font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Baixar .APK Direto</span>
            </a>
          </div>

          {/* WEB CARD */}
          <div className="p-6 bg-[#0C0A08] rounded-[24px] border border-white/[0.06] hover:border-white/[0.14] transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#FFB347]/10 border border-[#FFB347]/20 text-[#FFB347] flex items-center justify-center">
                <Globe className="w-6 h-6 stroke-[1.8]" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-white">Web Browser</h2>
                <div className="text-xs text-[#77716B] font-mono mt-0.5">Acesso instantâneo</div>
              </div>

              <div className="space-y-1.5 text-xs text-[#B7B2AC] border-t border-white/[0.06] pt-3">
                <div className="flex justify-between">
                  <span className="text-[#77716B]">Instalação:</span>
                  <span className="font-medium text-white">Nenhuma necessária</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#77716B]">Navegadores:</span>
                  <span className="text-white">Chrome, Edge, Firefox, Safari</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#77716B]">Cadastro:</span>
                  <span className="text-[#FF8A1F]">Sem cadastro</span>
                </div>
              </div>

              <div className="p-2.5 bg-[#050505] rounded-xl border border-white/[0.04] text-[11px] text-[#B7B2AC] leading-relaxed">
                Roda no seu navegador via WebRTC nativo, WebSockets e Web Audio API.
              </div>
            </div>

            <Link
              to="/app"
              className="w-full py-3.5 bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.08] font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span>Abrir pumpkin Web</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* DOWNLOAD TRUST PANEL COMPONENT */}
        <DownloadTrustPanel />

        {/* CHECKSUMS & INTEGRITY VERIFICATION EXPANDER */}
        <div id="verificacao" className="bg-[#0C0A08] border border-white/[0.06] rounded-[24px] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="text-sm font-bold text-white">Verificação de Integridade (SHA-256)</h3>
                <p className="text-xs text-[#B7B2AC]">
                  Valide a autenticidade dos instaladores com as assinaturas criptográficas oficiais.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowChecksums(!showChecksums)}
              className="p-2 text-[#B7B2AC] hover:text-white rounded-lg hover:bg-white/[0.04] transition-colors cursor-pointer"
              aria-label={showChecksums ? 'Ocultar instruções de verificação' : 'Expandir instruções de verificação'}
            >
              {showChecksums ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {showChecksums && (
            <div className="space-y-4 pt-3 border-t border-white/[0.06] text-xs font-mono">
              <div className="p-4 bg-[#050505] rounded-xl border border-white/[0.04] space-y-2">
                <div className="flex items-center justify-between text-[#B7B2AC]">
                  <span className="font-semibold text-white">pumpkin-Setup-1.0.0.exe</span>
                  <button
                    onClick={() => copyToClipboard(windowsSha256, 'exp-win')}
                    className="text-[#FF8A1F] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedHash === 'exp-win' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copiar</span>
                  </button>
                </div>
                <div className="text-[#FFB347] break-all select-all text-[11px]">
                  {windowsSha256}
                </div>
              </div>

              <div className="p-4 bg-[#050505] rounded-xl border border-white/[0.04] space-y-2">
                <div className="flex items-center justify-between text-[#B7B2AC]">
                  <span className="font-semibold text-white">pumpkin-1.0.0.apk</span>
                  <button
                    onClick={() => copyToClipboard(androidSha256, 'exp-apk')}
                    className="text-[#FF8A1F] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedHash === 'exp-apk' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copiar</span>
                  </button>
                </div>
                <div className="text-[#FFB347] break-all select-all text-[11px]">
                  {androidSha256}
                </div>
              </div>

              {/* Terminal Instructions */}
              <div className="p-4 bg-[#080808] rounded-xl border border-white/[0.04] space-y-3">
                <div className="text-white font-semibold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-[#FF7A00]" />
                  <span>Como testar no terminal:</span>
                </div>
                <div className="space-y-2 text-[11px]">
                  <div>
                    <span className="text-[#77716B]">Windows PowerShell:</span>
                    <div className="text-[#FFF1E6] bg-[#050505] p-2 rounded mt-0.5 select-all">
                      Get-FileHash .\pumpkin-Setup-1.0.0.exe -Algorithm SHA256
                    </div>
                  </div>
                  <div>
                    <span className="text-[#77716B]">Linux / macOS:</span>
                    <div className="text-[#FFF1E6] bg-[#050505] p-2 rounded mt-0.5 select-all">
                      sha256sum pumpkin-Setup-1.0.0.exe
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between text-[11px] text-[#77716B]">
                <a
                  href="/releases/checksums.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FF8A1F] hover:underline flex items-center gap-1"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Baixar checksums.txt oficial</span>
                </a>
                <Link to="/open-source" className="text-[#B7B2AC] hover:text-white transition-colors">
                  Saiba mais sobre builds auditáveis &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-8 px-6 text-xs text-[#77716B] bg-[#050505]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <PumpkinLogo size="sm" showText={false} />
            <span className="font-mono font-bold text-white">pumpkin</span>
            <span>· Downloads Oficiais</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/" className="hover:text-white transition-colors duration-200">
              Página Inicial
            </Link>
            <Link to="/open-source" className="hover:text-[#FF8A1F] transition-colors duration-200">
              Open Source
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
        </div>
      </footer>
    </div>
  );
};
