# HANDOFF

## Agent
PRODUCT_AGENT

## Objetivo
Atualizar o design do MVP para remover o atributo **Percepção (PER)**, manter **Energia fixa em 20**, retirar distribuição de pontos da criação inicial (somente no level up) e rebalancear raças/classes para preservar consistência e escolhas viáveis.

## Arquivos afetados
- `docs/MODULES.md`
- `docs/fluxos/mvp-personagem.md`
- `decisions/DECISIONS.md` (novo ADR substituindo parte do ADR-007)
- (implementação futura pelo DEV) `src/modules/character/**`, `src/bot/**`, `prisma/schema.prisma` + migration

## Decisões tomadas
- **Atributos do MVP passam a 6:** FOR, DES, INT, VIT, RES, VIG.
- **PER removido** da criação, ficha e cálculo.
- **Criação inicial sem alocação de pontos:** jogador escolhe raça, classe, nome e confirma.
- **Distribuição de pontos só ao subir de nível** (feature separada de progressão).
- **Energia é fixa em 20** para todos os personagens, independente de raça/classe/atributos.
- Referência visual das telas deve considerar estilo do `examples/texto-exemplo.txt` (blocos, separadores, barras).

### Balanceamento proposto (MVP)
#### Base inicial (antes de raça)
- Todos os 6 atributos iniciam em **10**.

#### Raças (net balanceado, foco por identidade)
- **Humano:** `+1 FOR, +1 DES, +1 INT, -1 VIG`
- **Orcano:** `+2 FOR, +1 VIG, -1 INT`
- **Sylvari:** `+2 INT, +1 RES, -1 FOR`
- **Umbren:** `+2 DES, +1 VIG, -1 RES`
- **Drakari:** `+1 FOR, +1 DES, +1 INT, -1 RES`
- **Valtherin:** `+2 VIT, +1 INT, -1 DES`

#### Classes (status base)
- **Bárbaro:** HP 34, Mana 8, Stamina 28, Energia 20
- **Mago:** HP 18, Mana 40, Stamina 16, Energia 20
- **Assassino:** HP 24, Mana 14, Stamina 32, Energia 20

#### Cálculo de status no MVP
- HP, Mana e Stamina continuam derivados de classe + atributos (sem PER).
- **Energia = 20 constante** (não entra em fórmula, não recebe bônus racial).

## Pendências
- TECH_LEAD aprovar impacto estrutural (remoção de atributo do domínio e banco).
- DEV executar migração para remover `perception` e ajustar fluxos/telas.
- Definir regra fechada de level up (quantos pontos por nível e limites por atributo).
- Atualizar copy de raça/classe exibindo “habilidades e pontos” conforme pedido do owner.

## Riscos identificados
- Remover PER quebra compatibilidade com dados já existentes; exige migração e fallback para personagens antigos.
- Sem alocação inicial, personalização no primeiro minuto cai; UI de raça/classe precisa compensar com clareza e fantasia forte.
- Se level up não for definido logo, progressão pode ficar “travada” após criação.

## Próximo agente recomendado
- TECH_LEAD_AGENT
- DEVELOPMENT_AGENT
