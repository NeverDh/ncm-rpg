# HANDOFF

## Agent
DEVELOPMENT_AGENT (com alinhamento TECH_LEAD / PRODUCT implícito no pedido do dono)

## Objetivo
Implementar criação em **camadas**: atributos começam em **0**; **classe** soma pacote fixo de **10** pontos nos 6 primários; **raça** soma **+12** líquidos em cima dos valores pós-classe; **Vida/Mana/Stamina** vêm só da **fórmula** sobre primários finais (bases numéricas de recurso por classe = **0**); **Energia** = **20** na finalização. UI: passo **classe** sem recursos; após **raça**, mensagem com atributos finais, recursos (barras) e secundários. Documentação: **ADR-012**, `docs/MODULES.md`, `ADR-010` (contexto), `docs/PROMPT_NOVO_CHAT.md`.

## Arquivos afetados
- `src/modules/character/character.constants.ts` — `ATTR_CREATION_BASE = 0`, `CLASS_ATTR_POINT_BUDGET_MVP = 10`
- `src/modules/character/class-modifiers.ts` — **novo** (`CLASS_ATTR_MODIFIERS`, `applyClass`, validação de soma)
- `src/modules/character/class-bases.ts` — HP/Mana/Stamina **0** para todas as classes
- `src/modules/character/character.service.ts` — `setClass` persiste primários; `setRace` aplica `applyRacial` sobre rascunho; `finalize` deriva recursos sem reaplicar raça
- `src/modules/character/racial-modifiers.ts` — comentário de cabeçalho (camada sobre classe)
- `src/bot/bot.presenter.ts` — intro classe por atributos; `formatAfterClassChosenSummary`, `formatPostRaceReveal`, `formatDraftConfirm` sem bloco estático de recursos da classe
- `src/bot/bot.service.ts` — mensagens pós-`setClass` / `setRace` com novos formatadores
- `src/bot/bot.copy.ts` — blurbs de classe + `WIZARD_RACE_INTRO`
- `prisma/schema.prisma` — defaults **0** nos seis atributos
- `prisma/migrations/20260502180000_creation_zero_class_racial_layers/migration.sql` — **nova migração**
- `docs/MODULES.md` — tabela de classe, criação, status
- `decisions/DECISIONS.md` — **ADR-012**; ajuste de texto em **ADR-010**
- `docs/PROMPT_NOVO_CHAT.md` — referência ADR-012 e criação em camadas

## Decisões tomadas
- **ADR-012:** criação numérica e UX descritas acima; **substitui em parte** o texto de criação “base 10 + bases HP/Mana/Stamina por classe” (histórico permanece em ADR-009/010).
- Orçamento de **10** pontos por classe (simétrico em espírito ao **12** racial); tabela inicial: Bárbaro FOR+4 VIT+3 VIG+2 RES+1; Mago INT+5 RES+2 VIG+2 DES+1; Assassino DES+5 VIG+3 FOR+2.
- Raças: mantida tabela e validação **12** pts em `racial-modifiers.ts`.

## Pendências
- Rodar **`prisma migrate deploy`** (ou `migrate dev`) no ambiente com banco real.
- **Playtest** de combinações classe+raça (piso de HP/mana/stamina se necessário).
- Ajuste fino de **`class-modifiers.ts`** e/ou fórmulas em `deriveHpManaStamina` conforme balanceamento.

## Riscos identificados
- Personagens **já finalizados** não são recalculados automaticamente.
- Combinações podem gerar recursos **muito baixos** no nível 1 até rebalance.

## Próximo agente recomendado
- **PRODUCT_AGENT** — validar números e curva de jogo; **BOT_COPY_AGENT** — polimento de texto se quiser; **ANALYST_AGENT** — riscos pós-playtest.
