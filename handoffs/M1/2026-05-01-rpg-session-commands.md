# HANDOFF

## Agent
DEVELOPMENT_AGENT

## Objetivo
Corrigir `/rpg-session` ausente no menu `/`: migração de **Skills** (`.cursor/skills/`) para **comandos de projeto** em `.cursor/commands/*.md`; adicionado **`/rpg-bootstrap`** como alias do mesmo fluxo de contexto inicial.

## Arquivos afetados
- .cursor/commands/rpg-session.md (novo)
- .cursor/commands/rpg-bootstrap.md (novo)
- .cursor/commands/rpg-product.md … rpg-fluxo-mvp.md (novos)
- Removido `.cursor/skills/` (SKILL.md de cada agente)
- AGENTS.md, docs/FLUXO_MULTI_AGENT.md, docs/prompts/README.md, decisions/DECISIONS.md (ADR-004), .cursor/rules/bot-rpg-multi-agent.mdc

## Decisões tomadas
- Fonte única para `/rpg-*`: `.cursor/commands/` (compatível com listagem `/` em mais builds).
- `rpg-bootstrap` duplica instruções de `rpg-session` para contornar nomes filtrados.

## Pendências
- Usuário: **Reload Window** após pull se comandos não listarem.

## Riscos identificados
- Algumas versões do Cursor podem diferir entre Agent Chat e Composer quanto a comandos customizados.

## Próximo agente recomendado
- Qualquer `/rpg-*` conforme tarefa.
