---
name: bot-rpg-dev
description: >-
  Workflow de implementação NestJS/Prisma/Telegraf neste repositório: limites de
  módulo, bot sem regra de negócio nos handlers, testes. Use ao editar src/,
  especialmente src/bot/ ou src/modules/character/.
---

# bot-rpg-dev (projeto bot-rpg-telegram)

Complementa os comandos `/rpg-*`: não substitui `AGENTS.md` nem `.cursor/commands/`.

## Antes de mudar código

1. `AGENTS.md` §7.1 — handlers Telegram só orquestram; domínio em serviços (ex.: `CharacterService`).
2. `architecture/ARCHITECTURE.md`, `docs/MODULES.md` e `index/PROJECT_PHASE.md` para boundaries e marco ativo.
3. Se tocar em stack ou limites de módulo: `decisions/DECISIONS.md` e gate com TECH_LEAD quando couber.

## Copy e UI do Telegram

- Textos curtos e labels: alinhar a `index/AGENT_DESIGN_BOT_TELEGRAM.md`; arquivos típicos `src/bot/bot.copy.ts`, `bot.labels.ts`, formatação em `bot.presenter.ts`.

## Depois de alterações em `src/bot/` ou domínio de personagem

Rodar a suíte de testes do projeto (ex.: `npm test`) e corrigir regressões antes de encerrar o ciclo.

## Ao concluir trabalho útil

Handoff = `AGENTS.md` §6 + `index/PROJECT_PHASE.md` + `handoffs/README.md` (aprovação do dono antes de gravar).
