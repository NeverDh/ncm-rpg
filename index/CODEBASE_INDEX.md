# CODEBASE_INDEX — Árvore do repositório

Índice de arquivos e pastas **sem** `node_modules/`, `dist/` e `.git/` (artefatos gerados ou dependências). Atualizar quando a estrutura mudar.

## Raiz

| Caminho | Função |
|---------|--------|
| `package.json` / `package-lock.json` | Dependências e scripts NPM |
| `nest-cli.json`, `tsconfig*.json`, `eslint.config.mjs`, `.prettierrc` | Tooling Nest/TS/lint |
| `docker-compose.yml` | PostgreSQL local |
| `.env` / `.env.example` | Variáveis (ex.: `BOT_TOKEN`, DB); não commitar segredos |
| `README.md` | Visão geral do projeto |

## Documentação e processo multi-agent

| Caminho | Função |
|---------|--------|
| `AGENTS.md` | Fonte única: personas, handoff, charter, comandos `/rpg-*` |
| `index/PROJECT_INDEX.md` | Entrada da documentação |
| `index/PROJECT_PHASE.md` | Marco ativo (M1…M5) e pasta de handoffs |
| `index/CODEBASE_INDEX.md` | Este arquivo — árvore |
| `index/AGENTS_ECOSYSTEM.md` | Mapa do ecossistema de agents |
| `index/AGENT_DESIGN_BOT_TELEGRAM.md` | Design + persona para copy/mensagens do bot |
| `architecture/ARCHITECTURE.md` | Stack, pastas, princípios |
| `docs/MODULES.md` | Módulos e roadmap M1 → M5 |
| `docs/COMO-USAR-AGENTS.md` | Passo a passo dos agents |
| `docs/FLUXO_MULTI_AGENT.md` | Diagrama, prompts coláveis, troubleshooting (complementa COMO-USAR) |
| `docs/PROMPT_NOVO_CHAT.md` | Texto colável para novo chat |
| `docs/INTEGRACAO_TELEGRAM.md` | Token, `.env`, troubleshooting |
| `docs/fluxos/m1-personagem.md` | Fluxo conversacional M1 (personagem) |
| `docs/fluxos/mvp-personagem.md` | Stub que aponta para `m1-personagem.md` (links antigos) |
| `docs/prompts/*.md` | Prompts coláveis por agent |
| `decisions/DECISIONS.md` | ADRs / decisões |
| `handoffs/M1/` … `handoffs/M5/` | Handoffs por marco; pasta ativa em `index/PROJECT_PHASE.md`; convenção em `handoffs/README.md` |

## Cursor (comandos e regras)

| Caminho | Função |
|---------|--------|
| `.cursor/rules/bot-rpg-multi-agent.mdc` | Regra de workspace (ler AGENTS, handoff, etc.) |
| `.cursor/commands/rpg-session.md` | Carregar contexto (`/rpg-session`) |
| `.cursor/commands/rpg-bootstrap.md` | Idem bootstrap (`/rpg-bootstrap`) |
| `.cursor/commands/rpg-product.md` | PRODUCT_AGENT |
| `.cursor/commands/rpg-bot-copy.md` | BOT_COPY_AGENT |
| `.cursor/commands/rpg-analyst.md` | ANALYST_AGENT |
| `.cursor/commands/rpg-dev.md` | DEVELOPMENT_AGENT |
| `.cursor/commands/rpg-tech-lead.md` | TECH_LEAD_AGENT |
| `.cursor/commands/rpg-fluxo-mvp.md` | Fluxo pronto M1→M5 (`/rpg-fluxo-mvp`) |
| `.cursor/skills/bot-rpg-dev/SKILL.md` | Skill opcional de workflow DEV (Nest/bot/testes) |

## Código-fonte (`src/`)

```
src/
  main.ts                 # Bootstrap Nest
  app.module.ts           # Módulo raiz
  health.controller.ts    # Health check
  config/
    configuration.ts      # Config por ambiente
  infra/
    prisma/
      prisma.module.ts
      prisma.service.ts
  bot/
    bot.module.ts
    bot.service.ts        # Telegraf, wizard, orquestração (sem regra de negócio)
    bot.presenter.ts      # Teclados, formatação de mensagens
    bot.labels.ts         # Rótulos de botões/UI
    bot.copy.ts           # Blurbs e textos curtos (raça/classe/progressão M1)
  modules/
    character/
      character.module.ts
      character.service.ts      # Domínio personagem; finalização criação (sem RN no bot)
      character.constants.ts    # Orçamentos M1 (classe/raça), energia fixa, etc.
      character.derivation.ts   # Secundários derivados + HP/Mana/Stamina; addCoreAttrs (M2)
      character.derivation.spec.ts
      class-bases.ts
      class-modifiers.ts        # Pacote +10 pts por classe (ADR-012)
      racial-modifiers.ts       # +12 pts líquidos por raça (ADR-010)
    inventory/
      inventory.module.ts
      inventory.constants.ts    # Bolsa 20 slots (M2)
      inventory.service.ts      # Bolsa, equipar, consumível fora de combate (M2)
```

