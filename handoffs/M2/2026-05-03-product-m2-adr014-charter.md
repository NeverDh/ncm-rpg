# HANDOFF

## Agent

PRODUCT_AGENT (charter documentado) + registo técnico em **ADR-014** (TECH_LEAD / decisões)

## Objetivo

Registrar refinamento M2 pedido pelo dono: bolsa única 20 slots sem filtro; 9 slots de equipamento (arma, peitoral/elmo/bota/calça, 2 anéis, colar, cinto); equipar só pelo menu do inventário; cinco tipos de item; consumíveis usáveis (cura HP / recuperar mana) só fora de combate; cinco raridades. Atualizar índice e arquitetura.

## Arquivos afetados

- `docs/MODULES.md` — secção M2 reescrita.
- `decisions/DECISIONS.md` — **ADR-014** (aceita); **ADR-013** nota de supersedência parcial (UI bolsa/slots/consumíveis).
- `index/PROJECT_INDEX.md` — linha M2 com ADR-013 + ADR-014.
- `architecture/ARCHITECTURE.md` — referência ADR-014 em `modules/*`.

## Decisões tomadas

- Bolsa: uma por personagem, 20 slots fixos M2, sem filtro de tipo na UI.
- Equipamento: 9 slots conforme tabela em `docs/MODULES.md`; equipar/desequipar apenas pelo menu do inventário.
- Tipos de item desde M2: arma, armadura, consumível, material, item de missão.
- Consumíveis: uso em M2 com efeitos simples (cura vida, recuperação mana); proibição de uso em combate quando M4 existir (guard no domínio).
- Raridade: comum, incomum, raro, épico, lendário.
- **Mantido de ADR-013:** bônus de equip só em primários flat; `CoreAttrs` efetivo em leitura; sem bônus direto em secundários/Sorte por item em M2.

## Pendências

- **DEV:** schema Prisma (enums, bolsa 20 células vs. capacidade+stack), módulo `inventory/`, fluxo Telegram, `useConsumable` + clamp HP/mana.
- **PRODUCT/BOT_COPY (opcional):** `docs/fluxos/m2-inventario.md` e strings no bot.
- Clarificar implementação “20 slots” (uma linha `InventorySlot` 1–20 vs. outro modelo) no primeiro PR de inventário.

## Riscos identificados

- Consumível + persistência de HP/mana: evitar ultrapassar máximo derivado; alinhar com `Character` persistido após uso.

## Próximo agente recomendado

BOT_COPY_AGENT (copy inventário / consumível / raridade) → DEVELOPMENT_AGENT (implementação)

## Aprovação

Handoff solicitado pelo dono: **faça o handoff** (2026-05-03).
