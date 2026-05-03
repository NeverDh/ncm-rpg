# Prompt para iniciar outro chat (continuidade)

Copie o bloco abaixo **inteiro** para um **chat novo** no Cursor (com o workspace `bot-rpg-telegram` aberto). Opcional: anexe `@AGENTS.md` ou `@index/PROJECT_INDEX.md`.

---

```
Continuo o projeto bot-rpg-telegram (RPG Telegram, NestJS + PostgreSQL + Prisma 5.x + Telegraf + Swagger).

Antes de codar: leia index/PROJECT_INDEX.md, **index/PROJECT_PHASE.md** (pasta de handoffs), **index/CODEBASE_INDEX.md** (árvore do repo — sempre), o handoff mais recente nessa pasta (ordenar pelo nome), architecture/ARCHITECTURE.md, docs/MODULES.md e decisions/DECISIONS.md se a tarefa mudar regras/stack.

Estado resumido:
- **Marco ativo:** ver **index/PROJECT_PHASE.md** (ex.: M2 inventário; M1 personagem **concluído** 2026-05-03, handoffs em `handoffs/M1/`). Roadmap M1→M5: docs/MODULES.md.
- ADR-007 + **ADR-009** + **ADR-010** + **ADR-011** + **ADR-012:** Vigor é atributo (`vigor_attribute`); status **Energia** = **20 fixo** em M1; **6 primários**; **11 secundários** derivados em `deriveSecondaryStats` (sem colunas Prisma em M1); criação **sem** o jogador distribuir pontos (**0** nos atributos + **10 pts** de pacote de **classe** + **12 pts** líquidos de **raça**; recursos derivados da fórmula). Ver `class-modifiers.ts`, `racial-modifiers.ts`, `class-bases.ts`, `docs/MODULES.md`.
- Comandos multi-agent no Agent Chat: /rpg-session ou /rpg-bootstrap, /rpg-product, /rpg-bot-copy, /rpg-analyst, /rpg-dev, /rpg-tech-lead, /rpg-fluxo-mvp (definições em .cursor/commands/).
- Passo a passo dos agents: docs/COMO-USAR-AGENTS.md
- Integração bot: docs/INTEGRACAO_TELEGRAM.md

Regras: sem regra de negócio pesada em handlers do bot; PRODUCT/ANALYST/design **não editam código** (AGENTS.md §7.1); handoff ao final: §6 **no chat** → **aprovação sua** → só então ficheiro em handoffs/<M>/ (ver index/PROJECT_PHASE.md).

Minha próxima tarefa:
[ESCREVA AQUI O QUE VOCÊ QUER]
```

---

Substitua a última linha pelo seu pedido. Para só “entrar no ritmo”, use: *“Resume pendências do último handoff e sugira próximo passo.”*
