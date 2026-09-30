# Política de Segurança do pumpkin

A equipe e mantenedores do **pumpkin** levam a segurança e a integridade de seus usuários a sério. Agradecemos à comunidade de pesquisa em segurança pelo auxílio na identificação e mitigação responsável de potenciais vulnerabilidades.

---

## 1. Versões com Suporte Oficial a Correções de Segurança

| Versão | Suporte a Patches de Segurança |
| :--- | :--- |
| `1.0.x` | :white_check_mark: Ativo (versão estável mais recente) |
| `< 1.0.0` | :x: Descontinuado / Pré-lançamento |

---

## 2. Como Reportar uma Vulnerabilidade (Divulgação Responsável)

Se você identificou uma potencial vulnerabilidade no pumpkin, solicitamos que **não abra uma Issue pública** para evitar que terceiros explorem o problema antes do lançamento de um patch.

### Canal Preferencial:
1. Abra um relatório confidencial através de **GitHub Security Advisories** na aba de Segurança do repositório oficial (`https://github.com/nckfpsdev/pumpkin/security/advisories/new`).
2. Se o canal acima não estiver disponível em seu ambiente, envie um relatório estruturado diretamente para os mantenedores do projeto através dos canais de contato documentados no repositório.

### O que incluir no seu relatório:
- **Descrição detalhada:** Explicação clara do vetor de vulnerabilidade e impacto estimado.
- **Passos para reprodução:** Passo a passo técnico para reproduzir a questão.
- **Prova de Conceito (PoC):** Código ou comando mínimo demonstrando o comportamento inesperado.
- **Versão ou commit afetado:** Número de versão ou hash do commit testado.

---

## 3. Compromisso da Equipe
- **Confirmação inicial:** Responderemos à notificação com a confirmação do recebimento.
- **Análise e triagem:** Avaliaremos a severidade da falha (CVSS) e os componentes afetados (Web, Desktop, Android ou WebSocket Relay).
- **Correção e Release:** Desenvolveremos o patch e publicaremos uma nova release com os devidos créditos aos pesquisadores que colaboraram.
