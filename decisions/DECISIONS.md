# DECISIONS — Registro de decisões (ADR-lite)

Formato sugerido por entrada:

```
### ADR-NNN — Título
- **Status:** proposta | aceita | depreciada
- **Contexto:** …
- **Decisão:** …
- **Consequências:** …
```

---

## Registro

### ADR-001 — Documentação e pastas iniciais

- **Status:** aceita
- **Contexto:** Repositório vazio; charter exige `/docs`, `/handoffs`, `/architecture`, `/decisions`, `/index` e arquivos de índice.
- **Decisão:** Usar `index/PROJECT_INDEX.md` como índice mestre; `docs/MODULES.md` para roadmap e limites de módulo; `architecture/ARCHITECTURE.md` para stack e princípios; `decisions/DECISIONS.md` para ADRs.
- **Consequências:** Agents leem primeiro o índice e seguem para módulos/arquitetura/decisões antes de codar.

### ADR-002 — Monólito modular NestJS

- **Status:** aceita
- **Contexto:** Charter define monólito modular com Telegraf e Prisma.
- **Decisão:** NestJS com módulo `character` como núcleo de **M1**; `bot` como transporte Telegraf; domínio em `CharacterService`; apresentação em `bot.presenter.ts`.
- **Consequências:** Handlers só orquestram chamadas ao serviço de personagem.

### ADR-006 — Scaffold inicial (stack e sessão)

- **Status:** aceita
- **Contexto:** Início do código; Prisma 7 quebrou `datasource url` no schema neste ambiente.
- **Decisão:** **Prisma 5.22.0** + `@prisma/client` 5.22.0; **PostgreSQL 16** via Docker Compose na porta 5432; estado conversacional em **`Character.creationStep`** (sem Redis em **M1**); **Telegraf polling** quando `BOT_TOKEN` definido (HTTP sobe mesmo sem token); **NestJS 11** conforme `package.json`.
- **Consequências:** Drakari/Valtherin usam bônus **provisórios** em `racial-modifiers.ts` até fechamento pelo charter; revisar em ADR futuro.

### ADR-003 — Consumo multi-agent em chat novo

- **Status:** aceita
- **Contexto:** Trabalho distribuído entre personas (PRODUCT, ANALYST, DEVELOPMENT, TECH_LEAD) sem depender de histórico de chat.
- **Decisão:** `AGENTS.md` como fonte única; prompts em `docs/prompts/`; guias **`docs/COMO-USAR-AGENTS.md`** (tabela `/rpg-*` e checklist) e **`docs/FLUXO_MULTI_AGENT.md`** (diagrama, tabela de prompts coláveis, troubleshooting); regra Cursor `.cursor/rules/bot-rpg-multi-agent.mdc` com `alwaysApply: true` lembrando leitura de `AGENTS.md`, índice, `PROJECT_PHASE` e último handoff.
- **Consequências:** Novos colaboradores usam `@AGENTS.md` + cópia de prompt; estado continua em `handoffs/M*/` e `decisions/`. Se o repo crescer além do bot, revisar `alwaysApply` ou usar globs.

### ADR-004 — Invocação por `/` (comandos de projeto)

- **Status:** aceita (atualizado)
- **Contexto:** Evitar copiar Markdown manualmente; `/rpg-session` não aparecia de forma confiável como Skill em algumas builds.
- **Decisão:** Comandos em **`.cursor/commands/*.md`** (`rpg-session`, `rpg-bootstrap`, `rpg-product`, `rpg-bot-copy`, `rpg-analyst`, `rpg-dev`, `rpg-tech-lead`, `rpg-fluxo-mvp`). `rpg-bootstrap` é alias do mesmo prompt de contexto inicial que `rpg-session`. **Skills em `.cursor/skills/`** (ex.: `bot-rpg-dev`) são **opcionais** e complementam o agente em tarefas de código — **não** duplicam a invocação por `/` nem o texto dos comandos; listagem operacional continua em `.cursor/commands/` e `docs/prompts/`.
- **Consequências:** Usuário digita `/rpg-dev` (etc.) e em seguida o pedido; `docs/prompts/` permanece como alternativa. Depende do Cursor indexar `.cursor/commands/` do workspace aberto. Quem quiser workflow extra no IDE pode anexar ou confiar na skill de projeto em `.cursor/skills/bot-rpg-dev/`.

