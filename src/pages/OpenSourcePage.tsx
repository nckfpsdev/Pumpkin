import React, { useState } from 'react';
import { Link } from '../router';
import { project } from '../config/project';
import { useGitHubMetrics } from '../services/github';
import {
  Github,
  CheckCircle2,
  Copy,
  Check,
  Shield,
  FileCheck,
  AlertTriangle,
  FolderGit2,
  Star,
  GitFork,
  Users,
  Clock,
  RefreshCw,
  Tag,
  ExternalLink,
  Terminal,
  ArrowRight,
} from 'lucide-react';
import { CosmicDust } from '../components/landing/CosmicDust';
import { PumpkinLogo } from '../components/common/PumpkinLogo';
import { PumpkinIllustration } from '../components/common/PumpkinIllustration';

export const OpenSourcePage: React.FC = () => {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const { metrics, isLoading, refresh } = useGitHubMetrics();

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const windowsSha256 = '60e5f076f9c098a0e357293f4fa3fd52f1c7588cc5ba926fed5c3f69b9d37edf';
  const androidSha256 = '560ab671dd8614cdc4913eaacbf0819abb17f4a92a15b2e2b2b6e7346fd71295';

  return (
    <div className="min-h-screen bg-[#050505] text-[#F8F7F5] selection:bg-[#FF7A00]/25 selection:text-[#FFB347] overflow-x-hidden font-sans relative">
      {/* Ambient background glows */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#FF7A00]/10 via-[#EA580C]/08 to-transparent blur-[160px] pointer-events-none rounded-full -z-10"
        aria-hidden="true"
      />
      <div
        className="fixed bottom-1/3 -right-40 w-[600px] h-[600px] bg-gradient-to-l from-[#FF8A1F]/06 to-transparent blur-[160px] pointer-events-none rounded-full -z-10"
        aria-hidden="true"
      />

      <CosmicDust />

      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-50 bg-[#080808]/85 backdrop-blur-xl border-b border-white/[0.06] py-3.5 shadow-[0_12px_36px_rgba(0,0,0,0.6)]">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group cursor-pointer">
            <PumpkinLogo size="md" />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-[#B7B2AC]">
            <Link to="/" className="hover:text-white transition-colors duration-200">
              Produto
            </Link>
            <Link to="/open-source" className="text-[#FF8A1F] transition-colors duration-200">
              Open Source
            </Link>
            <Link to="/download" className="hover:text-white transition-colors duration-200">
              Downloads
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/app"
              className="px-4 py-2 text-xs font-semibold text-[#B7B2AC] hover:text-white bg-white/[0.04] hover:bg-white/[0.08] rounded-xl border border-white/[0.07] transition-all duration-200"
            >
              Abrir pumpkin
            </Link>
            {project.repositoryUrl && (
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex px-3.5 py-2 text-xs font-bold text-white bg-[#0C0A08] hover:bg-[#12100E] rounded-xl border border-white/[0.1] hover:border-white/[0.2] transition-all items-center gap-1.5"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="pt-24 pb-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="flex justify-center -mb-2">
            <PumpkinIllustration size="md" glow={true} animated={true} />
          </div>

          <div className="inline-flex items-center gap-2 text-xs text-[#B7B2AC] font-mono tracking-wide">
            <span className="w-2 h-2 rounded-full bg-[#FF7A00] animate-pulse" />
            <span className="text-[#FF8A1F] font-bold">OPEN SOURCE</span>
            <span aria-hidden="true" className="text-[#77716B]">·</span>
            <span>LICENÇA MIT</span>
            <span aria-hidden="true" className="text-[#77716B]">·</span>
            <span>TRANSPARÊNCIA TOTAL</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#F8F7F5] tracking-tight leading-[1.08]">
            Confiança começa com <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6A00] via-[#FF8A1F] to-[#FFB347]">
              transparência.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#B7B2AC] font-normal leading-relaxed">
            O código do pumpkin está disponível para inspeção pública. Você pode examinar a implementação, auditar o comportamento da rede, acompanhar mudanças em tempo real e validar a integridade exata dos binários que instala.
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-3.5">
            {project.repositoryUrl ? (
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-gradient-to-r from-[#FF6A00] to-[#FF8A1F] hover:brightness-110 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-[#FF7A00]/25 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <Github className="w-4 h-4" />
                <span>Ver código no GitHub</span>
              </a>
            ) : (
              <div className="text-xs text-[#77716B] font-mono">
                Repositório configurável via VITE_REPOSITORY_URL
              </div>
            )}

            <Link
              to="/download"
              className="px-6 py-3.5 bg-[#0C0A08] hover:bg-[#12100E] text-[#F8F7F5] font-semibold text-xs sm:text-sm rounded-xl border border-white/[0.08] hover:border-white/[0.18] transition-all flex items-center gap-2"
            >
              <span>Ver últimas releases</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#verificacao"
              className="px-4 py-3.5 text-xs text-[#B7B2AC] hover:text-[#FF8A1F] transition-colors flex items-center gap-1 font-mono"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Como verificar um download</span>
            </a>
          </div>
        </div>

        {/* HERO VISUAL: SOURCE REPOSITORY TREE & PIPELINE */}
        <div className="mt-14 max-w-4xl mx-auto">
          <div className="p-px rounded-[24px] bg-gradient-to-b from-white/15 via-white/[0.05] to-transparent shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
            <div className="bg-[#0C0A08] rounded-[23px] p-5 sm:p-7 border border-white/[0.06] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
                <div className="flex items-center gap-3">
                  {metrics?.avatarUrl ? (
                    <img
                      src={metrics.avatarUrl}
                      alt={metrics.owner}
                      className="w-10 h-10 rounded-xl border border-[#FF7A00]/40 shadow-sm"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-[#FF7A00]/15 border border-[#FF7A00]/30 text-[#FF8A1F] flex items-center justify-center">
                      <FolderGit2 className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-bold text-white font-mono flex items-center gap-2">
                      <a
                        href={project.repositoryUrl || `https://github.com/${metrics?.owner || 'nckfpsdev'}/${metrics?.repo || 'pumpkin'}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#FF8A1F] transition-colors"
                      >
                        {metrics?.owner || project.githubOwner}/{metrics?.repo || project.repositoryName}
                      </a>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-sans">
                        Público
                      </span>
                      {metrics?.isLive && (
                        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Live GitHub
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#77716B] font-mono flex items-center gap-2 mt-0.5">
                      <span>Autor:</span>
                      <a
                        href={project.githubProfileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#FFF1E6] hover:text-[#FF8A1F] hover:underline"
                      >
                        @{metrics?.owner || project.githubOwner}
                      </a>
                      <span>·</span>
                      <span>Branch: <strong className="text-[#B7B2AC] font-normal">{metrics?.defaultBranch || 'main'}</strong></span>
                      <span>·</span>
                      <span>Licença: <strong className="text-[#B7B2AC] font-normal">{metrics?.license || 'MIT'}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-xs font-mono text-[#B7B2AC]">
                  <button
                    onClick={() => refresh()}
                    disabled={isLoading}
                    title="Atualizar métricas do GitHub"
                    className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[#B7B2AC] hover:text-white transition-colors cursor-pointer"
                    aria-label="Atualizar métricas ao vivo"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#FF8A1F]' : ''}`} />
                  </button>

                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-[#FF8A1F]" /> v1.0.0 Estável
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> CI Verde
                  </span>
                  <a
                    href={project.repositoryUrl || `https://github.com/${metrics?.owner || 'nckfpsdev'}/${metrics?.repo || 'pumpkin'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white flex items-center gap-1 text-[11px] transition-colors"
                    aria-label="Abrir repositório no GitHub"
                  >
                    <Github className="w-3 h-3" />
                    <span>Abrir</span>
                    <ExternalLink className="w-2.5 h-2.5 text-[#FF8A1F]" />
                  </a>
                </div>
              </div>

              {/* LIVE REPOSITORY METRICS BAR */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 bg-[#050505] rounded-xl border border-white/[0.04] space-y-1">
                  <div className="flex items-center justify-between text-[#77716B] text-[10px] uppercase font-bold">
                    <span>Stars</span>
                    <Star className="w-3 h-3 text-amber-400" />
                  </div>
                  <div className="text-base font-bold text-white">
                    {isLoading ? (
                      <span className="inline-block w-8 h-4 bg-white/10 rounded animate-pulse" />
                    ) : (
                      metrics?.stars ?? 0
                    )}
                  </div>
                  <div className="text-[10px] text-[#77716B]">GitHub Stargazers</div>
                </div>

                <div className="p-3 bg-[#050505] rounded-xl border border-white/[0.04] space-y-1">
                  <div className="flex items-center justify-between text-[#77716B] text-[10px] uppercase font-bold">
                    <span>Forks</span>
                    <GitFork className="w-3 h-3 text-[#FF7A00]" />
                  </div>
                  <div className="text-base font-bold text-white">
                    {isLoading ? (
                      <span className="inline-block w-8 h-4 bg-white/10 rounded animate-pulse" />
                    ) : (
                      metrics?.forks ?? 0
                    )}
                  </div>
                  <div className="text-[10px] text-[#77716B]">Bifurcações ativas</div>
                </div>

                <div className="p-3 bg-[#050505] rounded-xl border border-white/[0.04] space-y-1">
                  <div className="flex items-center justify-between text-[#77716B] text-[10px] uppercase font-bold">
                    <span>Contribuidores</span>
                    <Users className="w-3 h-3 text-[#FF8A1F]" />
                  </div>
                  <div className="text-base font-bold text-white">
                    {isLoading ? (
                      <span className="inline-block w-8 h-4 bg-white/10 rounded animate-pulse" />
                    ) : (
                      metrics?.contributorsCount ?? 1
                    )}
                  </div>
                  <div className="text-[10px] text-[#77716B]">Autores do código</div>
                </div>

                <div className="p-3 bg-[#050505] rounded-xl border border-white/[0.04] space-y-1">
                  <div className="flex items-center justify-between text-[#77716B] text-[10px] uppercase font-bold">
                    <span>Última Atividade</span>
                    <Clock className="w-3 h-3 text-emerald-400" />
                  </div>
                  <div className="text-xs font-bold text-white truncate">
                    {isLoading ? (
                      <span className="inline-block w-16 h-4 bg-white/10 rounded animate-pulse" />
                    ) : metrics?.lastPushedAt ? (
                      new Date(metrics.lastPushedAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })
                    ) : (
                      'Recente'
                    )}
                  </div>
                  <div className="text-[10px] text-[#77716B]">Commit mais recente</div>
                </div>
              </div>

              {/* FLOW DIAGRAM: SOURCE -> CI -> RELEASE -> VERIFIED */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 bg-[#050505] rounded-xl border border-white/[0.04] space-y-1">
                  <div className="text-[#77716B] text-[10px] uppercase font-bold">1. Código-Fonte</div>
                  <div className="text-white font-semibold">Repositório Git</div>
                  <div className="text-[11px] text-[#B7B2AC]">TypeScript + Rust</div>
                </div>

                <div className="p-3 bg-[#050505] rounded-xl border border-white/[0.04] space-y-1">
                  <div className="text-[#77716B] text-[10px] uppercase font-bold">2. Compilação CI</div>
                  <div className="text-[#FF7A00] font-semibold">GitHub Actions</div>
                  <div className="text-[11px] text-[#B7B2AC]">Runners isolados</div>
                </div>

                <div className="p-3 bg-[#050505] rounded-xl border border-white/[0.04] space-y-1">
                  <div className="text-[#77716B] text-[10px] uppercase font-bold">3. Checksum</div>
                  <div className="text-[#FF8A1F] font-semibold">SHA-256 Automático</div>
                  <div className="text-[11px] text-[#B7B2AC]">checksums.txt</div>
                </div>

                <div className="p-3 bg-[#050505] rounded-xl border border-white/[0.04] space-y-1">
                  <div className="text-[#77716B] text-[10px] uppercase font-bold">4. Instalação</div>
                  <div className="text-emerald-400 font-semibold">Auditável</div>
                  <div className="text-[11px] text-[#B7B2AC]">Zero modificação</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: NÃO PRECISA CONFIAR CEGAMENTE */}
      <section className="py-20 px-6 bg-[#080808] border-t border-white/[0.04] relative z-10">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#FF7A00]">
            Princípio de Transparência
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F8F7F5] tracking-tight">
            Não precisa confiar cegamente.
          </h2>
          <div className="space-y-4 text-sm sm:text-base text-[#B7B2AC] leading-relaxed">
            <p>
              Em modelos de software de código fechado, você recebe um arquivo executável e precisa confiar inteiramente na boa fé do distribuidor. Você não pode auditar se conexões adicionais estão sendo abertas, se o microfone é acessado fora de hora ou como os dados trafegam.
            </p>
            <p>
              No <strong className="text-white font-semibold">pumpkin</strong>, o código está aberto para que desenvolvedores e usuários técnicos examinem as chamadas de rede, verifiquem a ausência de rastreadores e validem que o binário que roda no seu sistema operacional é idêntico ao construído a partir do código versionado.
            </p>
            <p className="text-xs text-[#77716B] italic border-l-2 border-[#FF7A00]/40 pl-3">
              Nota responsável: Código aberto não significa infalibilidade mágica; significa auditabilidade e escrutínio público contínuo.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION: CÓDIGO QUE VOCÊ PODE INSPECIONAR */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto space-y-14">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#FF8A1F]">
              Módulos do Sistema
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F8F7F5] tracking-tight">
              Código que você pode inspecionar.
            </h2>
            <p className="text-sm text-[#B7B2AC]">
              Todos os módulos abaixo fazem parte deste repositório e podem ser examinados diretamente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {project.components.map((comp) => (
              <div
                key={comp.name}
                className="p-6 bg-[#0C0A08] border border-white/[0.06] hover:border-white/[0.14] rounded-[24px] space-y-4 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#FF8A1F] bg-[#181410] px-2.5 py-1 rounded-md border border-[#FF7A00]/20">
                    {comp.path}
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400">
                    {comp.license}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">{comp.name}</h3>
                <p className="text-xs text-[#B7B2AC] leading-relaxed">
                  {comp.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: DO CÓDIGO AO INSTALADOR & BUILDS AUTOMATIZADOS */}
      <section className="py-24 px-6 bg-[#080808] border-t border-white/[0.04] relative z-10">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#FF7A00]">
              Pipeline Automatizado
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F8F7F5] tracking-tight">
              Do código ao instalador.
            </h2>
            <p className="text-sm text-[#B7B2AC] max-w-2xl leading-relaxed">
              Os binários distribuídos aos usuários não são gerados manualmente em máquinas locais opacas. Eles são compilados pelo GitHub Actions diretamente a partir das tags do repositório.
            </p>
          </div>

          {/* Visual Step Pipeline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-[#0C0A08] border border-white/[0.06] rounded-[24px] space-y-3">
              <div className="w-8 h-8 rounded-lg bg-[#FF7A00]/15 text-[#FF7A00] font-mono font-bold flex items-center justify-center text-sm">
                01
              </div>
              <h3 className="text-base font-bold text-white">1. Tag e Disparo</h3>
              <p className="text-xs text-[#B7B2AC] leading-relaxed">
                Ao criar uma tag semântica (ex: <code className="text-[#FF8A1F]">v1.0.0</code>), o workflow em <code className="text-white">.github/workflows/release.yml</code> inicia os jobs isolados.
              </p>
            </div>

            <div className="p-6 bg-[#0C0A08] border border-white/[0.06] rounded-[24px] space-y-3">
              <div className="w-8 h-8 rounded-lg bg-[#FF8A1F]/15 text-[#FF8A1F] font-mono font-bold flex items-center justify-center text-sm">
                02
              </div>
              <h3 className="text-base font-bold text-white">2. Runners Limpos</h3>
              <p className="text-xs text-[#B7B2AC] leading-relaxed">
                O instalador Windows é compilado em máquina oficial <code className="text-white">windows-latest</code> via Tauri NSIS; o APK é compilado em <code className="text-white">ubuntu-latest</code> com Android SDK.
              </p>
            </div>

            <div className="p-6 bg-[#0C0A08] border border-white/[0.06] rounded-[24px] space-y-3">
              <div className="w-8 h-8 rounded-lg bg-[#FFB347]/15 text-[#FFF1E6] font-mono font-bold flex items-center justify-center text-sm">
                03
              </div>
              <h3 className="text-base font-bold text-white">3. Checksums Oficiais</h3>
              <p className="text-xs text-[#B7B2AC] leading-relaxed">
                O CI calcula o hash SHA-256 de cada arquivo gerado e anexa à GitHub Release junto com <code className="text-white">checksums.txt</code>.
              </p>
            </div>
          </div>

          {/* Code Signing Notice */}
          <div className="p-5 bg-[#12100E] border border-amber-500/20 rounded-2xl flex items-start gap-4">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <div className="font-bold text-white">Aviso sobre Assinatura de Código (Code Signing)</div>
              <p className="text-[#B7B2AC] leading-relaxed">
                Como projeto independente em versão inicial, o instalador Windows ainda não utiliza um certificado comercial pago (EV Certificate), o que pode fazer com que o Windows SmartScreen exiba um aviso de fornecedor desconhecido. Por isso, encorajamos que você sempre <strong>verifique o hash SHA-256</strong> fornecido abaixo antes de executar o instalador.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: VERIFICAÇÃO DE DOWNLOADS (SHA-256) */}
      <section id="verificacao" className="py-24 px-6 relative z-10">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="space-y-3 text-center">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#FF8A1F]">
              Integridade Matemática
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F8F7F5] tracking-tight">
              Verifique seu download.
            </h2>
            <p className="text-sm text-[#B7B2AC] max-w-xl mx-auto">
              Compare a assinatura digital SHA-256 do arquivo baixado com os valores oficiais publicados pelo nosso pipeline.
            </p>
          </div>

          {/* Hashes Cards */}
          <div className="space-y-4">
            {/* Windows EXE */}
            <div className="p-5 bg-[#0C0A08] border border-white/[0.06] rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">pumpkin-Setup-1.0.0.exe</span>
                  <span className="text-[10px] font-mono text-[#77716B] bg-white/[0.04] px-2 py-0.5 rounded">
                    Windows 64-bit
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(windowsSha256, 'win')}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-xs text-[#B7B2AC] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                  aria-label="Copiar SHA-256 do instalador Windows"
                >
                  {copiedHash === 'win' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar SHA-256</span>
                    </>
                  )}
                </button>
              </div>
              <div className="font-mono text-xs text-[#FF8A1F] bg-[#050505] p-3 rounded-xl border border-white/[0.04] break-all select-all">
                {windowsSha256}
              </div>
            </div>

            {/* Android APK */}
            <div className="p-5 bg-[#0C0A08] border border-white/[0.06] rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">pumpkin-1.0.0.apk</span>
                  <span className="text-[10px] font-mono text-[#77716B] bg-white/[0.04] px-2 py-0.5 rounded">
                    Android APK
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(androidSha256, 'apk')}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-xs text-[#B7B2AC] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                  aria-label="Copiar SHA-256 do APK Android"
                >
                  {copiedHash === 'apk' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar SHA-256</span>
                    </>
                  )}
                </button>
              </div>
              <div className="font-mono text-xs text-[#FF8A1F] bg-[#050505] p-3 rounded-xl border border-white/[0.04] break-all select-all">
                {androidSha256}
              </div>
            </div>
          </div>

          {/* How to verify in terminal */}
          <div className="p-6 bg-[#0C0A08] border border-white/[0.06] rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#FF7A00]" />
              <span>Como verificar no seu terminal</span>
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <div className="text-[#77716B] mb-1">No Windows (PowerShell):</div>
                <div className="bg-[#050505] p-2.5 rounded-lg border border-white/[0.04] text-[#FFF1E6] select-all">
                  Get-FileHash .\pumpkin-Setup-1.0.0.exe -Algorithm SHA256
                </div>
              </div>

              <div>
                <div className="text-[#77716B] mb-1">No Linux / macOS:</div>
                <div className="bg-[#050505] p-2.5 rounded-lg border border-white/[0.04] text-[#FFF1E6] select-all">
                  sha256sum pumpkin-Setup-1.0.0.exe
                </div>
              </div>
            </div>

            <div className="text-xs text-[#B7B2AC] pt-2 border-t border-white/[0.04] flex items-center justify-between">
              <span>Se o hash retornado bater exatamente com o valor acima, o arquivo é íntegro.</span>
              <a
                href="/releases/checksums.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FF8A1F] hover:underline flex items-center gap-1"
              >
                <span>Baixar checksums.txt</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: O QUE ACONTECE E O QUE NÃO ACONTECE */}
      <section className="py-24 px-6 bg-[#080808] border-t border-white/[0.04] relative z-10">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="space-y-3 text-center max-w-xl mx-auto">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#FF7A00]">
              Privacidade em Prática
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F8F7F5] tracking-tight">
              O que o pumpkin faz e não faz.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
            {/* O QUE FAZ */}
            <div className="p-6 bg-[#0C0A08] border border-white/[0.06] rounded-[24px] space-y-4">
              <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>O que acontece ao usar</span>
              </h3>
              <ul className="space-y-3 text-[#B7B2AC] leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Microfone:</strong> Capturado estritamente enquanto você estiver conectado a um canal de voz com o microfone desmutado.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Compartilhamento de Tela:</strong> Transmitido apenas após diálogo explícito do sistema operacional autorizando a captura.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Chat:</strong> Mensagens trafegam pelo servidor WebSocket apenas para entrega em tempo real aos participantes da sala.</span>
                </li>
              </ul>
            </div>

            {/* O QUE NÃO FAZ */}
            <div className="p-6 bg-[#0C0A08] border border-white/[0.06] rounded-[24px] space-y-4">
              <h3 className="text-base font-bold text-rose-400 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>O que o pumpkin NÃO faz</span>
              </h3>
              <ul className="space-y-3 text-[#B7B2AC] leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span><strong>Sem gravação em servidores:</strong> Nenhuma conversa de áudio ou vídeo é salva, transcrita ou retida em disco.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span><strong>Sem microfone oculto:</strong> O aplicativo nunca ativa gravação silenciosa em segundo plano.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span><strong>Sem telemetria invasiva:</strong> Não comercializamos dados de uso nem instalamos software de terceiros.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: AUDITE VOCÊ MESMO & DOCUMENTAÇÃO */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-[#F8F7F5] tracking-tight">
              Audite você mesmo.
            </h2>
            <p className="text-sm text-[#B7B2AC]">
              Toda a documentação técnica de compilação, segurança e contribuição está disponível publicamente:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            {project.buildingUrl ? (
              <a
                href={project.buildingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-[#0C0A08] hover:bg-[#12100E] border border-white/[0.06] hover:border-white/[0.14] rounded-xl flex items-center justify-between text-white transition-colors"
              >
                <span>BUILDING.md — Instruções de build</span>
                <ExternalLink className="w-4 h-4 text-[#FF8A1F]" />
              </a>
            ) : (
              <div className="p-4 bg-[#0C0A08] border border-white/[0.06] rounded-xl text-white">
                BUILDING.md — Instruções de build
              </div>
            )}

            {project.securityAdvisoriesUrl ? (
              <a
                href={project.securityAdvisoriesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-[#0C0A08] hover:bg-[#12100E] border border-white/[0.06] hover:border-white/[0.14] rounded-xl flex items-center justify-between text-white transition-colors"
              >
                <span>SECURITY.md — Política de Segurança</span>
                <ExternalLink className="w-4 h-4 text-[#FF8A1F]" />
              </a>
            ) : (
              <div className="p-4 bg-[#0C0A08] border border-white/[0.06] rounded-xl text-white">
                SECURITY.md — Política de Segurança
              </div>
            )}

            {project.contributingUrl ? (
              <a
                href={project.contributingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-[#0C0A08] hover:bg-[#12100E] border border-white/[0.06] hover:border-white/[0.14] rounded-xl flex items-center justify-between text-white transition-colors"
              >
                <span>CONTRIBUTING.md — Como Contribuir</span>
                <ExternalLink className="w-4 h-4 text-[#FF8A1F]" />
              </a>
            ) : (
              <div className="p-4 bg-[#0C0A08] border border-white/[0.06] rounded-xl text-white">
                CONTRIBUTING.md — Como Contribuir
              </div>
            )}

            {project.licenseUrl ? (
              <a
                href={project.licenseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-[#0C0A08] hover:bg-[#12100E] border border-white/[0.06] hover:border-white/[0.14] rounded-xl flex items-center justify-between text-white transition-colors"
              >
                <span>LICENSE — Licença MIT</span>
                <ExternalLink className="w-4 h-4 text-[#FF8A1F]" />
              </a>
            ) : (
              <div className="p-4 bg-[#0C0A08] border border-white/[0.06] rounded-xl text-white">
                LICENSE — Licença MIT
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.04] bg-[#050505] py-14 px-6 text-xs text-[#77716B]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <PumpkinLogo size="sm" showText={false} />
            <span className="font-mono font-bold text-white text-sm">pumpkin</span>
            <span>· Open Source &amp; Verificável</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/" className="hover:text-white transition-colors duration-200">
              Produto
            </Link>
            <Link to="/open-source" className="text-white transition-colors duration-200">
              Open Source
            </Link>
            <Link to="/download" className="hover:text-white transition-colors duration-200">
              Downloads
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
