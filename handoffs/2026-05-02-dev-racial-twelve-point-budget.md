# HANDOFF

## Agent
DEVELOPMENT_AGENT

## Objetivo
Implementar orçamento racial fixo de **12 pontos** por raça (distribuição definida pelo jogo, sem alocação pelo jogador na criação), alinhar docs/ADR/copy do bot e validar soma dos modificadores em tempo de carga.

## Arquivos afetados
- `src/modules/character/character.constants.ts` — `RACIAL_POINT_BUDGET_MVP = 12`
- `src/modules/character/racial-modifiers.ts` — tabela por raça (soma líquida 12) + assert por `Race`
- `docs/MODULES.md` — tabela raciais + texto do orçamento
- `docs/fluxos/mvp-personagem.md` — menção aos 12 pts fixos
- `decisions/DECISIONS.md` — **ADR-010**
- `docs/PROMPT_NOVO_CHAT.md` — referência ADR-010
- `src/bot/bot.copy.ts` — blurbs, `MVP_PROGRESSION_NOTE`, `WIZARD_RACE_INTRO`

## Decisões tomadas
- **Base 10** universal no rascunho; **+12 líquidos** de modificadores raciais por raça (perfil diferenciado; Humano +2 em cada atributo).
- **Validação:** falha na inicialização se alguma raça não somar exatamente 12 nos seis atributos.
- **Poder:** soma de atributos na criação passa a **72** (antes do rebalance anterior era 62 com +2 líquido); HP/Mana/Stamina derivados sobem para **novos** personagens; persistidos antigos não são migrados automaticamente.

## Pendências
- Playtest / ajuste fino de combinações raça × classe após subida de atributos.
- Política para personagens já criados (recriar, script de recálculo ou manter legado).
- Level up (pontos por nível) continua pendente de produto.

## Riscos identificados
- Bump de poder pode exigir revisão de `class-bases` / fórmulas se o combate MVP chegar “muito fácil”.
- Documentação histórica em handoffs antigos ainda pode citar tabela racial +2 — priorizar `MODULES.md` + ADR-009/010 como fonte.

## Próximo agente recomendado
- **PRODUCT_AGENT** — validar feel e textos após teste no Telegram.
- **TECH_LEAD_AGENT** — opcional, se houver migração de dados ou mudança de fórmula global.
