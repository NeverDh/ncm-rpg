# MODULES — Mapa modular e roadmap

Monólito modular NestJS, preparado para futura extração de serviços.

## Estrutura alvo (`src`)

```
src/
  modules/
    character/      # M1 — criação, visualização, menu
    inventory/      # M2
    combat/         # M4
    economy/        # M3
    guild/           # M5
    quest/           # M5
    world/           # M5
  shared/
  core/
  infra/
  bot/
  config/
```

Pastas de apoio: `docs/`, `tests/` (conforme charter do projeto).

---

## M1 — Feature 1: Personagem

**Objetivo:** criação e visualização de personagem via fluxo conversacional Telegram.

**Fluxo do jogador:**

1. Entrada → iniciar criação
2. Escolher classe
3. Escolher raça
4. Nome (texto)
5. Confirmar resumo (atributos finais, recursos e secundários derivados)
6. Menu do personagem

**Menu do personagem (exibir):** nome, classe, raça, nível, HP, mana, stamina, **Energia** (20 fixo em M1), os **6 atributos** primários (incl. Vigor), **11 atributos secundários** derivados (ver secção abaixo + ADR-011), nota curta sobre progressão (pontos no level up só nos primários), skills (estrutura), equipamentos (placeholder).

**Fora do escopo de M1:** combate, inventário funcional completo, economia, PvE/PvP.

---

## M2 — Inventário e itens

**Objetivo:** o jogador gere **uma bolsa** por personagem, **equipa e desequipa** nas peças previstas, **usa consumíveis** com efeitos simples **fora de combate**, e a **ficha** reflete equipamento nos primários e, em cascata, nos secundários derivados (**ADR-011**, **ADR-013** ponto 2–3, **ADR-014**).

### Bolsa (M2)

- **Uma bolsa global** por personagem (visão única; sem sub-bolsas por categoria).
- **Sem filtro** por tipo na interface M2.
- **20 slots fixos** de capacidade na bolsa em M2 (slot vazio vs. stack/ocupação — detalhe de implementação: uma linha por “célula” ou capacidade 20; DEV alinha ao schema).

### Equipamentos (M2)

- **Equipar / desequipar:** somente pelo **menu do inventário** (sem fluxo paralelo obrigatório na ficha no M2).
- **Slots mínimos:**

| Grupo | Slots |
|--------|--------|
| Arma | 1 × Arma |
| Armadura | Peitoral · Elmo · Bota · Calça |
| Acessórios | 2 × Anel · 1 × Colar · 1 × Cinto |

- **Bônus de equipamento:** apenas modificadores **flat nos 6 primários** na leitura da ficha; ver **ADR-013** (não persistir primários inflados; `CoreAttrs` efetivo).

### Itens — tipos desde o início (M2)

- **Arma**
- **Armadura**
- **Consumível**
- **Material**
- **Item de missão**

### Consumíveis (M2)

- **Uso permitido** em M2.
- **Efeitos simples apenas:** cura de **vida** (HP) e recuperação de **mana**.
- **Apenas fora de combate** (em M2 não há combate; a regra vincula-se ao estado futuro M4 — guard no domínio).

### Raridade (M2)

Metadado de exibição / balanceamento futuro; cinco níveis:

1. Comum  
2. Incomum  
3. Raro  
4. Épico  
5. Lendário  

### Catálogo de equipamento (M2)

- Conjuntos **temáticos** por classe (Bárbaro, Mago, Assassino): **arma** + **quatro peças de armadura** + **quatro acessórios** (anéis, colar, cinto), cada qual em **cinco raridades** — ver migração `20260504140000_m2_class_gear_catalog` e **ADR-015**.
- Convenção de `code`: `gear_{barb|mage|assa}_{slot}_{rarity}` (ex.: `gear_mage_weapon_rare`). Nomes exibem classe e raridade; **o jogo não bloqueia equipar por classe** no M2 (sugestão de fantasy apenas).

### Módulo e fronteiras

- `inventory/` referencia personagem por **`characterId`**; sem duplicar criação de personagem (**ADR-014** + regras de fronteira abaixo).
- **Sorte** por item: continua fora da curva de bônus diretos em secundários em M2 (**ADR-013**); `luck` derivado como hoje até loot/economia documentados (M3+).

**Fora do escopo M2:** loja, moedas, mercado (M3); **uso de item em combate** (M4); buffs de consumível além de cura HP / recuperação mana; skills além do placeholder M1.

## M3 — Economia

Comércio, mercado, moedas, lojas, transações.

## M4 — Combate e aventura

