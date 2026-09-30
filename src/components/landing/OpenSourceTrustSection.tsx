import React from 'react';
import { Link } from '../../router';
import { project } from '../../config/project';
import {
  FolderGit2,
  FileCheck,
  Github,
  ArrowRight,
  ShieldCheck,
  Scale,
} from 'lucide-react';

export const OpenSourceTrustSection: React.FC = () => {
  return (
    <section className="py-28 px-6 bg-[#080808] border-t border-white/[0.04] relative z-10">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#FF7A00]">
              <FolderGit2 className="w-4 h-4" />
              <span>Transparência e Auditabilidade</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F8F7F5] tracking-tight leading-[1.12]">
              Código aberto. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6A00] via-[#FF8A1F] to-[#FFB347]">
                Confiança verificável.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-[#B7B2AC] font-normal leading-relaxed">
              O pumpkin é construído com transparência. Você pode inspecionar o código-fonte, auditar as conexões de rede e validar a integridade exata dos instaladores antes de colocar o aplicativo em execução.
            </p>
          </div>

          {/* Action links */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/open-source"
              className="px-6 py-3.5 bg-gradient-to-r from-[#FF6A00] to-[#FF8A1F] hover:brightness-110 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-[#FF7A00]/25 flex items-center gap-2 transition-all active:scale-95"
            >
              <span>Explorar Open Source</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {project.repositoryUrl && (
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 bg-[#0C0A08] hover:bg-[#12100E] text-[#F8F7F5] border border-white/[0.08] hover:border-white/[0.18] font-semibold text-xs sm:text-sm rounded-xl flex items-center gap-2 transition-all"
              >
                <Github className="w-4 h-4" />
                <span>Ver código-fonte</span>
              </a>
            )}

            <Link
              to="/download"
              className="px-4 py-3.5 text-xs text-[#B7B2AC] hover:text-[#FF8A1F] transition-colors flex items-center gap-1 font-mono"
            >
              <span>Ver releases</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 3 AUDITABLE PILLARS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-7 bg-[#0C0A08] border border-white/[0.06] rounded-[26px] space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#FF7A00]/15 border border-[#FF7A00]/30 text-[#FF8A1F] flex items-center justify-center">
              <Scale className="w-5 h-5 stroke-[2]" />
            </div>
            <h3 className="text-xl font-bold text-[#F8F7F5]">Licença MIT Permissiva</h3>
            <p className="text-sm text-[#B7B2AC] leading-relaxed">
              O projeto possui licença aberta livre para inspeção, bifurcação e contribuição, garantindo que o software permaneça auditável.
            </p>
          </div>

          <div className="p-7 bg-[#0C0A08] border border-white/[0.06] rounded-[26px] space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#FF8A1F]/15 border border-[#FF8A1F]/30 text-[#FFB347] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 stroke-[2]" />
            </div>
            <h3 className="text-xl font-bold text-[#F8F7F5]">CI &amp; Builds Automatizados</h3>
            <p className="text-sm text-[#B7B2AC] leading-relaxed">
              Executáveis e APKs são construídos através de runners limpos e isolados do GitHub Actions acionados por tags oficiais de release.
            </p>
          </div>

          <div className="p-7 bg-[#0C0A08] border border-white/[0.06] rounded-[26px] space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#FFB347]/15 border border-[#FFB347]/30 text-[#FFF1E6] flex items-center justify-center">
              <FileCheck className="w-5 h-5 stroke-[2]" />
            </div>
            <h3 className="text-xl font-bold text-[#F8F7F5]">Checksums SHA-256 Oficiais</h3>
            <p className="text-sm text-[#B7B2AC] leading-relaxed">
              Cada arquivo possui uma assinatura criptográfica pública, permitindo conferir no seu próprio terminal que o instalador não foi adulterado.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
