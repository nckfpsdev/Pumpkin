import React, { useEffect, useMemo, useState } from 'react';
import { Download, ExternalLink, Globe, Laptop, LoaderCircle, ShieldCheck, Smartphone } from 'lucide-react';
import { Link } from '../router';
import { platform } from '../services/platform';
import { project } from '../config/project';
import { PumpkinLogo } from '../components/common/PumpkinLogo';

interface ReleaseAsset {
  id: number;
  name: string;
  size: number;
  digest?: string | null;
  browser_download_url: string;
  content_type?: string | null;
}

interface GitHubRelease {
  tag_name: string;
  html_url: string;
  published_at?: string | null;
  assets: ReleaseAsset[];
}

const repoApi = 'https://api.github.com/repos/nckfpsdev/Pumpkin/releases/latest';
const windowsAssetPattern = /^pumpkin-Setup-(.+)-windows-x64\.exe$/i;

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '—';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const DownloadPage: React.FC = () => {
  const [release, setRelease] = useState<GitHubRelease | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetch(repoApi, {
          headers: { Accept: 'application/vnd.github+json' },
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(response.status === 404 ? 'Nenhuma release oficial publicada ainda.' : `GitHub respondeu ${response.status}.`);
        }

        const data = (await response.json()) as GitHubRelease;
        if (!cancelled) {
          setRelease(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setRelease(null);
          setError(err instanceof Error ? err.message : 'Não foi possível consultar a release oficial.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const windowsAsset = useMemo(
    () => release?.assets.find((asset) => windowsAssetPattern.test(asset.name)) ?? null,
    [release]
  );

  const version = useMemo(() => {
    if (windowsAsset) {
      return windowsAsset.name.match(windowsAssetPattern)?.[1] ?? release?.tag_name.replace(/^v/, '') ?? project.currentVersion;
    }
    return release?.tag_name.replace(/^v/, '') ?? project.currentVersion;
  }, [release, windowsAsset]);

  const digest = windowsAsset?.digest?.replace(/^sha256:/i, '') ?? null;
  const downloadReady = Boolean(windowsAsset?.browser_download_url);

  return (
    <div className="min-h-screen bg-[#050505] text-[#F8F7F5]">
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#080808]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-2.5">
            <PumpkinLogo size="md" />
          </Link>
          <nav className="flex items-center gap-4 text-xs font-semibold text-[#B7B2AC]">
            <Link to="/" className="hover:text-white">Produto</Link>
            <Link to="/open-source" className="hover:text-[#FF8A1F]">Open Source</Link>
            <Link to="/app" className="rounded-xl border border-white/[0.08] px-4 py-2 text-white hover:bg-white/[0.05]">
              Abrir Web App
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-16">
        <section className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#FF7A00]/20 bg-[#FF7A00]/[0.08] px-3 py-1 text-xs text-[#FFB347]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Downloads oficiais via GitHub Releases
          </div>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Baixe o pumpkin</h1>
          <p className="mt-4 text-[#B7B2AC]">
            O botão Windows só é habilitado quando um asset real existe na release oficial do GitHub.
          </p>
        </section>

        <section className="mt-12 grid gap-6 md:grid-cols-3">
          <article className={`rounded-[26px] border bg-[#0C0A08] p-6 ${platform.isWindows ? 'border-[#FF7A00]/60 shadow-2xl shadow-[#FF7A00]/10' : 'border-white/[0.07]'}`}>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#FF7A00]/25 bg-[#FF7A00]/10 text-[#FF7A00]">
              <Laptop className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-xl font-bold">Windows x64</h2>
            <p className="mt-1 text-xs font-mono text-[#77716B]">
              {windowsAsset?.name ?? 'Aguardando release oficial'}
            </p>

            <dl className="mt-5 space-y-2 border-t border-white/[0.06] pt-4 text-xs">
              <div className="flex justify-between gap-4"><dt className="text-[#77716B]">Versão</dt><dd>{version}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-[#77716B]">Target</dt><dd className="font-mono">x86_64-pc-windows-msvc</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-[#77716B]">Tamanho</dt><dd>{windowsAsset ? formatBytes(windowsAsset.size) : '—'}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-[#77716B]">Assinatura</dt><dd>Unsigned (Community)</dd></div>
            </dl>

            {digest && (
              <div className="mt-4 rounded-xl border border-white/[0.05] bg-black/30 p-3">
                <div className="text-[10px] uppercase tracking-wider text-[#77716B]">SHA-256 publicado pelo GitHub</div>
                <div className="mt-1 break-all font-mono text-[10px] text-[#B7B2AC]">{digest}</div>
              </div>
            )}

            <div className="mt-6">
              {loading ? (
                <button disabled className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] py-3 text-sm text-[#B7B2AC]">
                  <LoaderCircle className="h-4 w-4 animate-spin" /> Verificando release…
                </button>
              ) : downloadReady && windowsAsset ? (
                <a
                  href={windowsAsset.browser_download_url}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6A00] to-[#FF8A1F] py-3 font-bold text-black hover:brightness-110"
                >
                  <Download className="h-4 w-4" />
                  Baixar .EXE x64
                </a>
              ) : (
                <button disabled className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-3 text-sm font-semibold text-[#77716B]">
                  Download temporariamente indisponível
                </button>
              )}
            </div>

            {error && <p className="mt-3 text-xs text-amber-300">{error}</p>}
          </article>

          <article className="rounded-[26px] border border-white/[0.07] bg-[#0C0A08] p-6 opacity-80">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#FF8A1F]/20 bg-[#FF8A1F]/10 text-[#FF8A1F]">
              <Smartphone className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-xl font-bold">Android</h2>
            <p className="mt-2 text-sm text-[#B7B2AC]">Build Android está temporariamente desabilitado até o pipeline mobile ser validado com assinatura e pacote real.</p>
            <button disabled className="mt-6 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-3 text-sm font-semibold text-[#77716B]">
              Em preparação
            </button>
          </article>

          <article className="rounded-[26px] border border-white/[0.07] bg-[#0C0A08] p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#FFB347]/20 bg-[#FFB347]/10 text-[#FFB347]">
              <Globe className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-xl font-bold">Web</h2>
            <p className="mt-2 text-sm text-[#B7B2AC]">Use o pumpkin diretamente no navegador, sem instalação.</p>
            <Link to="/app" className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.05] py-3 text-sm font-bold hover:bg-white/[0.08]">
              Abrir Web App <ExternalLink className="h-4 w-4" />
            </Link>
          </article>
        </section>

        <section className="mt-8 rounded-[24px] border border-white/[0.06] bg-[#0C0A08] p-6 text-sm text-[#B7B2AC]">
          <h3 className="font-bold text-white">Integridade e confiança</h3>
          <p className="mt-2">
            O instalador não é servido pelo frontend do Pumpkin. Ele vem diretamente de um asset publicado em GitHub Releases.
            Se nenhuma release válida existir, o botão permanece desabilitado.
          </p>
          {release?.html_url && (
            <a href={release.html_url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-[#FF8A1F] hover:underline">
              Ver release oficial no GitHub <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </section>
      </main>
    </div>
  );
};
