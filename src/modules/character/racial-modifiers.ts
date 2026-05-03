import { Race } from '@prisma/client';
import { RACIAL_POINT_BUDGET_MVP } from './character.constants';

/**
 * Bônus raciais só em atributos (MVP).
 * Somados **em cima** dos atributos já alterados pela classe (rascunho começa em 0).
 * Cada raça tem exatamente {@link RACIAL_POINT_BUDGET_MVP} pontos líquidos nos 6 atributos
 * (definidos pelo jogo; o usuário não distribui na criação).
 * Sem bônus racial a recursos — HP/Mana/Stamina vêm da fórmula sobre primários finais; Energia = 20 fixo na finalização.
 */
export type RacialModifier = Partial<{
  strength: number;
  dexterity: number;
  intelligence: number;
  vitality: number;
  resilience: number;
  vigorAttribute: number;
}>;

function sumModifier(m: RacialModifier): number {
  return (
    (m.strength ?? 0) +
    (m.dexterity ?? 0) +
    (m.intelligence ?? 0) +
    (m.vitality ?? 0) +
    (m.resilience ?? 0) +
    (m.vigorAttribute ?? 0)
  );
}

export const RACIAL_MODIFIERS: Record<Race, RacialModifier> = {
  /** Generalista: +2 em cada atributo (12 pts). */
  HUMAN: {
    strength: 2,
    dexterity: 2,
    intelligence: 2,
    vitality: 2,
    resilience: 2,
    vigorAttribute: 2,
  },
  /** Melê bruto: FOR/VIT/VIG altos; INT penalizado. */
  ORCANO: {
    strength: 4,
    vitality: 3,
    vigorAttribute: 3,
    resilience: 2,
    dexterity: 2,
    intelligence: -2,
  },
  /** Arcano: INT/RES; FOR penalizado. */
  SYLVARI: {
    intelligence: 5,
    resilience: 3,
    vitality: 2,
    dexterity: 2,
    strength: -2,
    vigorAttribute: 2,
  },
  /** Furtivo: DES/VIG/VIT; RES penalizado. */
  UMBREN: {
    dexterity: 5,
    vigorAttribute: 4,
    intelligence: 2,
    vitality: 4,
    resilience: -3,
  },
  /** Híbrido ofensivo: triplo físico/mágico; RES penalizado. */
  DRAKARI: {
    strength: 3,
    dexterity: 3,
    intelligence: 3,
    vigorAttribute: 3,
    vitality: 2,
    resilience: -2,
  },
  /** Tanque-arcano: VIT/INT/RES; DES penalizado. */
  VALTHERIN: {
    vitality: 4,
    intelligence: 3,
    resilience: 3,
    vigorAttribute: 2,
    strength: 2,
    dexterity: -2,
  },
};

for (const race of Object.keys(RACIAL_MODIFIERS) as Race[]) {
  const s = sumModifier(RACIAL_MODIFIERS[race]);
  if (s !== RACIAL_POINT_BUDGET_MVP) {
    throw new Error(
      `Racial modifier sum for ${race} is ${s}, expected ${RACIAL_POINT_BUDGET_MVP}`,
    );
  }
}
