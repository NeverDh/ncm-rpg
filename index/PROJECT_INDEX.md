# PROJECT_INDEX — Bot RPG Telegram (NestJS)

Ponto de entrada da documentação do projeto. Atualizar quando novos módulos, decisões ou handoffs forem adicionados. **Árvore detalhada:** [CODEBASE_INDEX.md](./CODEBASE_INDEX.md).

## Índice estendido (`index/`)

| Doc | Conteúdo |
|-----|----------|
| [CODEBASE_INDEX.md](./CODEBASE_INDEX.md) | Árvore do repo (sem `node_modules` / `dist`) e papel de cada pasta |
| [AGENTS_ECOSYSTEM.md](./AGENTS_ECOSYSTEM.md) | Mapa do multi-agent: comandos, prompts, fluxo, memória |
| [AGENT_DESIGN_BOT_TELEGRAM.md](./AGENT_DESIGN_BOT_TELEGRAM.md) | Design de mensagens Telegram + **BOT_COPY_AGENT** (`/rpg-bot-copy`) |
| [PROJECT_PHASE.md](./PROJECT_PHASE.md) | Marco ativo (M1…M5), pasta de handoffs, política de lançamento |

## Leitura obrigatória (ordem sugerida)

0. [../AGENTS.md](../AGENTS.md) — personas, handoff, regras, charter resumido  
0b. [../docs/COMO-USAR-AGENTS.md](../docs/COMO-USAR-AGENTS.md) — **passo a passo** dos agents e fluxos (`/rpg-*`)  
0b2. [../docs/FLUXO_MULTI_AGENT.md](../docs/FLUXO_MULTI_AGENT.md) — diagrama, prompts coláveis, troubleshooting  
0b3. [../docs/PROMPT_NOVO_CHAT.md](../docs/PROMPT_NOVO_CHAT.md) — texto colável para **continuar em outro chat**  
0c. [../docs/INTEGRACAO_TELEGRAM.md](../docs/INTEGRACAO_TELEGRAM.md) — ligar o bot ao seu Telegram (token, `.env`, troubleshooting)  
1. [../architecture/ARCHITECTURE.md](../architecture/ARCHITECTURE.md) — stack, pastas, princípios
2. [../docs/MODULES.md](../docs/MODULES.md) — módulos, roadmap M1 → M5
3. [../decisions/DECISIONS.md](../decisions/DECISIONS.md) — decisões arquiteturais registradas
4. [./PROJECT_PHASE.md](./PROJECT_PHASE.md) — **onde gravar handoffs** (pasta do marco ativo, ex. `handoffs/M2/`)
5. Último handoff na pasta do marco ativo (ver PROJECT_PHASE; convenção: [../handoffs/README.md](../handoffs/README.md))

## Estado do repositório

| Item | Status |
|------|--------|
| Código NestJS | `src/`: `bot/` (Telegraf), `modules/character/`, `infra/prisma/`, `config/`, `health` |
| Prisma / PostgreSQL | `schema.prisma` + **4** migrações (`init`, `energy_vigor_attribute`, `mvp_rebalance_no_per`, `creation_zero_class_racial_layers`); Prisma 5.x pinado |
| Bot Telegraf | Polling em `BotService` (requer `BOT_TOKEN`) |
| Docker Compose | `docker-compose.yml` (Postgres 16) |
| M1 (personagem) | **Concluído** (2026-05-03); histórico `handoffs/M1/`; `docs/fluxos/m1-personagem.md`, ADR-009 |
| M2 (inventário) | **Marco ativo** — ver `docs/MODULES.md` M2 e `index/PROJECT_PHASE.md`; handoffs em `handoffs/M2/` |

## Convenções

- **Handoffs:** formato em `AGENTS.md` §6 — **publicar primeiro no chat**, obter **aprovação explícita do dono**, só então um ficheiro por ciclo em `handoffs/<M>/` (**`<M>`** em `index/PROJECT_PHASE.md`); nomes `YYYY-MM-DD-slug.md` conforme `handoffs/README.md`.
- **Código:** PRODUCT, ANALYST e personas de design/copy **não** editam implementação (`src/`, Prisma, `package.json`, etc.) — `AGENTS.md` §7.1.
- **Decisões:** ADRs curtos em `decisions/DECISIONS.md`; impacto arquitetural exige registro antes de código divergente.
- **Módulos:** boundaries em `docs/MODULES.md`; evitar lógica de negócio em handlers Telegram.

## Stack (referência rápida)

NestJS, TypeScript, PostgreSQL, Prisma, Docker, Telegraf, Swagger; Redis futuro; config por ambiente.

## Contato com agents (processo)

1. Ler `AGENTS.md`, este índice e os documentos ligados acima.
2. Em chat novo: [docs/COMO-USAR-AGENTS.md](../docs/COMO-USAR-AGENTS.md); diagrama e troubleshooting em [docs/FLUXO_MULTI_AGENT.md](../docs/FLUXO_MULTI_AGENT.md); prompts em `docs/prompts/`.
3. Executar a tarefa no escopo acordado.
4. Handoff: §6 no chat → **aprovação do dono** → ficheiro em `handoffs/<M>/` (`index/PROJECT_PHASE.md`; formato em `AGENTS.md`).
5. Atualizar `DECISIONS.md` / `MODULES.md` / `ARCHITECTURE.md` quando houver mudança estrutural.
