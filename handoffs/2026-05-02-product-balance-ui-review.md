# HANDOFF

## Agent
PRODUCT_AGENT

## Objetivo
Revisão de consistência entre **atributos, raças, classes** (docs + código de referência) e recomendações de **UI Telegram** para equilíbrio percebido e clareza; sem fixar novos números de balanceamento (isso exige ADR / charter).

## Arquivos afetados
- `handoffs/2026-05-02-product-balance-ui-review.md` (este arquivo)

## Decisões tomadas
- **Documentação vs código:** `docs/MODULES.md` descreve Sylvari com "−1 vigor"; na implementação vigor é **recurso derivado**, e o penal aplicado é **−1 Vitalidade** (`racial-modifiers.ts`). PRODUCT recomenda **alinhar o texto do MODULES ao comportamento real** ou mudar desenho com ADR — hoje está inconsistente para quem lê só o charter.
- **Percepção no MVP:** PER existe na ficha e na distribuição, mas **não entra** nas fórmulas de HP/Mana/Stamina/Vigor em `CharacterService.finalize`. Para consistência com o jogador: ou **comunicar na UI** que PER será usado “em breve” (exploração/combate), ou **introduzir uso mínimo** via decisão numérica (escopo DEV + ADR).
- **Drakari vs Humano (qualitativo):** Drakari (+FOR/+DES/+INT, −RES) soma menos “poder racial bruto” que Humano (+1 em tudo) para builds genéricas; o charter promete resistência elemental futura — ok como **raça de especialista** se a copy deixar claro; caso contrário tende a parecer **fraca no MVP**. Revisão numérica fica para ANALYST + ADR.
- **UI:** Priorizar **indicador de progresso**, **lista vertical de atributos**, **texto de apoio** em raça/classe (no corpo da mensagem, não só nos botões), e **linha honesta** sobre PER até haver sistema que o consuma.

## Pendências
- Sincronizar `docs/MODULES.md` (Sylvari) com código ou alterar racial após ADR.
- Decidir se PER ganha efeito simbólico/MVP mínimo ou só disclosure na interface.
- Revisão quantitativa Drakari/Valtherin (já marcados como provisórios na ADR-006).
- Implementar melhorias de copy/layout em `bot.presenter.ts` / fluxo em `bot.service.ts` (DEV).

## Riscos identificados
- Jogadores **min-max** podem ignorar PER até combate existir, gerando personagens “iguais” em recursos.
- Inconsistência charter/MODULES/código gera **desconfiança** na ficha final.

## Próximo agente recomendado
- **ANALYST_AGENT** — validar curvas Human vs especialistas e custo de oportunidade de PER; **DEVELOPMENT_AGENT** — aplicar mudanças de UI acordadas; **TECH_LEAD_AGENT** — se mudar fórmulas ou raciais.
