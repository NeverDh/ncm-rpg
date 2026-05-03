# HANDOFF

## Agent
DEVELOPMENT_AGENT (implementação conforme especificação BOT_COPY aprovada pelo dono)

## Objetivo
Harmonizar copy e layout textual do fluxo de criação até a confirmação da ficha: passos **1/4–4/4**, regras horizontais (`SECTION_RULE`), telas pós-raça/pós-classe alinhadas à confirmação, ficha final com mesma gramática de seções, botões de confirmação mais claros, respiro entre barras de recurso.

## Arquivos afetados
- `src/bot/bot.copy.ts` — `SECTION_RULE` exportado; mensagens do wizard, menu, welcome, `MVP_PROGRESSION_NOTE`, prefixo pós-criação; blurbs Humano suavizado
- `src/bot/bot.presenter.ts` — `formatDraftConfirm`, `formatSheet`, `formatStatusEmojiBlock` (`\n\n` entre recursos), `confirmKeyboard`
- `src/bot/bot.service.ts` — templates após `race:` e `class:`

## Decisões tomadas
- Progresso explícito **Passo X/4** (Origem, Classe, Nome, Confirme a ficha).
- **Uma** constante `SECTION_RULE` em `bot.copy.ts` reutilizada no presenter e nas strings que embutem a regra no service.
- Confirmação: **Ajuste racial** (label); blocos Atributos / Recursos (prévia) separados por regra.
- Botões: **Salvar herói** / **Mudar nome** (callbacks inalterados).
- `MVP_PROGRESSION_NOTE` condensada com prefixo ℹ️ único (sem segundo ℹ️ no presenter).

## Pendências
- Validar comprimento das mensagens no Telegram real (edit vs reply).
- Ajuste fino de tom (“herói” vs “personagem”) se o dono preferir.

## Riscos identificados
- Mensagens mais longas podem aumentar falhas pontuais de `editMessageText` (já existe fallback no confirm).

## Próximo agente recomendado
- **PRODUCT_AGENT** — smoke test de UX; **BOT_COPY** — microajustes de densidade se necessário.
