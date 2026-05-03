import { CharacterClass } from '@prisma/client';
import { FIXED_ENERGY_MVP } from './character.constants';

/**
 * Parcela fixa de recurso por classe na fórmula de HP/Mana/Stamina.
 * No MVP atual, HP/Mana/Stamina vêm **só** dos atributos finais + estes zeros (recursos crescem com classe+raça nos atributos).
 * Energia continua fixa na finalização (`FIXED_ENERGY_MVP`).
 */
export const CLASS_BASES: Record<
  CharacterClass,
  { hp: number; mana: number; stamina: number; energy: number }
> = {
  BARBARIAN: { hp: 0, mana: 0, stamina: 0, energy: FIXED_ENERGY_MVP },
  MAGE: { hp: 0, mana: 0, stamina: 0, energy: FIXED_ENERGY_MVP },
  ASSASSIN: { hp: 0, mana: 0, stamina: 0, energy: FIXED_ENERGY_MVP },
};
