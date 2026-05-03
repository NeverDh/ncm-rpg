# Como usar os agents e fluxos (passo a passo)

Guia **único** para trabalhar com as personas (PRODUCT, ANALYST, DEV, TECH_LEAD) e o fluxo MVP no Cursor. Detalhes extras: [FLUXO_MULTI_AGENT.md](./FLUXO_MULTI_AGENT.md) e [AGENTS.md](../AGENTS.md).

---

## Antes de qualquer coisa

1. Abra o **workspace** na pasta raiz do repositório (`bot-rpg-telegram`).
2. Use o **Agent Chat** do Cursor (onde os comandos `/` funcionam).

**Política do dono:** PRODUCT, ANALYST e agents de design/copy **não alteram código** nem artefatos de implementação — ver `AGENTS.md` §7.1.

---

## Passo a passo rápido

| Passo | O que fazer |
|-------|-------------|
| 1 | Digite **`/`** no Agent Chat e procure comandos que começam com **`rpg-`**. |
| 2 | Escolha **um** comando (veja tabela abaixo). |
| 3 | Na **mesma mensagem** ou na **seguinte**, escreva em português o que você quer. |
| 4 | Ao terminar trabalho útil: **HANDOFF** na §6 de `AGENTS.md` **no chat** → dono **aprova** → só então arquivo em `handoffs/YYYY-MM-DD-assunto.md`. |

Se **`/rpg-session`** não aparecer, use **`/rpg-bootstrap`** (mesmo efeito).

---

## Tabela de comandos (`/.cursor/commands/`)

| Comando | Função |
|---------|--------|
| **`/rpg-session`** ou **`/rpg-bootstrap`** | Carrega contexto: ler `AGENTS.md`, índice, último handoff — ideal para **chat novo**. |
| **`/rpg-product`** | UX Telegram, fluxo, copy, MVP produto. |
| **`/rpg-bot-copy`** | Copy e mensagens do bot (tom, textos; não edita código). |
| **`/rpg-analyst`** | Riscos, domínio, sustentabilidade. |
| **`/rpg-dev`** | Código NestJS, Prisma, bot. |
| **`/rpg-tech-lead`** | Gate arquitetural, ADRs. |
| **`/rpg-fluxo-mvp`** | Fluxo **pronto** da Feature 1 (personagem): PRODUCT → ANALYST → TECH_LEAD (se preciso) → DEV — você complementa com “fluxo completo” ou escopo parcial. |

---

## Fluxos típicos

- **Só implementar algo:** `/rpg-dev` → descreva a tarefa.
- **Só desenhar UX:** `/rpg-product` → descreva.
- **Só textos do bot:** `/rpg-bot-copy` → descreva (blurbs, labels, tom).
- **Feature grande do zero:** `/rpg-fluxo-mvp` → “fluxo completo” ou “só fase X”.
- **Chat novo sem histórico:** `/rpg-bootstrap` → “resume estado do repo e último handoff”; depois outro comando se precisar.

---

## Leitura no repositório (memória do projeto)

Ordem sugerida quando o agent precisar de contexto:

1. [`index/PROJECT_INDEX.md`](../index/PROJECT_INDEX.md)  
2. Último arquivo em [`handoffs/`](../handoffs/) (por data no nome)  
3. [`architecture/ARCHITECTURE.md`](../architecture/ARCHITECTURE.md), [`docs/MODULES.md`](./MODULES.md)  
4. [`decisions/DECISIONS.md`](../decisions/DECISIONS.md) se mudar stack ou regras de módulo  

---

## Alternativa sem `/`

Anexe **`@AGENTS.md`** e copie blocos de [`docs/prompts/`](./prompts/README.md) (marcadores `---COPIAR DAQUI---`).

---

## Problemas

- **`/` não lista os comandos:** recarregue a janela do Cursor (Reload Window); confira que a pasta aberta é a raiz do repo; veja [FLUXO_MULTI_AGENT.md § Troubleshooting](./FLUXO_MULTI_AGENT.md#troubleshooting).

---

## Prompt para colar em outro chat

Use o arquivo **[PROMPT_NOVO_CHAT.md](./PROMPT_NOVO_CHAT.md)** — texto curto para continuar sem depender desta conversa.
