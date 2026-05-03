# Fluxo pronto — projeto completo por marcos (`/rpg-fluxo-mvp`)

**Nome do comando:** `/rpg-fluxo-mvp` (mantido por compatibilidade). Orquestra o **pipeline de personas** para **cada marco M1→M5** até fechamento do roadmap em `docs/MODULES.md`. O **lançamento público** do bot/jogo está previsto **após M1…M5 concluídos** — ver `index/PROJECT_PHASE.md`.

## Contexto obrigatório

1. `AGENTS.md`, `index/PROJECT_INDEX.md`, **`index/PROJECT_PHASE.md`** (pasta de handoffs do marco ativo).
2. **Último** ficheiro em `handoffs/<MARCO_ATIVO>/` (ordenar pelo nome; ex.: `handoffs/M1/*.md`).
3. `architecture/ARCHITECTURE.md`, `docs/MODULES.md`, `decisions/DECISIONS.md` se houver mudança estrutural.

## Como interpretar o pedido do usuário

- **“Só Mx”** ou **“só inventário”** / **“só M2”**: execute o bloco **desse marco** (PRODUCT → BOT_COPY → ANALYST → TECH_LEAD cond. → DEV) sem repetir M1–M5 inteiros.
- **“Fluxo completo”** ou sem especificar: percorra **M1 a M5** em ordem; cada marco numa secção clara; se o volume for excessivo, faça M1 agora e liste o que falta.
- **“Só wireframe” / “só copy” / “só bot”** dentro de um M: mapeie para PRODUCT, BOT_COPY ou DEV conforme `AGENTS.md` §5.

## Sequência por marco (repetir o padrão em cada M)

Para **cada** marco abaixo, na ordem:

1. **PRODUCT** — UX Telegram, estados, critérios de aceite; docs em `docs/` ou `docs/fluxos/` quando fizer sentido (M1: `docs/fluxos/m1-personagem.md`).
2. **BOT_COPY** — tom, blurbs, labels (`index/AGENT_DESIGN_BOT_TELEGRAM.md`); entrega para DEV **sem** editar `src/`.
3. **ANALYST** — riscos, acoplamento com módulos já existentes e futuros.
4. **TECH_LEAD** — só se houver dependências novas, mudança de boundaries ou infra (Redis, etc.); senão uma linha: **gate dispensado**.
5. **DEVELOPMENT** — NestJS, Prisma, Telegraf conforme `architecture/ARCHITECTURE.md`.

### M1 — Personagem (Telegram)

Criação e visualização: classe → raça → nome → confirmar → menu; domínio `character` + bot. Charter: `AGENTS.md` §8, detalhe de fluxo: `docs/fluxos/m1-personagem.md`.

### M2 — Inventário e itens

Inventário, equipamentos, itens, slots — ver `docs/MODULES.md` secção M2. Respeitar fronteira com `character` (referência por ID).

### M3 — Economia

Comércio, moedas, lojas — ver `docs/MODULES.md` secção M3.

### M4 — Combate e aventura

PvE/PvP, aventuras — ver `docs/MODULES.md` secção M4. Secundários/crit até aqui podem evoluir de “índices” para regras de combate.

### M5 — Sociais e mundo

Guildas, quests, mundo — ver `docs/MODULES.md` secção M5.

## Encerramento

Handoff = `AGENTS.md` §6 + `index/PROJECT_PHASE.md` + `handoffs/README.md`. Atualize ADRs se o TECH_LEAD tiver decidido algo novo. Sem código para PRODUCT/BOT_COPY/ANALYST: `AGENTS.md` §7.1.

## Mensagem do usuário

Execute em seguida o que o utilizador escreveu junto com `/rpg-fluxo-mvp` (objetivo, “fluxo completo”, “só M2”, etc.).
