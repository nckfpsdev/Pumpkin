import React from 'react';
import { Link } from '../../router';
import { project } from '../../config/project';
import { ShieldCheck, FileCheck, AlertCircle, Github } from 'lucide-react';

export const DownloadTrustPanel: React.FC = () => {
  return (
    <div className="p-6 bg-[#0C0A08] border border-white/[0.08] rounded-2xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#FF7A00]" />
          <span className="font-bold text-white text-sm">Transparência &amp; Proveniência do Download</span>
        </div>
        <div className="text-xs text-[#B7B2AC] font-mono">
          Versão {project.currentVersion} · Licença {project.license}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
        <div className="p-3 bg-[#080808] rounded-xl border border-white/[0.04]">
          <div className="text-[#77716B] text-[10px] uppercase font-bold">Origem</div>
          <div className="text-white font-semibold flex items-center gap-1.5 mt-0.5">
            <Github className="w-3.5 h-3.5" />
            <span>GitHub Actions CI</span>
          </div>
          <div className="text-[11px] text-[#B7B2AC]">Runner limpo e isolado</div>
        </div>

        <div className="p-3 bg-[#080808] rounded-xl border border-white/[0.04]">
          <div className="text-[#77716B] text-[10px] uppercase font-bold">Assinatura Digital</div>
          <div className="text-amber-400 font-semibold mt-0.5">
            NSIS Comunitário
          </div>
          <div className="text-[11px] text-[#B7B2AC]">SmartScreen pode alertar</div>
        </div>

        <div className="p-3 bg-[#080808] rounded-xl border border-white/[0.04]">
          <div className="text-[#77716B] text-[10px] uppercase font-bold">Verificação</div>
          <div className="text-emerald-400 font-semibold mt-0.5">
            SHA-256 Disponível
          </div>
          <div className="text-[11px] text-[#B7B2AC]">Compare no terminal</div>
        </div>
      </div>

      {/* SmartScreen honest transparency alert */}
      <div className="p-3.5 bg-[#181410] border border-amber-500/20 rounded-xl flex items-start gap-3 text-xs text-[#B7B2AC]">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Aviso sobre o Windows SmartScreen:</strong> Como projeto open source sem certificado pago corporativo, o Windows pode exibir uma tela de aviso ao executar o instalador. Você pode verificar o código no GitHub e conferir o SHA-256 no PowerShell antes de autorizar a execução.
        </p>
      </div>

      {/* Prefer checking first banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
        <span className="text-[#77716B]">Prefere verificar antes de instalar?</span>
        <div className="flex items-center gap-4 text-[#B7B2AC]">
          <Link to="/open-source" className="text-[#FF8A1F] hover:underline flex items-center gap-1">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Ver código e auditoria</span>
          </Link>
          <a
            href="/releases/checksums.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            checksums.txt
          </a>
        </div>
      </div>
    </div>
  );
};
