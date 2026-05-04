# HANDOFF

## Agent

TECH_LEAD + PRODUCT + ANALYST (síntese) + DEVELOPMENT (migração + dados locais)

## Objetivo

- Fechar decisão e documentação do **catálogo M2** (135 `item_definitions` por classe × slots × raridade).
- Aplicar migração `20260504140000_m2_class_gear_catalog` onde ainda pendente.
- **Dados de desenvolvimento:** anexar conjunto de exemplo ao personagem **NeverD** (Bárbaro) na bolsa — `gear_barb_*` (ambiente local do dono).

## Arquivos afetados

- `decisions/DECISIONS.md` — **ADR-015**
- `docs/MODULES.md` — secção “Catálogo de equipamento (M2)”
- `index/PROJECT_INDEX.md` — contagem de migrações (6)
- `index/CODEBASE_INDEX.md` — entrada da migração do catálogo
- `prisma/migrations/20260504140000_m2_class_gear_catalog/migration.sql` — já existente
- `handoffs/M2/2026-05-03-m2-class-gear-catalog-adr015.md` — este ficheiro

## Decisões tomadas

- **ADR-015:** convenção `gear_{barb|mage|assa}_{slot}_{rarity}`; 135 itens; bônus só primários (ADR-013); sem restrição de equipar por classe no M2; números provisórios até playtest.
- Catálogo inserido via migração com `ON CONFLICT (code) DO NOTHING`.

## Pendências

- Rebalance numérico após playtest (SQL/nova migração).
- Definir em M3+ o que entra em loja/loot vs. catálogo “template”.
- Outros ambientes: correr `npx prisma migrate deploy` e, se desejado, repetir attach de itens ao personagem de teste.

## Riscos identificados

- Migração grande (manutenção por diff).
- Itens na bolsa de NeverD são **só para dev local** — não versionados; outros clones não os têm.

## Próximo agente recomendado

- **PRODUCT** — se quiser restrição por classe ou textos de loja/drop.
- **DEVELOPMENT** — loot, loja M3, ou comando admin “dar item”.

## Nota operacional (NeverD)

Personagem `NeverD` (`characters.id` conhecido no ambiente onde foi executado): na **bolsa** (slots 6–14 após starter) itens `gear_barb_*` — machado + peitoral + elmo + botas + calça + dois anéis + colar + cinto (raridades mistas). Equipar pelo menu do bot.
