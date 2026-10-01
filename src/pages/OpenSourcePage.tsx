import React from 'react';
import { ExternalLink, FileCheck, Github, ShieldCheck, Terminal } from 'lucide-react';
import { Link } from '../router';
import { project } from '../config/project';
import { PumpkinLogo } from '../components/common/PumpkinLogo';

export const OpenSourcePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-[#F8F7F5]">
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#080808]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-2.5">
            <PumpkinLogo size="md" />
          </Link>
          <nav className="flex items-center gap-4 text-xs font-semibold text-[#B7B2AC]">
            <Link to="/" className="hover:text-white">Produto</Link>
            <Link to="/download" className="hover:text-[#FF8A1F]">Downloads</Link>
            <Link to="/app" className="rounded-xl border border-white/[0.08] px-4 py-2 text-white hover:bg-white/[0.05]">
              Abrir Web App
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-20">
        <section className="text-center">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-[#FF7A00]/20 bg-[#FF7A00]/[0.08] px-3 py-1 text-xs text-[#FFB347]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Código público · licença {project.license}
          </div>
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
            Confiança começa com <span className="text-[#FF7A00]">transparência.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-[#B7B2AC]">
            O código do pumpkin pode ser auditado no GitHub. Os instaladores oficiais são publicados somente em GitHub Releases
            depois de validação de formato PE, arquitetura e SHA-256.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a
              href={project.repositoryUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6A00] to-[#FF8A1F] px-5 py-3 text-sm font-bold text-black"
            >
              <Github className="h-4 w-4" /> Ver código no GitHub
            </a>
            <a
              href={project.releasesUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-5 py-3 text-sm font-semibold"
            >
              <ExternalLink className="h-4 w-4" /> Ver Releases
            </a>
          </div>
        </section>

        <section className="mt-14 grid gap-5 md:grid-cols-2">
          <article className="rounded-[24px] border border-white/[0.07] bg-[#0C0A08] p-6">
            <FileCheck className="h-6 w-6 text-[#FF7A00]" />
            <h2 className="mt-4 text-lg font-bold">Downloads fail-closed</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#B7B2AC]">
              A página de downloads consulta a release oficial do GitHub. Se não existir um asset real
              <code className="mx-1 text-[#FFB347]">pumpkin-Setup-*-windows-x64.exe</code>,
              o botão permanece desabilitado. O frontend não distribui executáveis locais.
            </p>
          </article>

          <article className="rounded-[24px] border border-white/[0.07] bg-[#0C0A08] p-6">
            <Terminal className="h-6 w-6 text-[#FF8A1F]" />
            <h2 className="mt-4 text-lg font-bold">Validação reproduzível</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#B7B2AC]">
              O workflow valida assinatura <code className="text-[#FFB347]">MZ</code>, cabeçalho
              <code className="mx-1 text-[#FFB347]">PE\0\0</code>, arquitetura AMD64 do binário nativo,
              calcula SHA-256 e baixa novamente o asset publicado para comparar o hash.
            </p>
          </article>
        </section>

        <section className="mt-6 rounded-[24px] border border-white/[0.07] bg-[#0C0A08] p-6">
          <h2 className="text-lg font-bold">Como verificar no Windows</h2>
          <p className="mt-2 text-sm text-[#B7B2AC]">
            Depois de baixar uma release oficial, compare o SHA-256 com o arquivo
            <code className="mx-1 text-[#FFB347]">checksums.txt</code> anexado à mesma release.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-xl border border-white/[0.06] bg-black/30 p-4 text-xs text-[#FFF1E6]">
            {"Get-FileHash .\\pumpkin-Setup-1.0.2-windows-x64.exe -Algorithm SHA256"}
          </pre>
          <p className="mt-4 text-xs text-[#77716B]">
            Builds comunitários sem certificado de assinatura podem acionar o Microsoft SmartScreen. O status de assinatura deve
            ser tratado separadamente da integridade do arquivo.
          </p>
        </section>
      </main>
    </div>
  );
};
