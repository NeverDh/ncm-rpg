# Fase do projeto — onde gravar handoffs

**Leia este arquivo** ao carregar contexto (`/rpg-session`, `/rpg-bootstrap`) ou antes de persistir um handoff.

## Marco atual

| Campo | Valor |
|--------|--------|
| **Marco ativo** | **M2** |
| **Pasta de handoffs** | `handoffs/M2/` |
| **Descrição** | Inventário e itens — ver `docs/MODULES.md` secção M2. |

Quando o dono considerar o marco ativo **encerrado**, edite esta tabela: defina o próximo marco e a pasta (`handoffs/M3/`, etc.). Crie a pasta se ainda não existir.

## Marcos concluídos

| Marco | Concluído (registo do dono) | Notas |
|-------|------------------------------|--------|
| **M1** | **2026-05-03** | Personagem no Telegram (criação, ficha, menu); handoffs em `handoffs/M1/`; fluxo `docs/fluxos/m1-personagem.md`; charter `AGENTS.md` §8. |

## Marcos (roadmap)

| Marco | Conteúdo (resumo) | Pasta |
|-------|-------------------|--------|
| **M1** | Personagem: fluxo conversacional, domínio `character`, bot | `handoffs/M1/` (concluído) |
| **M2** | Inventário e itens | `handoffs/M2/` |
| **M3** | Economia | `handoffs/M3/` |
| **M4** | Combate e aventura | `handoffs/M4/` |
| **M5** | Sociais e mundo | `handoffs/M5/` |

## Lançamento público (“MVP” de go-live)

O **lançamento** do jogo/bot ao público ocorre **após a conclusão de M1 a M5** (todos os marcos de produto acima). **M1** na documentação histórica corresponde ao primeiro marco (antiga nomenclatura “MVP” só para esse marco).

## Onde salvar o próximo handoff

1. Confira a coluna **Pasta de handoffs** na tabela “Marco atual”.
2. Crie o arquivo apenas após **aprovação do dono** (`AGENTS.md` §6).
3. Nome do ficheiro: `YYYY-MM-DD-slug-curto.md` (ver `handoffs/README.md`).

**Último handoff:** ordenar pelo **nome** dos ficheiros **dentro da pasta do marco ativo** (ex.: `handoffs/M2/*.md`).
