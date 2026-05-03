# Pasta `handoffs/` — convenção

Os handoffs são a **memória entre chats**. O formato do corpo do arquivo está em `AGENTS.md` seção 6.

## Em que pasta gravar

1. Leia **`index/PROJECT_PHASE.md`** — indica o **marco ativo** (M1…M5) e a **pasta** (`handoffs/M1/`, etc.).
2. Grave o ficheiro **só nessa pasta**, nunca na raiz de `handoffs/` (exceto este `README.md` e os `README.md` opcionais de cada `M*`).

## Nome do arquivo (obrigatório para ordenação)

Dentro da pasta do marco, use sempre o prefixo de data ISO:

`YYYY-MM-DD-slug-curto.md`

Exemplos válidos em `handoffs/M1/`:

- `2026-05-03-ajuste-fluxo-nome.md`
- `2026-05-03-tech-lead-adr-redis.md`

**Não** use nomes sem data (ex.: `handoff-final.md`): o “último handoff” ordena pelo **nome** do ficheiro; sem `YYYY-MM-DD-` a ordem fica **ambígua**.

## Vários handoffs no mesmo dia

- Prefira **um slug distinto** por ciclo.
- Se precisar de **segunda versão** no mesmo assunto no mesmo dia, acrescente sufixo: `…-v2.md` ou `…-b.md`.

## Gravação no disco

Só crie ou atualize ficheiros nas pastas `handoffs/M*/` **depois** de o dono **aprovar explicitamente** o handoff no chat (`AGENTS.md` §6).
