# PROJECT_INDEX — Bot RPG Telegram (NestJS)

Ponto de entrada da documentação do projeto. Atualizar quando novos módulos, decisões ou handoffs forem adicionados.

## Índice estendido (`index/`)

| Doc | Conteúdo |
|-----|----------|
| [CODEBASE_INDEX.md](./CODEBASE_INDEX.md) | Árvore do repo (sem `node_modules` / `dist`) e papel de cada pasta |
| [AGENTS_ECOSYSTEM.md](./AGENTS_ECOSYSTEM.md) | Mapa do multi-agent: comandos, prompts, fluxo, memória |
| [AGENT_DESIGN_BOT_TELEGRAM.md](./AGENT_DESIGN_BOT_TELEGRAM.md) | Design de mensagens Telegram + **BOT_COPY_AGENT** (`/rpg-bot-copy`) |

## Leitura obrigatória (ordem sugerida)

0. [../AGENTS.md](../AGENTS.md) — personas, handoff, regras, charter resumido  
0b. [../docs/COMO-USAR-AGENTS.md](../docs/COMO-USAR-AGENTS.md) — **passo a passo** dos agents e fluxos (`/rpg-*`)  
0b2. [../docs/FLUXO_MULTI_AGENT.md](../docs/FLUXO_MULTI_AGENT.md) — detalhes + troubleshooting  
0b3. [../docs/PROMPT_NOVO_CHAT.md](../docs/PROMPT_NOVO_CHAT.md) — texto colável para **continuar em outro chat**  
0c. [../docs/INTEGRACAO_TELEGRAM.md](../docs/INTEGRACAO_TELEGRAM.md) — ligar o bot ao seu Telegram (token, `.env`, troubleshooting)  
1. [../architecture/ARCHITECTURE.md](../architecture/ARCHITECTURE.md) — stack, pastas, princípios
2. [../docs/MODULES.md](../docs/MODULES.md) — módulos, roadmap MVP → M5
3. [../decisions/DECISIONS.md](../decisions/DECISIONS.md) — decisões arquiteturais registradas
4. Último handoff em [../handoffs/](../handoffs/) (ordenar por nome/data)

## Estado do repositório

| Item | Status |
|------|--------|
| Código NestJS | Scaffold em `src/` (character + bot + prisma + health) |
| Prisma / PostgreSQL | Schema + migração `init`; Prisma 5.x pinado |
| Bot Telegraf | Polling MVP em `BotService` (requer `BOT_TOKEN`) |
| Docker Compose | `docker-compose.yml` (Postgres 16) |
| MVP Feature 1 (personagem) | Fluxo classe → raça → nome → confirmar → ficha; ver `docs/fluxos/mvp-personagem.md`, ADR-009 |

## Convenções

- **Handoffs:** formato em `AGENTS.md` §6 — **publicar primeiro no chat**, obter **aprovação explícita do dono**, só então um arquivo por ciclo em `handoffs/`.
- **Código:** PRODUCT, ANALYST e personas de design/copy **não** editam implementação (`src/`, Prisma, `package.json`, etc.) — `AGENTS.md` §7.1.
- **Decisões:** ADRs curtos em `decisions/DECISIONS.md`; impacto arquitetural exige registro antes de código divergente.
- **Módulos:** boundaries em `docs/MODULES.md`; evitar lógica de negócio em handlers Telegram.

## Stack (referência rápida)

NestJS, TypeScript, PostgreSQL, Prisma, Docker, Telegraf, Swagger; Redis futuro; config por ambiente.

## Contato com agents (processo)

1. Ler `AGENTS.md`, este índice e os documentos ligados acima.
2. Em chat novo: seguir `docs/FLUXO_MULTI_AGENT.md` e prompts em `docs/prompts/`.
3. Executar a tarefa no escopo acordado.
4. Handoff: §6 no chat → **aprovação do dono** → arquivo em `handoffs/` (formato em `AGENTS.md`).
5. Atualizar `DECISIONS.md` / `MODULES.md` / `ARCHITECTURE.md` quando houver mudança estrutural.
