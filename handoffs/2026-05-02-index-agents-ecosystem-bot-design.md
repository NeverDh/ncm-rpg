# HANDOFF

## Agent
DEVELOPMENT_AGENT (indexação + documentação de design)

## Objetivo
Analisar o ecossistema multi-agent do repositório, indexar o projeto (excluindo `node_modules`) na pasta `index/` e criar design de agente para mensagens do bot Telegram alinhado ao MVP RPG.

## Arquivos afetados
- `index/CODEBASE_INDEX.md` (novo)
- `index/AGENTS_ECOSYSTEM.md` (novo)
- `index/AGENT_DESIGN_BOT_TELEGRAM.md` (novo — voz, restrições Telegram, checklist, persona BOT_COPY_AGENT)
- `index/PROJECT_INDEX.md` (links para os três documentos acima)

## Decisões tomadas
- Árvore documentada exclui também `dist/` e `.git/` como artefatos, além de `node_modules/` conforme pedido.
- Persona **BOT_COPY_AGENT** ficou como extensão documentada no design (prompt colável); não foi criado comando `/rpg-bot-copy` nem entrada em `AGENTS.md` §4 para não expandir processo oficial sem gate PRODUCT/TECH_LEAD.

## Pendências
- Opcional: adicionar `.cursor/commands/rpg-bot-copy.md` e linha em `AGENTS.md` se quiser persona oficial e slash dedicado.
- Opcional: espelhar prompt BOT_COPY em `docs/prompts/BOT_COPY_AGENT.md` para consistência com outros agents.

## Riscos identificados
- Duplicação futura se BOT_COPY for promovido sem atualizar `PROJECT_INDEX` e prompts.

## Próximo agente recomendado
- **PRODUCT_AGENT** — validar tom e checklist do `AGENT_DESIGN_BOT_TELEGRAM.md`; ou **DEVELOPMENT_AGENT** — aplicar copy pontual nos arquivos `src/bot/*`.
