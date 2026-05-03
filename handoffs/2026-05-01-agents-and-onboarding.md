# HANDOFF

## Agent
DEVELOPMENT_AGENT

## Objetivo
Criados artefatos para consumo do fluxo multi-agent em **qualquer chat novo**, sem dependência de conversas anteriores: `AGENTS.md` (fonte única), `docs/FLUXO_MULTI_AGENT.md`, prompts copiáveis em `docs/prompts/`, regra Cursor `.cursor/rules/bot-rpg-multi-agent.mdc` (`alwaysApply`), e atualização do `index/PROJECT_INDEX.md` para apontar o fluxo.

## Arquivos afetados
- AGENTS.md
- docs/FLUXO_MULTI_AGENT.md
- docs/prompts/README.md
- docs/prompts/INICIO-SESSAO.md
- docs/prompts/PRODUCT_AGENT.md
- docs/prompts/ANALYST_AGENT.md
- docs/prompts/DEVELOPMENT_AGENT.md
- docs/prompts/TECH_LEAD_AGENT.md
- .cursor/rules/bot-rpg-multi-agent.mdc
- index/PROJECT_INDEX.md
- decisions/DECISIONS.md (ADR-003)
- handoffs/2026-05-01-agents-and-onboarding.md

## Decisões tomadas
- Estado e processo passam a viver no repositório (AGENTS + handoffs + decisões); prompts usam marcações `---COPIAR DAQUI---` para reduzir erro de cópia.
- Uma regra `alwaysApply` enxuta reforça leitura de `AGENTS.md` e último handoff em todo trabalho no repo (aceitável dado escopo atual só deste projeto).
- ADR-003 em `decisions/DECISIONS.md` formaliza o fluxo chat-novo + regra Cursor.

## Pendências
- Opcional: regras `.mdc` separadas por agente com `alwaysApply: false` se o time quiser escolher no rule picker sem depender só dos arquivos em `docs/prompts/`.
- Registrar no primeiro ADR de tooling se a equipe preferir `alwaysApply: false` para a regra global.

## Riscos identificados
- `alwaysApply: true` pode ser redundante se o repositório for reusado como monorepo misto; nesse caso desligar ou restringir globs.

## Próximo agente recomendado
- PRODUCT_AGENT (wireframes do MVP personagem) ou TECH_LEAD_AGENT (aprovação de scaffold e dependências).
