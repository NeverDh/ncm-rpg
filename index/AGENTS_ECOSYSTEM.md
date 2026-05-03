# AGENTS_ECOSYSTEM — Mapa do multi-agent

Visão do **ecossistema de agents** deste repositório: onde cada peça vive e como se encadeia. Complementa `AGENTS.md` com uma indexação operacional.

## Fonte de verdade

| Camada | Arquivo / pasta | Papel |
|--------|-------------------|--------|
| Personas e processo | `AGENTS.md` | PRODUCT, ANALYST, DEVELOPMENT, TECH_LEAD; handoff; charter M1; filosofia |
| Entrada doc | `index/PROJECT_INDEX.md` | Ordem de leitura e estado do repo |
| Fase e handoffs | `index/PROJECT_PHASE.md` | Marco ativo (M1…M5), pasta `handoffs/M*/`, política de lançamento |
| Regra Cursor | `.cursor/rules/bot-rpg-multi-agent.mdc` | Lembra AGENTS, índice, handoffs, limites (sem RN em handler, sem deps sem gate) |

## Comandos slash (Cursor Agent Chat)

Arquivos em `.cursor/commands/` viram comandos `/nome` no chat:

| Comando | Agente / uso |
|---------|----------------|
| `/rpg-session` ou `/rpg-bootstrap` | Carregar contexto (índice + handoff + fluxo) |
| `/rpg-product` | PRODUCT_AGENT — UX Telegram, fluxos, textos |
| `/rpg-bot-copy` | BOT_COPY_AGENT — copy e mensagens do bot (sem editar código) |
| `/rpg-analyst` | ANALYST_AGENT — riscos, domínio, sustentabilidade |
| `/rpg-dev` | DEVELOPMENT_AGENT — Nest, Prisma, bot |
| `/rpg-tech-lead` | TECH_LEAD_AGENT — gate arquitetural, ADRs |
| `/rpg-fluxo-mvp` | Fluxo pronto **M1→M5** (comando com o mesmo nome): PRODUCT → BOT_COPY → ANALYST → TECH_LEAD (cond.) → DEV **por marco** |

Cada `.md` em `commands/` resume missão, referências (`AGENTS.md`, `docs/MODULES.md`) e obrigação de handoff.

## Prompts coláveis (sem depender de slash)

| Arquivo | Equivalente |
|---------|-------------|
| `docs/prompts/INICIO-SESSAO.md` | Sessão / bootstrap |
| `docs/prompts/PRODUCT_AGENT.md` | PRODUCT |
| `docs/prompts/BOT_COPY_AGENT.md` | BOT_COPY |
| `docs/prompts/ANALYST_AGENT.md` | ANALYST |
| `docs/prompts/DEVELOPMENT_AGENT.md` | DEV |
| `docs/prompts/TECH_LEAD_AGENT.md` | TECH_LEAD |
| `docs/prompts/README.md` | Índice dos prompts |

Guias: **`docs/COMO-USAR-AGENTS.md`** (comandos + passos); **`docs/FLUXO_MULTI_AGENT.md`** (diagrama, prompts coláveis, troubleshooting); **`docs/PROMPT_NOVO_CHAT.md`** (colar em chat novo).

## Fluxo recomendado (features)

Encadeamento típico do **`/rpg-fluxo-mvp`** (repetido para cada marco quando pedir fluxo completo). Em **tarefas avulsas**, **ANALYST** e **TECH_LEAD** são opcionais conforme risco; você pode usar só `/rpg-dev`, só `/rpg-product`, etc. (`AGENTS.md` §5).

```mermaid
flowchart LR
  P[PRODUCT] --> BC[BOT_COPY]
  BC --> A[ANALYST]
  A --> D[DEVELOPMENT]
  A -.->|se preciso| T[TECH_LEAD]
  T --> D
  D -->|revisão| T
```

- **Ideação / UX chat:** PRODUCT  
- **Copy e tom do bot:** BOT_COPY (`/rpg-bot-copy`)  
- **Dúvida de escopo ou risco:** ANALYST  
- **Dependência nova ou boundary:** TECH_LEAD antes (e depois revisão)  
- **Implementação:** DEVELOPMENT  

Feature mínima personagem (M1): charter em `AGENTS.md` §8 e `docs/MODULES.md`; fluxo detalhado em `docs/fluxos/m1-personagem.md`.

## Memória entre chats

1. `handoffs/M1/` … `handoffs/M5/` — pasta ativa em **`index/PROJECT_PHASE.md`**; último ficheiro por **ordenação lexicográfica do nome** dentro dessa pasta; prefixo `YYYY-MM-DD-slug.md` (`handoffs/README.md`). Formato §6 de `AGENTS.md`; ficheiros só **após o dono aprovar** (§6).  
2. `decisions/DECISIONS.md` — decisões que mudam stack ou módulos  
3. Este índice e `CODEBASE_INDEX.md` — onde está o código  

**Alterações documentadas para agents:** índice do repo (`CODEBASE_INDEX.md`), este ecosystem map e design de mensagens (`AGENT_DESIGN_BOT_TELEGRAM.md`) — também listados na §2 de `AGENTS.md`.

**Fronteira de código:** PRODUCT, ANALYST e BOT_COPY/design **não** editam `src/`, Prisma de schema/migrations, `package.json`, etc. (`AGENTS.md` §7.1).

## Fronteira técnica relevante aos agents

- **Handlers / `BotService`:** só orquestração; regras em `CharacterService` e domínio.  
- **Copy e labels:** `src/bot/bot.copy.ts`, `bot.labels.ts`, formatação em `bot.presenter.ts` — ver `index/AGENT_DESIGN_BOT_TELEGRAM.md` para padronizar mensagens.

## Skills de projeto (Cursor)

Opcional: `.cursor/skills/bot-rpg-dev/SKILL.md` — workflow de implementação (boundaries, testes, handoff). **Não** substitui comandos `/rpg-*` nem `docs/prompts/`; evita depender só de skills globais do desenvolvedor.

## Extensões futuras do ecossistema

- Novo agente: prompt em `docs/prompts/`, comando em `.cursor/commands/`, linha na tabela §9 de `AGENTS.md` e neste mapa. **BOT_COPY** já usa `/rpg-bot-copy` + `BOT_COPY_AGENT.md`.
