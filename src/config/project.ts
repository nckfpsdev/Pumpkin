/**
 * pumpkin - Central Project & Open Source Configuration
 * All public links, versioning, licenses, and repository URLs are centralized here.
 */

const RAW_REPO_URL = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_REPOSITORY_URL || 'https://github.com/nckfpsdev/pumpkin';

export interface ProjectConfig {
  name: string;
  currentVersion: string;
  releasedAt: string;
  license: string;
  licenseName: string;
  githubProfileUrl: string;
  githubOwner: string;
  repositoryName: string;
  repositoryUrl?: string;
  releasesUrl?: string;
  issuesUrl?: string;
  securityAdvisoriesUrl?: string;
  contributingUrl?: string;
  buildingUrl?: string;
  changelogUrl?: string;
  licenseUrl?: string;
  isRepoConfigured: boolean;
  components: Array<{
    name: string;
    path: string;
    description: string;
    status: 'Open Source' | 'Public';
    license: string;
  }>;
}

const isConfigured = Boolean(RAW_REPO_URL && RAW_REPO_URL.trim() !== '');
const baseRepo = isConfigured ? RAW_REPO_URL.replace(/\/+$/, '') : undefined;

export const project: ProjectConfig = {
  name: 'pumpkin',
  currentVersion: '1.0.0',
  releasedAt: '2026-09-29',
  license: 'MIT',
  licenseName: 'Licença MIT Permissiva',
  githubProfileUrl: 'https://github.com/nckfpsdev',
  githubOwner: 'nckfpsdev',
  repositoryName: 'pumpkin',
  repositoryUrl: baseRepo,
  releasesUrl: baseRepo ? `${baseRepo}/releases` : undefined,
  issuesUrl: baseRepo ? `${baseRepo}/issues` : undefined,
  securityAdvisoriesUrl: baseRepo ? `${baseRepo}/security/advisories` : undefined,
  contributingUrl: baseRepo ? `${baseRepo}/blob/main/CONTRIBUTING.md` : undefined,
  buildingUrl: baseRepo ? `${baseRepo}/blob/main/BUILDING.md` : undefined,
  changelogUrl: baseRepo ? `${baseRepo}/blob/main/CHANGELOG.md` : undefined,
  licenseUrl: baseRepo ? `${baseRepo}/blob/main/LICENSE` : undefined,
  isRepoConfigured: isConfigured,

  // Real, verified open components existing in this codebase
  components: [
    {
      name: 'Frontend Web & UI',
      path: 'src/',
      description: 'Interface em React 19, componentes visuais, Web Audio API (VAD) e roteador SPA.',
      status: 'Open Source',
      license: 'MIT',
    },
    {
      name: 'Cliente Desktop Windows',
      path: 'src-tauri/',
      description: 'Aplicação nativa empacotada com Tauri 2 em Rust, menu da bandeja do sistema e instalador NSIS.',
      status: 'Open Source',
      license: 'MIT',
    },
    {
      name: 'Cliente Android Mobile',
      path: 'src-tauri/gen/android/',
      description: 'Módulo Android com suporte a MediaProjection e Foreground Service para áudio em segundo plano.',
      status: 'Open Source',
      license: 'MIT',
    },
    {
      name: 'Servidor Realtime & Sinalização',
      path: 'server.ts',
      description: 'Servidor full-stack Node.js com Express e WebSocketServer para relay de mensagens e sinais WebRTC.',
      status: 'Open Source',
      license: 'MIT',
    },
    {
      name: 'Camada de Mídia & WebRTC',
      path: 'src/services/media/',
      description: 'Implementação WebRTC Peer-to-Peer com padrão Polite Peer, controle de bitrate e codecs Opus/VP9.',
      status: 'Open Source',
      license: 'MIT',
    },
    {
      name: 'Automação de CI/CD & Builds',
      path: '.github/workflows/release.yml',
      description: 'Workflows do GitHub Actions para compilação automatizada de binários Windows (.exe) e Android (.apk).',
      status: 'Open Source',
      license: 'MIT',
    },
  ],
};