## Prisma

```
prisma/
  schema.prisma
  migrations/
    20260502031139_init/migration.sql
    20260502120000_energy_vigor_attribute/migration.sql
    20260502140000_mvp_rebalance_no_per/migration.sql
    20260502180000_creation_zero_class_racial_layers/migration.sql
    20260503120000_m2_inventory/migration.sql
    migration_lock.toml
```

## Testes e scripts

| Caminho | Função |
|---------|--------|
| `test/app.e2e-spec.ts`, `test/jest-e2e.json` | E2E |
| `scripts/` | Scripts auxiliares (se houver) |

## Árvore plana (referência rápida)

```
./.prettierrc
./AGENTS.md
./architecture/ARCHITECTURE.md
./.cursor/commands/rpg-analyst.md
./.cursor/commands/rpg-bootstrap.md
./.cursor/commands/rpg-bot-copy.md
./.cursor/commands/rpg-dev.md
./.cursor/commands/rpg-fluxo-mvp.md
./.cursor/commands/rpg-product.md
./.cursor/commands/rpg-session.md
./.cursor/commands/rpg-tech-lead.md
./.cursor/rules/bot-rpg-multi-agent.mdc
./.cursor/skills/bot-rpg-dev/SKILL.md
./decisions/DECISIONS.md
./docker-compose.yml
./docs/COMO-USAR-AGENTS.md
./docs/FLUXO_MULTI_AGENT.md
./docs/fluxos/m1-personagem.md
./docs/fluxos/mvp-personagem.md
./docs/INTEGRACAO_TELEGRAM.md
./docs/MODULES.md
./docs/PROMPT_NOVO_CHAT.md
./docs/prompts/ANALYST_AGENT.md
./docs/prompts/BOT_COPY_AGENT.md
./docs/prompts/DEVELOPMENT_AGENT.md
./docs/prompts/INICIO-SESSAO.md
./docs/prompts/PRODUCT_AGENT.md
./docs/prompts/README.md
./docs/prompts/TECH_LEAD_AGENT.md
./eslint.config.mjs
./handoffs/README.md
./handoffs/M1/…
./handoffs/M2/README.md
./handoffs/M3/README.md
./handoffs/M4/README.md
./handoffs/M5/README.md
./index/AGENT_DESIGN_BOT_TELEGRAM.md
./index/AGENTS_ECOSYSTEM.md
./index/CODEBASE_INDEX.md
./index/PROJECT_INDEX.md
./index/PROJECT_PHASE.md
./nest-cli.json
./package.json
./package-lock.json
./prisma/schema.prisma
./prisma/migrations/20260502031139_init/migration.sql
./prisma/migrations/20260502120000_energy_vigor_attribute/migration.sql
./prisma/migrations/20260502140000_mvp_rebalance_no_per/migration.sql
./prisma/migrations/20260502180000_creation_zero_class_racial_layers/migration.sql
./prisma/migrations/20260503120000_m2_inventory/migration.sql
./prisma/migrations/migration_lock.toml
./README.md
./src/app.module.ts
./src/bot/bot.copy.ts
./src/bot/bot.labels.ts
./src/bot/bot.module.ts
./src/bot/bot.presenter.ts
./src/bot/bot.service.ts
./src/config/configuration.ts
./src/health.controller.ts
./src/infra/prisma/prisma.module.ts
./src/infra/prisma/prisma.service.ts
./src/main.ts
./src/modules/character/character.constants.ts
./src/modules/character/character.derivation.ts
./src/modules/character/character.derivation.spec.ts
./src/modules/character/character.module.ts
./src/modules/character/character.service.ts
./src/modules/inventory/inventory.constants.ts
./src/modules/inventory/inventory.module.ts
./src/modules/inventory/inventory.service.ts
./src/modules/character/class-bases.ts
./src/modules/character/class-modifiers.ts
./src/modules/character/racial-modifiers.ts
./test/app.e2e-spec.ts
./test/jest-e2e.json
./tsconfig.build.json
./tsconfig.json
```

**Excluídos de propósito:** `node_modules/`, `dist/`, `.git/`.
