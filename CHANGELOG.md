# Changelog

Todas as alterações notáveis deste projeto serão documentadas neste arquivo.
O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/), e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

---

## [1.0.2] — 2026-09-30

### Fixed
- Removidos os arquivos EXE/APK placeholder que não eram builds distribuíveis reais.
- Corrigido o pipeline Windows para gerar Tauri + NSIS em `x86_64-pc-windows-msvc`.
- Adicionada validação de `MZ`, `PE\\0\\0`, arquitetura e SHA-256.
- A página de downloads agora usa somente assets reais de GitHub Releases.
- O release faz download de ida e volta do asset publicado e compara o SHA-256.
- Removido o fallback nativo para endpoint `ais-dev` do Google AI Studio.
- Releases nativas agora exigem backend público HTTPS/WSS configurado.
- Distribuição Android temporariamente desabilitada até haver build mobile real validado.

### Security
- O servidor deixou de aceitar qualquer origem `.run.app`; apenas origens explicitamente permitidas são aceitas.
- Downloads passam a falhar de forma segura quando não existe um asset oficial.

---

## [1.0.0] — 2026-09-29

### Added
- **Canais de Voz WebRTC:** Comunicação peer-to-peer em tempo real utilizando codec Opus a 48 kHz.
- **Detecção Ativa de Voz (VAD):** Medição de volume RMS via Web Audio API com indicador visual de fala (anel luminoso em torno do avatar).
- **Compartilhamento de Tela 1080p a 60 FPS:** Captura de tela com perfil de alta definição, `contentHint: "detail"`, controle de bitrate e captura de áudio do sistema/aba.
- **Chat em Tempo Real:** Envio e recebimento instantâneo de mensagens de texto via WebSockets com persistência na sessão do servidor.
- **Autenticação Instantânea por Apelido:** Entrada no servidor sem necessidade de cadastro, senhas ou e-mail.
- **Cliente Windows Desktop Nativo:** Empacotamento Tauri 2 com instalador oficial NSIS 64-bit (`pumpkin-Setup-1.0.0.exe`) e integração com System Tray.
- **Cliente Android Mobile:** Suporte nativo via Tauri 2 com permissões para `MediaProjection` e `ForegroundService` para chamadas de voz contínuas em segundo plano.
- **Pipeline de CI/CD:** GitHub Actions configurado para compilação automática multiplataforma e publicação de releases.
- **Área Open Source & Auditabilidade:** Página `/open-source` com integração ao vivo à API do GitHub, manifesto de releases `latest.json` e hashes SHA-256 verificáveis.
- **Documentação de Transparência:** `BUILDING.md`, `SECURITY.md`, `CONTRIBUTING.md`, `RELEASING.md`.

### Changed
- Rebranding completo do projeto de nckdev para **pumpkin**, com identidade visual exclusiva baseada em Galaxy Black e Pumpkin Orange (`#FF7A00`).
- Refatoração da camada de plataforma com interface unificada `PlatformAdapter` e implementações isoladas para Web, Desktop e Android.
- Redesign completo da Landing Page com estética Galaxy Black e visual 3D em perspectiva.

### Security
- Estabelecida política formal de segurança em `SECURITY.md`.
- Adicionado cálculo e publicação de hashes criptográficos SHA-256 para todos os binários distribuídos.
- Configurada allowlist estrita de CORS no servidor Express para proteção contra conexões não autorizadas.
