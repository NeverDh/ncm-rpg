# Fluxo conversacional — MVP Feature 1 (criação + menu)

Referência de produto alinhada ao rebalance (`handoffs/2026-05-02-product-remove-per-balance.md`). Implementação: `src/bot/bot.service.ts` + `bot.presenter.ts`.

## Princípios de UX

- **Um personagem completo por conta Telegram** no MVP (bloqueio de segundo “Criar” até existir fluxo de reset).
- **Inline keyboards** para raça, classe e confirmação.
- **Texto livre** só na etapa **nome** (privado).
- **Estado** persistido no PostgreSQL (`Character.creationStep`), não em memória — tolera restart do processo.

## Atributos na criação (MVP)

- **6 atributos** (sem Percepção no modelo).
- **Base 10** em cada um antes dos bônus raciais; cada raça aplica **12 pontos** de modificadores fixos (definidos pelo jogo). **Sem** etapa de o jogador distribuir pontos (pool só no level up, fora deste escopo).
- Bônus raciais, **atributos secundários** (11, derivados — ADR-011) e recursos derivados são calculados/aplicados na confirmação e na ficha (`racial-modifiers.ts`, `character.derivation.ts`, `CharacterService.finalize` para HP/mana/stamina/energia).
- **Energia (status):** sempre **20** na finalização.

## Passos (jogador)

1. **`/start`** — Menu: **Criar personagem** (se ainda não há herói completo), **Meu personagem**, **Continuar criação** (se há rascunho).
2. **Classe** — Bárbaro / Mago / Assassino + menu; após escolha, texto com blurb de classe + escolha de **raça**.
3. **Raça** — Grade 3×2 + voltar ao menu; após escolha, texto com **bônus raciais** explícitos + pedido de **nome** por mensagem de texto.
4. **Nome** — Mensagem de texto 2–32 caracteres (letras/números/espaços Unicode).
5. **Confirmar** — Resumo: nome, raça, classe, atributos (base → final), prévia de status com barras, **secundários (prévia)**; **Salvar herói** ou **Mudar nome** (volta para etapa nome).
6. **Pós-criação** — Ficha resumida + menu reduzido (sem novo “Criar” enquanto não houver reset).
7. **`/personagem`** — Exibe ficha se o herói estiver completo; caso contrário orienta usar `/start`.

## Menu da ficha (telegram)

Exibe: nome, classe, raça, nível, HP, mana, stamina, **Energia**, **6 atributos** primários (incl. **VIG**), **11 secundários** derivados + nota MVP (ADR-011), linha sobre progressão futura (level up nos primários), placeholders **Skills** e **Equipamentos**.

## Mensagens de erro (UX)

- Etapa errada ou sem rascunho: mensagem pedindo `/start`.

## Pendências de produto (fora deste MVP)

- Fluxo de **recriar / apagar** personagem.
- Regra fechada de **level up** (pontos por nível, tetos).
- Mensagens temáticas mais ricas e tutorial `/help`.
