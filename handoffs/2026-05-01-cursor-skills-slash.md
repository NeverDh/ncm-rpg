# HANDOFF

## Agent
DEVELOPMENT_AGENT

## Objetivo
Substituído o fluxo “copiar MD” como forma principal: criados **Cursor Skills** em `.cursor/skills/` com `disable-model-invocation: true` para invocação via **`/rpg-*`** no Agent Chat; documentação atualizada (`AGENTS.md`, `FLUXO_MULTI_AGENT.md`, `PROJECT_INDEX`, `docs/prompts/README`, regra `.mdc`); ADR-004 registrado.

## Arquivos afetados
- .cursor/skills/rpg-session/SKILL.md
- .cursor/skills/rpg-product/SKILL.md
- .cursor/skills/rpg-analyst/SKILL.md
- .cursor/skills/rpg-dev/SKILL.md
- .cursor/skills/rpg-tech-lead/SKILL.md
- .cursor/skills/rpg-fluxo-mvp/SKILL.md
- AGENTS.md
- docs/FLUXO_MULTI_AGENT.md
- docs/prompts/README.md
- index/PROJECT_INDEX.md
- decisions/DECISIONS.md (ADR-004)
- .cursor/rules/bot-rpg-multi-agent.mdc
- handoffs/2026-05-01-cursor-skills-slash.md

## Decisões tomadas
- Skills seguem spec Cursor (`name` = pasta; `disable-model-invocation: true` para comportamento tipo comando explícito).
- `rpg-fluxo-mvp` orquestra MVP Feature 1 com escape por pedido do usuário (“só uma fase”).

## Pendências
- Validar na sua versão do Cursor se os skills aparecem em `/` (Settings → Rules → Skills); se não aparecer, atualizar Cursor ou usar `/migrate-to-skills` conforme docs.

## Riscos identificados
- Versões antigas do Cursor podem não listar skills da mesma forma.

## Próximo agente recomendado
- `/rpg-fluxo-mvp` ou `/rpg-dev` para scaffold NestJS após gate TECH_LEAD.
