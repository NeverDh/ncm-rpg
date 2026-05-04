# HANDOFF

## Agent

PRODUCT_AGENT + TECH_LEAD_AGENT

## Objetivo

Fechar análise M2 (escopo, UX mínima, camada de stats com equipamento) e registar em documentação e ADR.

## Arquivos afetados

- `docs/MODULES.md` — secção M2 expandida (dentro / fora de escopo).
- `decisions/DECISIONS.md` — **ADR-013** (aceita).
- `index/PROJECT_INDEX.md` — estado M2 com referência a ADR-013.
- `architecture/ARCHITECTURE.md` — referência M2 + ADR-013 em `modules/*`.

## Decisões tomadas

- **M2:** bolsa + equipar/desequipar; **quatro slots:** Arma, Armadura, Amuleto, Anel; catálogo de sistema; raridade como metadado de UI; **sem** ação “usar consumível” com efeito; **sem** loja/moeda.
- **Bônus de equipamento (M2):** apenas modificadores **flat nos 6 primários**; `CoreAttrs` **efetivo** = persistido + soma dos equipados, usado **só em leitura** para `deriveSecondaryStats` / recursos; **não** persistir primários inflados.
- **Fora de M2:** bônus diretos em secundários ou Sorte por item (rever com M3/M4 + ADR).

## Pendências

- Wireframe opcional `docs/fluxos/m2-inventario.md` (mensagem a mensagem).
- Implementação: módulo `inventory/`, Prisma, bot — **DEVELOPMENT_AGENT**; copy — **BOT_COPY_AGENT**.

## Riscos identificados

- Paginação e FSM no Telegram exigem desenho fino na implementação para evitar callbacks ambíguos e mensagens longas.

## Próximo agente recomendado

BOT_COPY_AGENT → DEVELOPMENT_AGENT

## Aprovação

Handoff aprovado pelo dono no chat: **ok** (2026-05-03).
