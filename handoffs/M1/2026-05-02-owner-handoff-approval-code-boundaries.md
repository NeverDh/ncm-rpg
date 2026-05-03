# HANDOFF

## Agent
DEVELOPMENT_AGENT (política multi-agent solicitada pelo dono)

## Objetivo
Registrar para todos os agents: (1) alterações documentais anteriores (`index/CODEBASE_INDEX.md`, `AGENTS_ECOSYSTEM.md`, `AGENT_DESIGN_BOT_TELEGRAM.md`) citadas na §2 de `AGENTS.md`; (2) **handoff só persiste em `handoffs/` após aprovação explícita do dono** (fluxo §6); (3) **PRODUCT, ANALYST e design/copy não editam código** nem artefatos de implementação (`AGENTS.md` §7.1).

## Arquivos afetados
- `AGENTS.md` — §2 leitura, personas (PRODUCT/ANALYST + design), §6 fluxo handoff, nova §7 permissões/código, §9 handoff
- `.cursor/rules/bot-rpg-multi-agent.mdc`
- `.cursor/commands/rpg-product.md`, `rpg-analyst.md`, `rpg-dev.md`, `rpg-tech-lead.md`, `rpg-fluxo-mvp.md`, `rpg-session.md`, `rpg-bootstrap.md`
- `docs/prompts/PRODUCT_AGENT.md`, `ANALYST_AGENT.md`, `DEVELOPMENT_AGENT.md`, `TECH_LEAD_AGENT.md`, `INICIO-SESSAO.md`
- `docs/COMO-USAR-AGENTS.md`, `docs/FLUXO_MULTI_AGENT.md`, `docs/PROMPT_NOVO_CHAT.md`
- `index/PROJECT_INDEX.md`, `index/AGENTS_ECOSYSTEM.md`, `index/AGENT_DESIGN_BOT_TELEGRAM.md`
- `decisions/DECISIONS.md` — ADR-008

## Decisões tomadas
- ADR-008 formaliza aprovação de handoff e fronteira de código.
- DEV/TECH_LEAD permanecem responsáveis por implementação em `src/`, Prisma, `package.json`, etc.

## Pendências
- Incluir `/rpg-bot-copy` (opcional) alinhado a `AGENT_DESIGN_BOT_TELEGRAM.md` se o dono quiser comando dedicado.

## Riscos identificados
- Agents podem ainda tentar gravar `handoffs/` sem aprovação se o modelo ignorar o prompt; o dono pode reforçar na mensagem: "só grave handoff se eu aprovar".

## Próximo agente recomendado
- Dono (revisar política) ou **DEVELOPMENT_AGENT** em tarefas de código após spec aprovada.
