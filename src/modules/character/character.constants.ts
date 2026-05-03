/** Valor inicial de cada atributo ao criar o rascunho (antes de classe e raça). */
export const ATTR_CREATION_BASE = 0;

/**
 * Soma líquida dos modificadores de **classe** nos 6 atributos na criação.
 * Tabela em `class-modifiers.ts`.
 */
export const CLASS_ATTR_POINT_BUDGET_MVP = 10;

/**
 * Soma líquida dos modificadores raciais (FOR+DES+INT+VIT+RES+VIG) na criação.
 * Distribuição fixa por raça em `racial-modifiers.ts` — o jogador não aloca estes pontos.
 */
export const RACIAL_POINT_BUDGET_MVP = 12;

/** Status Energia no MVP: constante (ver ADR-009 / handoff produto). */
export const FIXED_ENERGY_MVP = 20;

/** Na criação não há pool para gastar; reservado à progressão futura. */
export const ATTR_POINTS_AT_CREATION = 0;
