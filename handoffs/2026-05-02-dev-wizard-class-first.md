# HANDOFF

## Agent
DEVELOPMENT_AGENT

## Objetivo
Inverter a ordem do fluxo de criação da M1 para **classe → raça → nome → confirmar**, fechando a M1 com a prioridade de escolha de classe antes da raça.

## Arquivos afetados
- `src/modules/character/character.service.ts` — `startNewDraft` inicia em `CLASS`; `setClass` avança para `RACE`; `setRace` avança para `NAME`
- `src/bot/bot.service.ts` — `wizard:create` com `classKeyboard`; handlers `class:*` / `race:*` e `replyForStep` alinhados à nova ordem
- `src/bot/bot.copy.ts` — passos 1/4 e 2/4; `WIZARD_CLASS_NEXT` (substitui CTA antiga pós-raça)
- `docs/MODULES.md` — ordem dos passos no MVP
- `docs/fluxos/mvp-personagem.md` — passos 2 e 3 do fluxo conversacional
- `AGENTS.md` — charter §8 (ordem classe → raça)
- `index/PROJECT_INDEX.md`, `index/AGENT_DESIGN_BOT_TELEGRAM.md` — referência ao fluxo
- `decisions/DECISIONS.md` — ADR-009: texto do fluxo do jogador `CLASS → RACE → NAME → CONFIRM`

## Decisões tomadas
- **Sem migração Prisma:** reutiliza valores de `CreationStep`; apenas a ordem das transições e o passo inicial mudam.
- **Retomada (`replyForStep` em `RACE`):** prefixo `⚔ Classe: …` quando `characterClass` já está definido.

## Pendências
- Rascunhos **antigos** (fluxo raça-first) podem ficar inconsistentes; orientar `/start` + novo “Criar personagem” se algo falhar.
- Opcional: **BOT_COPY** para afinar blurbs com “classe primeiro”.

## Riscos identificados
- Usuários com `creation_step` legado no meio do wizard antigo sem classe escolhida podem chegar a `NAME` sem classe após confusão de estado.

## Próximo agente recomendado
- **PRODUCT_AGENT** — validar UX; **BOT_COPY** — polish de texto se necessário.
