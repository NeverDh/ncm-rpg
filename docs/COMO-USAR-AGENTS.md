# Como usar os agents e fluxos (passo a passo)

**Este ficheiro** concentra a **tabela canónica de comandos** `/rpg-*`, o **checklist linear** e a **ordem de leitura** da memória do repo. Personas, handoff e restrições: sempre **`AGENTS.md`**.

**Outro guia (sem duplicar a tabela):** [FLUXO_MULTI_AGENT.md](./FLUXO_MULTI_AGENT.md) — diagrama Mermaid, **tabela de prompts** em `docs/prompts/`, exemplos de pedido e **troubleshooting** ampliado.

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
| 4 | Ao terminar trabalho útil: **HANDOFF** na §6 de `AGENTS.md` **no chat** → dono **aprova** → só então ficheiro em `handoffs/<M>/YYYY-MM-DD-assunto.md` (`index/PROJECT_PHASE.md`). |

Se **`/rpg-session`** não aparecer, use **`/rpg-bootstrap`** (mesmo efeito).

---

## Tabela de comandos (`/.cursor/commands/`)

| Comando | Função |
|---------|--------|
| **`/rpg-session`** ou **`/rpg-bootstrap`** | Carrega contexto: ler `AGENTS.md`, índice, **PROJECT_PHASE**, **`CODEBASE_INDEX` (sempre)**, último handoff na pasta do marco — ideal para **chat novo**. |
| **`/rpg-product`** | UX Telegram, fluxo, copy, marco ativo (M1…M5). |
| **`/rpg-bot-copy`** | Copy e mensagens do bot (tom, textos; não edita código). |
| **`/rpg-analyst`** | Riscos, domínio, sustentabilidade. |
| **`/rpg-dev`** | Código NestJS, Prisma, bot. |
| **`/rpg-tech-lead`** | Gate arquitetural, ADRs. |
| **`/rpg-fluxo-mvp`** | Fluxo **pronto M1→M5** (nome do comando inalterado): mesmo pipeline por marco; lançamento público só após M1–M5 — ver `.cursor/commands/rpg-fluxo-mvp.md` e `index/PROJECT_PHASE.md`. |

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
2. [`index/PROJECT_PHASE.md`](../index/PROJECT_PHASE.md) — pasta de handoffs (`handoffs/M1/`, …)  
3. [`index/CODEBASE_INDEX.md`](../index/CODEBASE_INDEX.md) — árvore do repo (**sempre**)  
4. Último ficheiro nessa pasta (ordenar pelo nome)  
5. [`architecture/ARCHITECTURE.md`](../architecture/ARCHITECTURE.md), [`docs/MODULES.md`](./MODULES.md)  
6. [`decisions/DECISIONS.md`](../decisions/DECISIONS.md) se mudar stack ou regras de módulo  

---

## Alternativa sem `/`

Anexe **`@AGENTS.md`** e copie blocos de [`docs/prompts/`](./prompts/README.md) (marcadores `---COPIAR DAQUI---`).

---

## Problemas

- **`/` não lista os comandos:** recarregue a janela do Cursor (Reload Window); confira que a pasta aberta é a raiz do repo; veja [FLUXO_MULTI_AGENT.md § Troubleshooting](./FLUXO_MULTI_AGENT.md#troubleshooting).

---

## Prompt para colar em outro chat

Use o arquivo **[PROMPT_NOVO_CHAT.md](./PROMPT_NOVO_CHAT.md)** — texto curto para continuar sem depender desta conversa.
