# HANDOFF

## Agent
DEVELOPMENT_AGENT (+ síntese ANALYST / TECH_LEAD / BOT_COPY no mesmo ciclo)

## Objetivo
Implementar **atributos secundários** alinhados a `handoffs/2026-05-02-product-secondary-stats-derived.md`: 11 stats derivados dos 6 primários, sem persistência Prisma no MVP; exibição na **confirmação** e na **ficha**; **ADR-011** com fórmulas v1; `docs/MODULES.md` e fluxo atualizados.

## Arquivos afetados
- `src/modules/character/character.derivation.ts` — `SecondaryStats`, `SECONDARY_STAT_ORDER`, `deriveSecondaryStats`
- `src/bot/bot.labels.ts` — `SECONDARY_LABEL`
- `src/bot/bot.copy.ts` — `SECONDARY_STATS_NOTE`
- `src/bot/bot.presenter.ts` — `formatDraftConfirm`, `formatSheet`, helper `toCoreAttrs`
- `decisions/DECISIONS.md` — **ADR-011**
- `docs/MODULES.md` — secção secundários + menu
- `docs/PROMPT_NOVO_CHAT.md` — menção ADR-011
- `docs/fluxos/mvp-personagem.md` — passo confirmar + menu ficha

## Decisões tomadas (TECH_LEAD)
- **Sem migração Prisma:** secundários = função pura sobre `CoreAttrs` (atributos já persistidos).
- **Sorte** = `0` via primários até M3/M4 definirem fonte; equipamento somará depois.
- **Crit** como **índices inteiros** até combate definir % e caps.

## Pendências
- Playtest e rebalance das fórmulas v1 (ADR-011).
- M2: camada `+ bonus` (equip/buff) sem duplicar regra no handler Telegram.
- M4: converter índices de crítico em %; caps de esquiva/precisão/etc.

## Riscos identificados (ANALYST)
- Mensagem de **confirmação** mais longa (limite Telegram); monitorar `editMessageText`.
- Dois sistemas numéricos (primário vs secundário) exigem copy clara — mitigado com `SECONDARY_STATS_NOTE`.

## Próximo agente recomendado
- **PRODUCT_AGENT** — validar fórmulas v1 ou ajustar matriz.
- **BOT_COPY_AGENT** — enxugar nota se a ficha estiver densa.
