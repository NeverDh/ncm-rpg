# HANDOFF

## Agent
DEVELOPMENT_AGENT

## Objetivo
Aplicar no bot Telegram o pacote de copy/UX textual do fluxo de criação e ficha: tom mais claro, estrutura visual em blocos, mensagens de erro com próximo passo e reforço de escopo MVP (VIG como atributo e Energia fixa em 20).

## Arquivos afetados
- `src/bot/bot.copy.ts`
- `src/bot/bot.presenter.ts`
- `src/bot/bot.service.ts`

## Decisões tomadas
- Centralização das principais mensagens de fluxo em `bot.copy.ts` para evitar divergência entre caminhos de criação e retomada.
- Reestruturação da confirmação (`formatDraftConfirm`) com hierarquia visual (`✅`, `👤`, `🧬`, `📊`, `❤️`, `ℹ️`) e labels de barra por extenso (`Stamina`, `Energia`).
- Reestruturação da ficha (`formatSheet`) para leitura rápida no Telegram e reforço explícito de `Energia ... (fixo no MVP)`.
- Ajuste de prompts de nome para texto simples (sem `parse_mode: Markdown`) reduzindo risco de renderização.
- Padronização de mensagens de erro/ausência de estado (`draft`, personagem inexistente, opção inválida) com instrução de retorno via `/start`.

## Pendências
- Validar em chat real do Telegram a legibilidade final (quebra de linha, densidade e sensação de “mural” em telas menores).
- Se o owner quiser, rodar PRODUCT para calibrar ainda mais densidade do `/start` e do wizard (mais curto vs mais explicativo).

## Riscos identificados
- Pequena chance de ficar “verboso” em alguns passos para usuários recorrentes; pode pedir ajuste fino após uso real.
- Como as strings mudaram bastante, screenshots/docs antigas podem ficar desatualizadas até próxima revisão.

## Próximo agente recomendado
- PRODUCT_AGENT (opcional, apenas para afinar densidade e ordem das mensagens).
- DEVELOPMENT_AGENT (somente se houver feedback de uso para novo ajuste pontual).
