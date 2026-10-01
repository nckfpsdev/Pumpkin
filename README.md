# pumpkin — Real-Time Voice, Chat & Screen Sharing

Plataforma de comunicação em tempo real multiplataforma (**Web**, **Windows Desktop** e **Android Mobile**) construída com foco em simplicidade, baixa latência e alta performance.

---

## 1. Visão Geral do Produto

O **pumpkin** oferece uma experiência sem atrito para comunicação de equipes e desenvolvedores:
- **Zero cadastro tradicional:** O usuário entra instantaneamente apenas escolhendo um apelido.
- **Canais de voz WebRTC:** Áudio cristalino em tempo real com codec Opus a 48 kHz e detecção ativa de voz (VAD) via Web Audio API.
- **Compartilhamento de tela 1080p 60 FPS:** Perfil-alvo de até **1920 × 1080 a 60 FPS** com `getDisplayMedia()`, adaptação dinâmica de bitrate e suporte a áudio do sistema/aba.
- **Chat em tempo real:** Mensagens instantâneas via WebSockets persistidas na sessão do servidor com proteção contra spam.
- **Ecossistema Multiplataforma:**
  - **Web:** Acesso direto pelo navegador (`/app`).
  - **Windows Desktop:** Aplicativo desktop oficial com instalador NSIS (`pumpkin-Setup-1.0.2-windows-x64.exe`), System Tray e atalhos de teclado.
  - **Android:** distribuição pública temporariamente desabilitada até o pipeline mobile gerar e validar pacotes reais.
  - **Site Oficial:** Landing page (`/`), Open Source (`/open-source`) e Central de Downloads (`/download`) com detecção automática de sistema operacional e verificação de hashes SHA-256.

---

## 2. Arquitetura Multiplataforma

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND COMPARTILHADO                          │
│               React 19 + TypeScript + Tailwind CSS 4                   │
├───────────────────┬───────────────────────────────┬────────────────────┤
│   WEB BROWSER     │        WINDOWS DESKTOP        │   ANDROID MOBILE   │
│   (Vite + SPA)    │       (Tauri 2 + NSIS)        │(Tauri 2 + WebView) │
└─────────┬─────────┴───────────────┬───────────────┴──────────┬─────────┘
          │                         │                          │
          └─────────────────────────┼──────────────────────────┘
                                    │
                                    ▼
                CAMADA DE ABSTRAÇÃO (services/platform/)
      ┌───────────────────────────────────────────────────────────┐
      │  • PlatformAdapter (Window, Minimize to Tray, Lifecycle)  │
      │  • ScreenCaptureAdapter (getDisplayMedia / MediaProjection│
      │  • NotificationAdapter (Web & Native Notifications)       │
      │  • DeviceAdapter (Battery, Orientation & Power Awareness) │
      └─────────────────────────────┬─────────────────────────────┘
                                    │
                                    ▼
             BACKEND REALTIME COMPARTILHADO (server.ts)
     ┌─────────────────────────────────────────────────────────────┐
     │ • Node.js + Express + 'ws' WebSocketServer (/ws)            │
     │ • Sincronização de Presenças, Sessões e Heartbeat           │
     │ • Relay de Sinalização WebRTC (SDP Offer/Answer & ICE)      │
     │ • Endpoints REST (/api/health, /api/version, /api/releases) │
     │ • Allowlist CORS para Origens Web e Nativas (tauri://*)     │
     └─────────────────────────────────────────────────────────────┘
```

---

## 3. Rotas da Aplicação Web

- `/` — **Landing Page Oficial:** Apresentação tecnológica, hero interativo com preview em 3D, seção "Como funciona", recursos e destaques de 1080p60.
- `/open-source` — **Página Open Source & Transparência:** Métricas ao vivo do GitHub, mapa de componentes abertos, guia de reprodução e hashes SHA-256.
- `/app` — **Aplicação pumpkin:** Interface completa com canais de texto, voz, lista de membros, chat e compartilhamento de tela.
- `/download` — **Central de Downloads:** Cards para Windows (.exe), Android (.apk / .aab) e Web, com detecção automática da plataforma do visitante e verificação de hashes SHA-256.
- `/privacy` — **Política de Privacidade:** Compromisso com transparência de permissões e não gravação de áudio/tela.
- `/terms` — **Termos de Uso:** Diretrizes de uso da plataforma.

---

## 4. Como Executar

### 4.1. Web & Backend (Desenvolvimento)
```bash
# 1. Instalar dependências
bun install

# 2. Iniciar servidor full-stack (Express + Vite + WebSocket)
bun run dev

# 3. Acessar
http://localhost:3000/         # Landing Page
http://localhost:3000/app      # Aplicação Web
http://localhost:3000/download # Central de Downloads
```

### 4.2. Windows Desktop (Desenvolvimento & Build)
Requisitos: Rust e Cargo instalados.
```bash
# Iniciar modo de desenvolvimento Desktop:
bun run desktop:dev

# Compilar instalador Windows (.exe NSIS):
bun run desktop:build
# O executável instalável é gerado em:
# src-tauri/target/release/bundle/nsis/pumpkin-Setup-1.0.2-windows-x64.exe
```

### 4.3. Android (Desenvolvimento & Build)
Requisitos: Android SDK (API 34) e Java 17 (JDK) configurados.
```bash
# Inicializar ambiente Android no Tauri:
npm run android:init

# Iniciar no emulador/dispositivo USB:
npm run android:dev

# Gerar APK de distribuição direta:
npm run android:build:apk
# Gerado em:
# src-tauri/gen/android/app/build/outputs/apk/release/app-release-unsigned.apk

# Gerar AAB para Google Play:
npm run android:build:aab
# Gerado em:
# src-tauri/gen/android/app/build/outputs/bundle/release/app-release.aab
```

---

## 5. Configuração de Endpoints & Variáveis de Ambiente

Crie um arquivo `.env` para customizar as conexões dos clientes nativos:

```env
# URL base da API REST
VITE_API_BASE_URL="https://sua-url-de-producao.run.app"

# URL do servidor WebSocket de sinalização e chat
VITE_WS_URL="wss://sua-url-de-producao.run.app/ws"

# Configuração opcional de servidor TURN para redes corporativas restritivas
TURN_URL="turn:seu-turn.com:3478"
TURN_USERNAME="seu-usuario"
TURN_CREDENTIAL="sua-senha-turn"
```

*Nota: Em navegadores web, caso as variáveis não sejam definidas, o cliente se conecta automaticamente à mesma origem (`window.location.origin` e `wss://<host>/ws`).*

---

## 6. Manifesto de Releases & Checksums

O manifesto oficial de downloads é mantido em `public/releases/latest.json` e servido na rota `/releases/latest.json`.
Os checksums SHA-256 estão disponíveis em `public/releases/checksums.txt`:

```text
60e5f076f9c098a0e357293f4fa3fd52f1c7588cc5ba926fed5c3f69b9d37edf  pumpkin-Setup-1.0.2-windows-x64.exe
560ab671dd8614cdc4913eaacbf0819abb17f4a92a15b2e2b2b6e7346fd71295  pumpkin-1.0.0.apk
```

Consulte `RELEASING.md` para o passo a passo completo de assinatura de código (Code Signing) e automação de releases no GitHub Actions.
