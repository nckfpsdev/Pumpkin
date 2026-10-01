# pumpkin — Guia de Release & Publicação Multiplataforma

Este documento descreve o procedimento de lançamento de novas versões do **pumpkin** para Web, Windows (.exe) e Android (.apk / .aab).

---

## 1. Versionamento

O pumpkin segue [Semantic Versioning](https://semver.org/) (`MAJOR.MINOR.PATCH`).
A versão oficial é centralizada em:
- `package.json` (`"version": "1.0.2"`)
- `src-tauri/tauri.conf.json` (`"version": "1.0.2"`)
- `src-tauri/Cargo.toml` (`version = "1.0.2"`)
- `public/releases/latest.json`

---

## 2. Passo a Passo de Release

### Passo 1: Validação e Testes
```bash
# 1. Typecheck e lint
npm run lint

# 2. Build de produção do frontend
npm run build
```

### Passo 2: Geração do Instalador Windows (.exe)
Localmente em ambiente Windows ou via GitHub Actions runner `windows-latest`:
```bash
# Gera o instalador profissional com NSIS:
cargo tauri build --target x86_64-pc-windows-msvc --bundles nsis
# Saída gerada em:
# src-tauri/target/x86_64-pc-windows-msvc/release/bundle/nsis/pumpkin-Setup-1.0.2.exe
```

### Passo 3: Geração do Android (.apk e .aab)
Localmente com Android SDK instalado ou via GitHub Actions runner `ubuntu-latest`:
```bash
# Gera APK para distribuição direta:
cargo tauri android build --apk
# Saída gerada em:
# src-tauri/gen/android/app/build/outputs/apk/release/app-release-unsigned.apk

# Gera AAB para a Google Play Store:
cargo tauri android build --aab
# Saída gerada em:
# src-tauri/gen/android/app/build/outputs/bundle/release/app-release.aab
```

### Passo 4: Assinatura de Código (Code Signing)

#### Windows:
Assine o instalador com certificado EV ou Standard via `signtool`:
```powershell
signtool sign /tr http://timestamp.digicert.com /td sha256 /fd sha256 /a "src-tauri/target/x86_64-pc-windows-msvc/release/bundle/nsis/pumpkin-Setup-1.0.2.exe"
```

#### Android:
Assine o APK e AAB com `apksigner` e a keystore oficial:
```bash
apksigner sign --ks release.keystore --ks-key-alias pumpkin --out pumpkin-1.0.2.apk app-release-unsigned.apk
```
*Atenção: NUNCA faça commit da keystore nem de senhas no repositório. Utilize variáveis de ambiente `KEYSTORE_PATH`, `KEYSTORE_PASSWORD`, `KEY_ALIAS`, `KEY_PASSWORD` nos secrets do GitHub.*

### Passo 5: Geração de Checksums SHA-256
```bash
sha256sum pumpkin-Setup-1.0.2.exe pumpkin-1.0.2.apk > checksums.txt
```

### Passo 6: Publicação verificada
O workflow publica o instalador diretamente em GitHub Releases e faz um download de ida e volta para comparar o SHA-256. Não publique binários em `public/releases/`.

### Passo 7: Disparo Automático via Git Tag
O workflow do GitHub Actions `.github/workflows/release.yml` compila e anexa automaticamente todos os binários à release:
```bash
git tag v1.0.2
git push origin v1.0.2
```