PvE, PvP, arena, aventuras, dungeons, mobs.

## M5 — Sociais e mundo

Eventos, NPCs, guildas, party, crafting, quests, mundo vivo.

---

## Regras de fronteira entre módulos

- Cada módulo expõe casos de uso via **services** e contratos claros; handlers Telegram apenas orquestram chamadas.
- Dados de personagem pertencem ao domínio **character**; inventário (M2) referencia personagem por ID, sem duplicar regras de criação.
- **Skills em M1:** apenas modelo/placeholder e listagem; sem árvore nem combate.

---

## Conteúdo de design fixado (rebalance M1 — `handoffs/M1/2026-05-02-product-remove-per-balance.md`)

### Classes iniciais

| Classe    | Atributo principal | Foco narrativo (recursos vêm dos atributos) |
|-----------|--------------------|---------------------------------------------|
| Bárbaro   | Força              | Corpo e resistência                         |
| Mago      | Inteligência       | Arcano                                      |
| Assassino | Destreza           | Velocidade e precisão                       |

**Criação — pacote de classe (10 pontos nos 6 atributos, fixo por classe):** o rascunho começa com **0** em tudo; ao escolher a classe, soma-se o pacote abaixo. Ver `class-modifiers.ts` e **ADR-012**.

| Classe    | FOR | DES | INT | VIT | RES | VIG |
|-----------|-----|-----|-----|-----|-----|-----|
| Bárbaro   | +4  | 0   | 0   | +3  | +1  | +2  |
| Mago      | 0   | +1  | +5  | 0   | +2  | +2  |
| Assassino | +2  | +5  | 0   | 0   | 0   | +3  |

**Recursos na criação:** não há mais “base fixa” de HP/Mana/Stamina por classe; **Vida, Mana e Stamina** = parcela fixa **0** na tabela de classe + **fórmula** sobre os atributos **finais** (classe + raça), como em `deriveHpManaStamina`. **Energia** continua **20** para todos na finalização.

### Raças iniciais (só bônus de atributo; sem bônus a recursos na criação)

Cada raça recebe **12 pontos líquidos** somados **em cima** dos atributos já alterados pela classe (distribuição **fixa**; o jogador **não** aloca). Ver **ADR-010** e **ADR-012**.

| Raça      | Modificadores (FOR, DES, INT, VIT, RES, VIG) |
|-----------|-----------------------------------------------|
| Humano    | +2 em cada um dos 6 (generalista)            |
| Orcano    | +4 FOR, +2 DES, −2 INT, +3 VIT, +2 RES, +3 VIG |
| Sylvari   | −2 FOR, +2 DES, +5 INT, +2 VIT, +3 RES, +2 VIG |
| Umbren    | +5 DES, +2 INT, +4 VIT, −3 RES, +4 VIG       |
| Drakari   | +3 FOR, +3 DES, +3 INT, +2 VIT, −2 RES, +3 VIG |
| Valtherin | +2 FOR, −2 DES, +3 INT, +4 VIT, +3 RES, +2 VIG |

Implementação: `src/modules/character/racial-modifiers.ts`, orçamento `RACIAL_POINT_BUDGET_MVP` em `character.constants.ts`.

### Atributos (6)

Força, Destreza, Inteligência, Vitalidade, Resistência, **Vigor**.  
**Criação:** começam em **0**; **+10 pontos** do pacote de **classe**; em seguida **+12 pontos líquidos** do pacote de **raça**; **sem** gastar pontos livres na criação. Pontos extras no **level up** (regra a fechar).

### Status (4)

HP, Mana, Stamina: parcela fixa **0** em `class-bases.ts` + fórmula sobre atributos **finais** (classe + raça), sem PER; **piso 0** (nunca negativos, mesmo com atributos negativos).  
**Energia:** **20** fixo em M1 (`CharacterService.finalize`).

### Atributos secundários (11 — display em M1)

Não recebem pontos diretos no level up; mudam **indiretamente** quando os primários sobem e, no futuro, por **itens, buffs e encantamentos** (M2+). Em M1 são **derivados em código** (`deriveSecondaryStats` em `character.derivation.ts`), **sem colunas** dedicadas no Prisma. Catálogo e fórmulas v1: ver **ADR-011** e `handoffs/M1/2026-05-02-product-secondary-stats-derived.md`.

Ordem de exibição sugerida: Ataque físico, Poder mágico, Defesa, Defesa mágica, Chance crítica (índice), Dano crítico (índice), Precisão, Esquiva, Penetração física, Penetração mágica, Sorte (0 a partir de primários até loot/economia).
