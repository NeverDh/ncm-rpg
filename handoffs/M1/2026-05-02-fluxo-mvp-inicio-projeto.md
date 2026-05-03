# HANDOFF

## Agent
DEVELOPMENT_AGENT (fluxo `/rpg-fluxo-mvp`)

## Objetivo
Início do projeto conforme **M1** Feature 1: documento de fluxo `docs/fluxos/m1-personagem.md`; scaffold NestJS na raiz; Prisma + Postgres (Docker); módulos `character` + `bot` (Telegraf); health + Swagger; migração inicial aplicada (ambiente local com Docker).

## Arquivos afetados
- `src/` — app, config, infra/prisma, modules/character, bot, health.controller
- `prisma/schema.prisma`, `prisma/migrations/*`
- `docker-compose.yml`, `.env.example`, `.gitignore`
- `package.json` (deps + scripts prisma), `test/app.e2e-spec.ts`
- `docs/fluxos/m1-personagem.md`
- `decisions/DECISIONS.md` (ADR-002 aceita, ADR-006)
- `architecture/ARCHITECTURE.md`, `index/PROJECT_INDEX.md`
- Removidos default `app.controller` / `app.service` / spec unitário legado

## Decisões tomadas
- Prisma **5.22.0** (evitar breaking Prisma 7 neste setup).
- Sessão Telegram ↔ estado em **PostgreSQL** via `Character`.
- Bônus Drakari/Valtherin **provisórios** até charter fechar.

## Pendências
- Copiar `.env.example` → `.env` e preencher `BOT_TOKEN`; `docker compose up -d`; `npm run prisma:migrate` se mudar schema.
- Substituir README gerado pelo Nest por texto do projeto (opcional).
- Fluxo “resetar personagem”; `/help`; testes de `CharacterService`.

## Riscos identificados
- `README.md` do Nest ainda é boilerplate em inglês.
- E2E depende de `DATABASE_URL` alcançável.

## Próximo agente recomendado
- PRODUCT_AGENT — enriquecer copy/tema medieval e `/help`.
- Ou `/rpg-dev` — testes unitários do serviço de personagem + CI.
