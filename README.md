# Bot RPG Telegram

RPG medieval por turnos no Telegram — backend **NestJS**, **PostgreSQL** + **Prisma**, bot **Telegraf**. Documentação do produto e processo multi-agent: `AGENTS.md`, `index/PROJECT_INDEX.md`, `docs/`.

**Agents no Cursor:** passo a passo em **`docs/COMO-USAR-AGENTS.md`** · texto para novo chat em **`docs/PROMPT_NOVO_CHAT.md`**.

## Integração Telegram

Passo a passo (BotFather, `.env`, testes): **`docs/INTEGRACAO_TELEGRAM.md`**.

## Rodar localmente

1. `cp .env.example .env` — preencha `BOT_TOKEN` (BotFather). Guia: `docs/INTEGRACAO_TELEGRAM.md`.
2. `docker compose up -d`
3. `npm install`
4. `npx prisma migrate dev` (com `DATABASE_URL` igual ao `.env.example` se usar o compose padrão).
5. `npm run start:dev`

- HTTP: `http://localhost:3000/health`
- Swagger: `http://localhost:3000/docs`
- Bot: polling automático se `BOT_TOKEN` estiver definido.

## Comandos úteis

- `npm run build`
- `npm run test:e2e` (requer Postgres acessível em `DATABASE_URL`)
