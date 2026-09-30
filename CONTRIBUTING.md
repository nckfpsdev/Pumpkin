# Guia de Contribuição — pumpkin

Agradecemos o seu interesse em contribuir com o **pumpkin**! Este projeto é construído de forma transparente e acolhe contribuições de desenvolvedores de todo o mundo.

---

## 1. Primeiros Passos

1. **Faça um Fork** do repositório oficial no GitHub.
2. **Clone** o seu fork localmente:
   ```bash
   git clone https://github.com/SEU_USUARIO/pumpkin.git
   cd pumpkin
   ```
3. **Instale as dependências:**
   ```bash
   npm install
   ```
4. **Execute localmente em modo desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse `http://localhost:3000` no seu navegador.

---

## 2. Como Propor Melhorias ou Relatar Problemas

- **Para bugs ou problemas técnicos:** Abra uma **Issue** detalhando o comportamento esperado vs. o comportamento observado, o sistema operacional, navegador e console logs.
- **Para sugestões de novas funcionalidades:** Abra uma Issue com a tag `enhancement`, descrevendo o caso de uso e a motivação técnica.
- **Para relatórios de segurança:** Consulte `SECURITY.md` para o canal confidencial de reporte responsável.

---

## 3. Padrões de Código & Verificação Obrigatória

Antes de enviar qualquer alteração, certifique-se de validar o projeto com os linters e verificadores de tipagem:

```bash
# 1. Verificação de tipos estáticos do TypeScript:
npm run lint

# 2. Teste de compilação de produção:
npm run build
```

Diretrizes adicionais:
- **TypeScript:** Sempre utilize tipagem forte, evitando o uso de `any` implícito.
- **Identidade Visual:** Respeite a paleta oficial (Galaxy Black `#050505`, Deep Black `#080808`, Warm Black `#0C0A08`, Pumpkin Orange `#FF7A00`, Bright Orange `#FF8A1F`, Amber `#FFB347`).
- **Commits Claros:** Utilize mensagens semânticas no formato Conventional Commits (ex: `feat:`, `fix:`, `docs:`, `refactor:`).

---

## 4. Enviando um Pull Request (PR)

1. Crie uma branch específica para sua alteração:
   ```bash
   git checkout -b feat/minha-melhoria
   ```
2. Faça o commit das suas alterações testadas:
   ```bash
   git commit -m "feat(voice): melhora cancelamento de eco"
   ```
3. Envie para o seu fork e abra o Pull Request contra a branch `main` do repositório oficial.
