# Fase do projeto — onde gravar handoffs

**Leia este arquivo** ao carregar contexto (`/rpg-session`, `/rpg-bootstrap`) ou antes de persistir um handoff.

## Marco atual

| Campo | Valor |
|--------|--------|
| **Marco ativo** | **M1** |
| **Pasta de handoffs** | `handoffs/M1/` |
| **Descrição** | Personagem no Telegram: criação, ficha, menu (ver `docs/MODULES.md` secção M1 e `AGENTS.md` §8). |

Quando o dono considerar **M1 encerrado**, edite esta tabela: defina o próximo marco (`M2` … `M5`) e a pasta correspondente (`handoffs/M2/`, etc.). Crie a pasta se ainda não existir.

## Marcos (roadmap)

| Marco | Conteúdo (resumo) | Pasta |
|-------|-------------------|--------|
| **M1** | Personagem: fluxo conversacional, domínio `character`, bot | `handoffs/M1/` |
| **M2** | Inventário e itens | `handoffs/M2/` |
| **M3** | Economia | `handoffs/M3/` |
| **M4** | Combate e aventura | `handoffs/M4/` |
| **M5** | Sociais e mundo | `handoffs/M5/` |

## Lançamento público (“MVP” de go-live)

O **lançamento** do jogo/bot ao público ocorre **após a conclusão de M1 a M5** (todos os marcos de produto acima). Até lá o repositório evolui por marcos; **M1** substitui a antiga nomenclatura “MVP” para o primeiro marco (documentação e charter).

## Onde salvar o próximo handoff

1. Confira a coluna **Pasta de handoffs** na tabela “Marco atual”.
2. Crie o arquivo apenas após **aprovação do dono** (`AGENTS.md` §6).
3. Nome do ficheiro: `YYYY-MM-DD-slug-curto.md` (ver `handoffs/README.md`).

**Último handoff:** ordenar pelo **nome** dos ficheiros **dentro da pasta do marco ativo** (ex.: `handoffs/M1/*.md`).