### ADR-007 — Vigor (atributo), Energia (status), PER e raciais

- **Status:** aceita (parcialmente **supersedida** em criação/MVP por **ADR-009** — ver abaixo)
- **Contexto:** PRODUCT + owner: vigor como atributo; status Energia; PER comunicada sem mecânica no MVP; números Drakari/Valtherin; UI (progresso, blurbs, lista vertical).
- **Decisão:** Coluna recurso `vigor` → **`energy` (Energia)**; **`vigor_attribute`** para atributo Vigor; **14 pontos** em 7 atributos; Energia = `base.energy + VIT + RES + floor(VIG/2) + bônus`; Sylvari **−1 VIG** atributo; Orcano **+2 Energia**; Human **+1** nos 7 atributos; Drakari/Valtherin conforme `docs/MODULES.md` e `racial-modifiers.ts`; copy em `bot.copy.ts` + UI em `bot.presenter.ts` / `bot.service.ts`.
- **Consequências:** Migração `20260502120000_energy_vigor_attribute`; linhas antigas ganham `vigor_attribute` default 8 — pode exigir recriar personagem para coerência visual.

### ADR-009 — MVP rebalance: 6 atributos, sem PER, sem pontos na criação, Energia 20 fixa

- **Status:** aceita
- **Contexto:** PRODUCT (`handoffs/M1/2026-05-02-product-remove-per-balance.md`): simplificar criação, remover Percepção do domínio, eliminar etapa de distribuição inicial, rebalancear raças/classes, Energia constante para economia futura.
- **Decisão:** **6 atributos** persistidos (sem `perception`); criação com base **10** + somente bônus raciais; **`attribute_points_remaining`** na criação = **0**; fluxo do jogador **`CLASS → RACE → NAME → CONFIRM`** (valores do enum `CreationStep` reutilizados; primeiro passo persistido = `CLASS`); **Energia** na finalização = **20** sempre; HP/Mana/Stamina = bases de classe em `class-bases.ts` + fórmula sobre atributos finais (sem PER, sem bônus racial a recursos); enum `CreationStep` sem `ATTRIBUTES`; raças numéricas conforme handoff / `racial-modifiers.ts`.
- **Consequências:** Migração `20260502140000_mvp_rebalance_no_per`; personagens antigos perdem coluna PER e podem ter HP/mana/stamina desatualizados até recriação ou script de correção; level up (pontos por nível) permanece pendente de produto.

### ADR-010 — Orçamento racial fixo de 12 pontos (MVP)

- **Status:** aceita
- **Contexto:** Dono/PRODUCT: raças não devem depender de distribuição pelo usuário, mas devem ter perfis mais diferenciados; “12 pontos” de bônus racial fixos por raça, balanceados pelo jogo.
- **Decisão:** Cada `Race` aplica modificadores cuja **soma líquida** nos 6 atributos é exatamente **12** (`RACIAL_POINT_BUDGET_MVP`), somados **sobre** os primários já alterados pela classe (ver **ADR-012**; antes da ADR-012 a base numérica era 10 em cada atributo). Tabela em `racial-modifiers.ts` + `docs/MODULES.md`. Validação em tempo de carga do módulo garante soma 12 por raça.
- **Consequências:** Personagens já criados antes da mudança mantêm atributos persistidos antigos até recriação ou migração dedicada; HP/Mana/Stamina derivados mudam para **novos** personagens. Rebates finos de combate/meta exigem revisão após playtest.

### ADR-008 — Aprovação de handoff e fronteira de código (PRODUCT / ANALYST / design)

