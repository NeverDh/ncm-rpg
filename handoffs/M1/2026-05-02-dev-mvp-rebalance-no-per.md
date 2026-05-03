# HANDOFF

## Agent
DEVELOPMENT_AGENT

## Objetivo
Implementar o MVP em modo único conforme `handoffs/M1/2026-05-02-product-remove-per-balance.md`: fluxo de criação **sem** etapa de distribuição de pontos; **PER** removido do domínio e do banco; raças/classes/números do handoff; **Energia = 20** fixa na finalização; remoção do fluxo antigo (atributos + PER).

## Arquivos afetados
- `prisma/schema.prisma`
- `prisma/migrations/20260502140000_mvp_rebalance_no_per/migration.sql`
- `src/modules/character/character.service.ts`
- `src/modules/character/character.constants.ts`
- `src/modules/character/character.derivation.ts` (novo)
- `src/modules/character/class-bases.ts`
- `src/modules/character/racial-modifiers.ts`
- `src/bot/bot.service.ts`
- `src/bot/bot.presenter.ts`
- `src/bot/bot.copy.ts`
- `src/bot/bot.labels.ts`
- `AGENTS.md` (charter §8)
- `architecture/ARCHITECTURE.md`
- `decisions/DECISIONS.md` (ADR-009; ADR-007 com nota de supersessão parcial)
- `docs/MODULES.md`
- `docs/fluxos/m1-personagem.md`
- `docs/PROMPT_NOVO_CHAT.md`
- `docs/prompts/BOT_COPY_AGENT.md`
- `index/PROJECT_INDEX.md`
- `index/CODEBASE_INDEX.md`
- `index/AGENT_DESIGN_BOT_TELEGRAM.md`

## Decisões tomadas
- **ADR-009** registra rebalance: 6 atributos, sem `perception`, sem `CreationStep.ATTRIBUTES`, base 10 + só racial na criação, `attribute_points_remaining` 0 na criação, Energia 20 em `finalize`.
- **Derivados** (HP/Mana/Stamina) centralizados em `character.derivation.ts` (`applyRacial`, `deriveHpManaStamina`) para reutilizar na confirmação e na persistência.
- **Migração** PostgreSQL: remove coluna `perception`, recria enum `CreationStep` sem `ATTRIBUTES`, normaliza rascunhos e `energy = 20` em personagens já completos (HP/Mana/Stamina legados não recalculados em SQL).

## Pendências
- Regra fechada de **level up** (pontos por nível, tetos por atributo).
- Opcional: script ou fluxo para **recalcular** HP/Mana/Stamina de personagens antigos ou orientar recriação.
- Melhoria de **visual/copy** das mensagens Telegram (BOT_COPY + presenter), se o dono priorizar.

## Riscos identificados
- Personagens **já completos** podem ficar com HP/Mana/Stamina desalinhados às novas fórmulas até recriação ou migração de dados.
- Handoffs antigos em `handoffs/` ainda descrevem fluxo com PER/14 pontos — podem confundir quem ler só histórico sem `DECISIONS.md` / ADR-009.

## Próximo agente recomendado
- **PRODUCT_AGENT** ou **`/rpg-bot-copy`** para design/copy das mensagens; depois **DEVELOPMENT_AGENT** para aplicar no presenter/copy.
- **TECH_LEAD_AGENT** se quiser revisão formal da migração e do ADR-009.
