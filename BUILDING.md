# pumpkin — Guia de Compilação & Builds Verificáveis

Este documento descreve detalhadamente como reproduzir e compilar o código-fonte do **pumpkin** a partir deste repositório para a Web, Windows Desktop (.exe com NSIS) e Android (.apk e .aab).

---

## 1. Requisitos de Ambiente

| Componente | Versão Mínima Recomendada | Finalidade |
| :--- | :--- | :--- |
| **Node.js** | `>= 22.0.0` (LTS) | Runtime do frontend e servidor |
| **Package Manager** | `npm` `>= 10.0.0` | Instalação e gestão de dependências |
| **Rust & Cargo** | `1.75.0` (stable) | Compilação do cliente nativo desktop (Tauri 2) |
| **Tauri CLI** | `^2.0.0` | Empacotamento de binários nativos |
| **Java JDK** | `17` (Eclipse Temurin / OpenJDK) | Compilação do módulo Android |
| **Android SDK** | `API 34` (Android 14) / NDK r25+ | Compilação das bibliotecas e APK Android |

---

## 2. Variáveis de Ambiente

Crie um arquivo `.env` a partir do modelo `.env.example`:

```bash
cp .env.example .env
```

Variáveis suportadas:
- `PORT` (opcional): Porta local do servidor (padrão: `3000`).
- `VITE_API_BASE_URL` (opcional): URL de produção da API REST para clientes nativos (em navegadores, padrão é `window.location.origin`).
- `VITE_WS_URL` (opcional): Endpoint do WebSocket (padrão em navegadores: `wss://<host>/ws`).
- `TURN_URL`, `TURN_USERNAME`, `TURN_CREDENTIAL` (opcional): Servidor TURN para atravessar firewalls corporativos restritivos.

*Nota de Segurança: NUNCA insira keystores, chaves privadas ou certificados de assinatura no repositório de código.*

---

## 3. Compilação do Frontend Web & Backend

```bash
# 1. Instalar dependências exatas
npm ci

# 2. Validar tipagem TypeScript
npm run lint

# 3. Gerar build de produção do frontend Vite
npm run build
# Os arquivos estáticos otimizados são gerados no diretório dist/

# 4. Executar em modo desenvolvimento
npm run dev
```

---

## 4. Compilação do Cliente Desktop Windows (.EXE)

Requer ambiente Windows (ou cross-compilação configurada) com Rust e NSIS instalados:

```bash
# 1. Instalar o Tauri CLI se necessário
cargo install tauri-cli --version "^2.0.0"

# 2. Executar em modo de desenvolvimento desktop
npm run desktop:dev

# 3. Gerar instalador oficial Windows (NSIS 64-bit)
npm run desktop:build
# O instalador oficial é gerado em:
# src-tauri/target/release/bundle/nsis/pumpkin-Setup-1.0.0.exe
```

---

## 5. Compilação do Cliente Android (.APK e .AAB)

Requer Android SDK (API 34), NDK e Java 17 configurados nas variáveis `ANDROID_HOME` e `JAVA_HOME`:

```bash
# 1. Adicionar targets do Rust para Android
rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android

# 2. Gerar APK para distribuição direta
npm run android:build:apk
# O pacote APK é gerado em:
# src-tauri/gen/android/app/build/outputs/apk/release/app-release-unsigned.apk

# 3. Gerar Android App Bundle (AAB) para a Google Play Store
npm run android:build:aab
# O bundle AAB é gerado em:
# src-tauri/gen/android/app/build/outputs/bundle/release/app-release.aab
```

---

## 6. Geração de Checksums e Verificação

Após a conclusão dos builds dos artefatos:

```bash
# No Linux / macOS:
sha256sum pumpkin-Setup-1.0.0.exe pumpkin-1.0.0.apk > checksums.txt

# No Windows (PowerShell):
Get-FileHash .\pumpkin-Setup-1.0.0.exe -Algorithm SHA256
```

Compare os hashes obtidos com o arquivo oficial de checksums do projeto para verificar a integridade da compilação.
