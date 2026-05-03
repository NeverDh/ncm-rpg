import { CharacterClass } from '@prisma/client';
import { CLASS_ATTR_POINT_BUDGET_MVP } from './character.constants';
import type { CoreAttrs } from './character.derivation';

/**
 * Bônus de atributo só da classe (MVP).
 * Soma fixa {@link CLASS_ATTR_POINT_BUDGET_MVP} por classe; o jogador não distribui na criação.
 * Raça soma em cima destes valores em `CharacterService.setRace`.
 */
export type ClassAttrModifier = Partial<{
  strength: number;
  dexterity: number;
  intelligence: number;
  vitality: number;
  resilience: number;
  vigorAttribute: number;
}>;

function sumClassModifier(m: ClassAttrModifier): number {
  return (
    (m.strength ?? 0) +
    (m.dexterity ?? 0) +
    (m.intelligence ?? 0) +
    (m.vitality ?? 0) +
    (m.resilience ?? 0) +
    (m.vigorAttribute ?? 0)
  );
}

export const CLASS_ATTR_MODIFIERS: Record<CharacterClass, ClassAttrModifier> = {
  BARBARIAN: {
    strength: 4,
    vitality: 3,
    vigorAttribute: 2,
    resilience: 1,
  },
  MAGE: {
    intelligence: 5,
    resilience: 2,
    vigorAttribute: 2,
    dexterity: 1,
  },
  ASSASSIN: {
    dexterity: 5,
    vigorAttribute: 3,
    strength: 2,
  },
};

for (const cls of Object.keys(CLASS_ATTR_MODIFIERS) as CharacterClass[]) {
  const s = sumClassModifier(CLASS_ATTR_MODIFIERS[cls]);
  if (s !== CLASS_ATTR_POINT_BUDGET_MVP) {
    throw new Error(`Class modifier sum for ${cls} is ${s}, expected ${CLASS_ATTR_POINT_BUDGET_MVP}`);
  }
}

export function applyClass(characterClass: CharacterClass, base: CoreAttrs): CoreAttrs {
  const r = CLASS_ATTR_MODIFIERS[characterClass];
  return {
    strength: base.strength + (r.strength ?? 0),
    dexterity: base.dexterity + (r.dexterity ?? 0),
    intelligence: base.intelligence + (r.intelligence ?? 0),
    vitality: base.vitality + (r.vitality ?? 0),
    resilience: base.resilience + (r.resilience ?? 0),
    vigorAttribute: base.vigorAttribute + (r.vigorAttribute ?? 0),
  };
}
