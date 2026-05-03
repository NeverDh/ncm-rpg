# HANDOFF

## Agent
DEVELOPMENT_AGENT

## Objetivo
Decisões do owner aplicadas: **Vigor = atributo** (`vigor_attribute`), **Energia = status** (coluna `energy`, ex-`vigor`); **PER** só comunicação no MVP; **Drakari/Valtherin** com números revisados; **14 pontos / 7 atributos**; UI PRODUCT (barra de progresso, lista vertical de atributos, blurbs de raça/classe, linha PER).

## Arquivos afetados
- `prisma/schema.prisma`, `prisma/migrations/20260502120000_energy_vigor_attribute/migration.sql`
- `src/modules/character/character.constants.ts`, `character.service.ts`, `class-bases.ts`, `racial-modifiers.ts`
- `src/bot/bot.copy.ts`, `bot.labels.ts`, `bot.presenter.ts`, `bot.service.ts`
- `docs/MODULES.md`, `docs/fluxos/mvp-personagem.md`, `AGENTS.md`, `architecture/ARCHITECTURE.md`, `decisions/DECISIONS.md` (ADR-007)

## Decisões tomadas
- Human: +1 em todos os 7 atributos (incl. VIG e PER).
- Sylvari: −1 **atributo Vigor**; +3 INT; +2 mana (status).
- Orcano: +3 FOR, −1 INT, +2 Energia (status).
- Drakari / Valtherin: valores em `MODULES` + `racial-modifiers.ts` (ADR-007).

## Pendências
- Rodar `npx prisma migrate deploy` / `generate` em outros ambientes; personagens legados podem precisar ser recriados para coerência de VIG.
- Fase “B” (fórmulas mais profundas / uso de PER) quando o owner priorizar.

## Riscos identificados
- Humano com +1 em 7 atributos é muito forte no MVP — monitorar feedback.

## Próximo agente recomendado
- ANALYST_AGENT — curvas finas; PRODUCT — copy medieval extra.