- **Status:** aceita
- **Contexto:** Dono do repositório quer revisar handoffs antes de persistência e impedir que agents não-desenvolvimento alterem implementação.
- **Decisão:** (1) Todo agent apresenta o handoff completo no chat (`AGENTS.md` §6) e **só grava** em `handoffs/<M>/` (marco em `index/PROJECT_PHASE.md`) **após aprovação explícita** do dono. (2) **PRODUCT_AGENT**, **ANALYST_AGENT** e personas de **design/copy** (ex.: BOT_COPY) **não editam** código nem artefatos listados em `AGENTS.md` §7.1; entregam especificações e propostas de texto para **DEVELOPMENT_AGENT**.
- **Consequências:** `AGENTS.md`, regra Cursor, comandos `/rpg-*`, `docs/prompts/` e guias (`COMO-USAR`, `FLUXO_MULTI_AGENT`, `PROMPT_NOVO_CHAT`) atualizados para refletir o fluxo e a fronteira.

### ADR-011 — Atributos secundários derivados (MVP display)

- **Status:** aceita
- **Contexto:** `handoffs/M1/2026-05-02-product-secondary-stats-derived.md`: 11 stats de combate/utilidade; jogador não aloca pontos neles no level up; evolução indireta via primários + futuros itens/buffs (M2+).
- **Decisão:** Secundários **não são colunas Prisma** no MVP; calculados em `deriveSecondaryStats(CoreAttrs)` sobre atributos **finais** já persistidos (pós-racial na criação; pós-level up no futuro). **Sorte** = `0` a partir de primários até economia/loot. **Crit** (`critChanceScore`, `critDamageScore`) são **índices inteiros** até o combate (M4) definir % e caps. Fórmulas v1 (inteiros, `attrs` = CoreAttrs):
  - `physicalAttack` = `strength + floor(dexterity/2)`
  - `magicalPower` = `intelligence + floor(vigorAttribute/2)`
  - `defense` = `vitality + resilience + floor(strength/2)`
  - `magicDefense` = `resilience + intelligence + floor(vitality/2)`
  - `critChanceScore` = `dexterity + floor(vigorAttribute/2)`
  - `critDamageScore` = `strength + intelligence`
  - `accuracy` = `dexterity + floor(intelligence/2)`
  - `evasion` = `dexterity + vigorAttribute`
  - `physicalPenetration` = `floor(strength/2) + dexterity`
  - `magicalPenetration` = `floor(intelligence/2) + vigorAttribute`
  - `luck` = `0`
- **Consequências:** Modificadores de equipamento somam em camada futura (`+ bonus` sobre o resultado ou sobre sub-totais — a fechar em M2). Reb balance após playtest; UI em `bot.presenter.ts` + rótulos em `bot.labels.ts`.

### ADR-012 — Criação em camadas: atributos 0, classe +10, raça +12; recursos só da fórmula

- **Status:** aceita (ajusta UX e coerência “atributos → recursos”; **substitui em parte** a criação descrita em ADR-009 / texto antigo em MODULES sobre “base 10” e “bases HP/Mana/Stamina por classe”).
- **Contexto:** Dono: ficha começa vazia (zeros); classe e raça somam atributos diferentes; não exibir recursos na escolha de classe; após raça mostrar cálculo completo; HP/Mana/Stamina devem fazer sentido como derivados dos atributos, não como números fixos desconectados de primários iguais.
- **Decisão:** `ATTR_CREATION_BASE = 0`. Pacote fixo de **10 pontos** nos 6 primários por `CharacterClass` (`class-modifiers.ts`, soma validada em carga). `setClass` persiste primários pós-classe. `setRace` aplica `applyRacial` sobre esses valores (ADR-010 mantido: **12 pontos** líquidos por raça). `CLASS_BASES` hp/mana/stamina = **0** para todas as classes; `deriveHpManaStamina` usa só fórmula + parcela zero. **Energia** segue **20** na finalização. UI: passo classe só atributos de classe; passo raça revela recursos + secundários derivados.
- **Consequências:** Personagens antigos já finalizados não são migrados automaticamente para a nova curva; playtest obrigatório; rebalance fino de `class-modifiers` e fórmulas de recurso se combates M4 exigirem piso de HP/mana.

---

*Adicionar novos ADRs ao final; não reescrever histórico.*
