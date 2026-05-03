# RPG — contexto inicial (`/rpg-session`)

Comando de projeto em `.cursor/commands/`. Use antes de uma tarefa grande ou em chat novo.

Faça **antes** de responder ao pedido que o usuário escrever na mesma mensagem (ou na seguinte):

1. Ler `AGENTS.md` na raiz do repositório (use a ferramenta de leitura de arquivos se necessário).
2. Ler `index/PROJECT_INDEX.md` e **`index/PROJECT_PHASE.md`** (marco ativo e pasta de handoffs).
3. Ler o arquivo mais recente na pasta indicada em **PROJECT_PHASE** (ex.: `handoffs/M1/*.md`, ordenar pelo nome do ficheiro).
4. **`docs/MODULES.md`** — ler se a tarefa for **técnica** (código, Prisma, bot, infra) **ou** se for **produto/copy** sobre regras de jogo, números, classes, raças, marcos M1–M5 (evitar inventar fora do doc).
5. **`architecture/ARCHITECTURE.md`** — ler se a tarefa for **técnica**.
6. **`decisions/DECISIONS.md`** — ler se o pedido **ou** o último handoff mencionar ADR, mudança de stack, dependência nova ou limites de módulo.

Resuma em 3–5 bullets o estado atual e as pendências visíveis nos handoffs. Em seguida execute o pedido do usuário seguindo `AGENTS.md`. Se o trabalho for substancial: **handoff** = `AGENTS.md` §6 + `index/PROJECT_PHASE.md` + `handoffs/README.md`. §7.1: PRODUCT/ANALYST/design **não** editam código.
