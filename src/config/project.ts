/**
 * pumpkin - Central Project & Open Source Configuration
 */

const RAW_REPO_URL =
  (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_REPOSITORY_URL ||
  'https://github.com/nckfpsdev/Pumpkin';

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
  currentVersion: '1.0.2',
  releasedAt: '2026-09-30',
  license: 'MIT',
  licenseName: 'Licença MIT Permissiva',
  githubProfileUrl: 'https://github.com/nckfpsdev',
  githubOwner: 'nckfpsdev',
  repositoryName: 'Pumpkin',
  repositoryUrl: baseRepo,
  releasesUrl: baseRepo ? `${baseRepo}/releases` : undefined,
  issuesUrl: baseRepo ? `${baseRepo}/issues` : undefined,
  securityAdvisoriesUrl: baseRepo ? `${baseRepo}/security/advisories` : undefined,
  contributingUrl: baseRepo ? `${baseRepo}/blob/main/CONTRIBUTING.md` : undefined,
  buildingUrl: baseRepo ? `${baseRepo}/blob/main/BUILDING.md` : undefined,
  changelogUrl: baseRepo ? `${baseRepo}/blob/main/CHANGELOG.md` : undefined,
  licenseUrl: baseRepo ? `${baseRepo}/blob/main/LICENSE` : undefined,
  isRepoConfigured: isConfigured,
  components: [
    {
      name: 'Frontend Web & UI',
      path: 'src/',
      description: 'Interface React/TypeScript compartilhada entre Web e Tauri.',
      status: 'Open Source',
      license: 'MIT',
    },
    {
      name: 'Cliente Desktop Windows',
      path: 'src-tauri/',
      description: 'Cliente Tauri 2 com empacotamento NSIS para Windows.',
      status: 'Open Source',
      license: 'MIT',
    },
    {
      name: 'Servidor Realtime & Sinalização',
      path: 'server.ts',
      description: 'Servidor Node.js com Express e WebSocket para chat, presença e sinalização WebRTC.',
      status: 'Open Source',
      license: 'MIT',
    },
    {
      name: 'Camada de Mídia & WebRTC',
      path: 'src/services/media/',
      description: 'WebRTC peer-to-peer para voz e compartilhamento de tela.',
      status: 'Open Source',
      license: 'MIT',
    },
    {
      name: 'Automação de Release',
      path: '.github/workflows/release.yml',
      description: 'Build e publicação verificada do instalador Windows em GitHub Releases.',
      status: 'Open Source',
      license: 'MIT',
    },
  ],
};
