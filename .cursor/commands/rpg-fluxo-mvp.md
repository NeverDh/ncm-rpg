# Fluxo pronto — MVP Feature 1 (`/rpg-fluxo-mvp`)

Este comando foi invocado para seguir o **fluxo já definido** no repositório para a primeira feature: **criação e visualização de personagem** via Telegram (ver `AGENTS.md` §8 e `docs/MODULES.md`).

## Contexto

Leia: `AGENTS.md`, `index/PROJECT_INDEX.md`, último `handoffs/*.md`, `architecture/ARCHITECTURE.md`, `docs/MODULES.md`.

## Como interpretar o pedido do usuário

- Se o usuário pedir **só uma fase** (ex.: “só wireframe”, “só Prisma”, “só bot”): execute **apenas** essa fase no papel indicado abaixo.
- Se pedir **fluxo completo** ou não especificar: execute a sequência **na ordem**, numa única resposta bem seccionada **ou** diga qual fase fará agora e o que falta (se o volume for excessivo).

## Sequência do fluxo pronto

1. **PRODUCT (explícito)** — Documentar ou atualizar o fluxo conversacional (mensagens, teclados, estados, confirmação, menu do personagem). Saída pode ir para `docs/` (ex.: novo arquivo `docs/fluxos/mvp-personagem.md`) se ainda não existir specs claras; não inventar números de raças não fechados no charter.
2. **ANALYST (curto)** — Riscos de acoplamento (character vs bot vs futuro inventory), ambiguidades.
3. **TECH_LEAD (condicional)** — Só se envolver **dependências novas**, mudança de módulos ou decisão de sessão Redis/DB; caso contrário, cite “gate dispensado” em uma linha.
4. **DEVELOPMENT** — Implementar ou continuar código alinhado a `architecture/ARCHITECTURE.md` (Nest + Prisma + Telegraf quando existir scaffold).

## Encerramento

Ao final deste fluxo (ou da fase solicitada): HANDOFF no formato `AGENTS.md` §6 **no chat**; **só após aprovação explícita do dono**, arquivo em `handoffs/`. Atualize ADRs se TECH_LEAD tiver decidido algo novo. Lembrete: PRODUCT e ANALYST **não editam código** (`AGENTS.md` §7.1).

## Mensagem do usuário

Execute em seguida o que o usuário escreveu junto com `/rpg-fluxo-mvp` (objetivo, escopo ou “fluxo completo”).
