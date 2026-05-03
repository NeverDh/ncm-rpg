# HANDOFF

## Agent
PRODUCT_AGENT

## Objetivo
Registrar decisão de produto sobre **atributos secundários** na evolução da M1/MVP: catálogo de 11 stats, regra de evolução **sem alocação direta** no level up, contribuição **indireta** via **combinação dos 6 atributos primários** e, no futuro, **itens, buffs e encantamentos**; orientação de UX na ficha e matriz conceitual primário → secundário (pesos numéricos a fechar).

## Arquivos afetados
- Nenhum neste handoff (especificação). **Próximos alvos:** `docs/MODULES.md`, `decisions/DECISIONS.md` (ADR), `src/**` após gate TECH_LEAD + fechamento de fórmulas.

## Decisões tomadas

### Promessa ao jogador
- O jogador **só evolui os 6 primários** no level up (quando existir); **não gasta pontos diretamente** em secundários.
- Secundários **mudam** porque: (1) **derivam dos primários** (fórmulas a documentar); (2) **somam modificadores** de equipamento, buffs e encantamentos (M2+).

### Catálogo (11 secundários)
1. Ataque físico  
2. Poder mágico  
3. Defesa  
4. Defesa mágica  
5. Chance crítica  
6. Dano crítico  
7. Precisão  
8. Esquiva  
9. Penetração física  
10. Penetração mágica  
11. Sorte  

**Sorte:** reservar para economia / loot / eventos (M3+); na M1 pode exibir com nota de escopo futuro para não parecer só combate.

### Matriz conceitual (direção; pesos a fechar com dono)
| Secundário | Primários que explicam a fantasia |
|------------|-------------------------------------|
| Ataque físico | FOR, DES |
| Poder mágico | INT, VIG (ajustável) |
| Defesa | VIT, RES, FOR |
| Defesa mágica | RES, INT, VIT |
| Chance crítica | DES, VIG |
| Dano crítico | FOR, INT (bifurcar físico/mágico se necessário depois) |
| Precisão | DES, INT |
| Esquiva | DES, VIG |
| Penetração física | FOR, DES |
| Penetração mágica | INT, VIG |
| Sorte | modificadores externos no início, ou vínculo fraco a definir |

### UX MVP (Telegram)
- **Confirmação de criação:** manter foco em primários + 4 recursos; no máximo **uma linha** apontando que secundários derivam dos primários e de equipamento (detalhe na ficha).
- **Ficha:** bloco **Atributos secundários** com valores derivados dos primários no MVP; contribuição de equipamento = 0 até M2; copy honesta sobre MVP / em breve.

## Pendências
- Dono fechar **pesos e fórmulas** por secundário e papel exato de **Sorte**.
- **ANALYST:** caps, duplicação com combate futuro.
- **TECH_LEAD:** persistir vs calcular só na leitura da ficha.
- **BOT_COPY:** rótulos, abreviações, nota de rodapé.
- **DEV:** implementação após ADR.

## Riscos identificados
- Ficha Telegram longa (limite ~4096 caracteres); considerar segunda mensagem ou seção colapsável no futuro.
- Sorte sem mecânica cedo pode confundir — mitigar com texto curto na ficha.

## Próximo agente recomendado
- **ANALYST_AGENT** → **TECH_LEAD_AGENT** (ADR + fronteira) → **DEVELOPMENT_AGENT** + **BOT_COPY_AGENT**.
