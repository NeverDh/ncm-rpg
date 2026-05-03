# ARCHITECTURE — Visão técnica

## Stack oficial

| Camada    | Tecnologia                          |
|-----------|-------------------------------------|
| API / app | NestJS, TypeScript                  |
| Dados     | PostgreSQL, Prisma ORM            |
| Cache     | Redis (futuro)                    |
| Bot       | Telegraf                          |
| Contratos | Swagger                           |
| Runtime   | Docker, Docker Compose            |
| Config    | Variáveis de ambiente             |

Arquitetura: **monólito modular**, com limites claros para eventual separação em serviços.

## Princípios (ordem de prioridade)

1. Experiência do jogador
2. UX Telegram (menus, botões, estados conversacionais)
3. Fluxo conversacional desenhado **antes** de implementar backend pesado
4. Modularização por feature
5. Evolução MVP → M5 sem reescrita desnecessária

## Padrões de código

- SOLID, injeção de dependência NestJS
- Clean Architecture / feature-first: domínio e aplicação desacoplados de transporte (Telegram)
- **Sem regra de negócio nos handlers** do bot; handlers delegam a services/use cases
- DTOs para entrada/saída onde fizer sentido; entidades Prisma alinhadas ao domínio com camada de mapeamento se necessário

## Pastas conceituais

- `modules/*` — bounded contexts por feature (character, inventory, …)
- `shared` — utilitários transversais sem regras de negócio pesadas
- `core` — building blocks da aplicação (ex.: exceções de domínio, interfaces)
- `infra` — adaptadores (Prisma, Redis futuro, filas)
- `bot` — wiring Telegraf, middlewares, registro de comandos/callbacks
- `config` — carregamento e validação de config (ex.: Joi/Zod + ConfigModule)

## Telegram

- Fluxos guiados por **estado conversacional** (FSM ou session store + máquina de estados explícita)
- Inline keyboards para escolhas (raça, classe, confirmação)
- Mensagens idempotentes onde possível; tratamento de `/start` e retorno ao menu

## Dados e migrações

- Prisma como fonte de verdade do schema (**pin Prisma 5.x** neste repo — ver `decisions/DECISIONS.md` ADR-006)
- Migrações versionadas em `prisma/migrations/`; seeds opcionais para classes/raças estáticas do MVP
- Estado do wizard de criação: colunas em `characters` (`creationStep`, `attributePointsRemaining`), não Redis
- Recursos na ficha: `hp`, `mana`, `stamina`, `energy` (**Energia**, 20 fixo no MVP na finalização); seis atributos incl. **Vigor** em `vigor_attribute` (ver ADR-007 / **ADR-009**)

## Segurança e governança

- Não introduzir dependências ou mudanças arquiteturais amplas sem decisão registrada em `decisions/DECISIONS.md` quando o impacto for estrutural
- Não especular regras de jogo não documentadas; ambiguidade → pergunta ao product owner / charter

## Testes

- Unitários em services e domain helpers
- Integração mínima em fluxos críticos (ex.: criação de personagem) quando o código existir

---

*Documento vivo: atualizar após primeira scaffold NestJS e após cada mudança estrutural relevante.*
