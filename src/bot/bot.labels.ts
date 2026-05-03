import { CharacterClass, Race } from '@prisma/client';
import type { SecondaryStats } from '../modules/character/character.derivation';

export const RACE_LABEL: Record<Race, string> = {
  HUMAN: 'Humano',
  ORCANO: 'Orcano',
  SYLVARI: 'Sylvari',
  UMBREN: 'Umbren',
  DRAKARI: 'Drakari',
  VALTHERIN: 'Valtherin',
};

export const CLASS_LABEL: Record<CharacterClass, string> = {
  BARBARIAN: 'Bárbaro',
  MAGE: 'Mago',
  ASSASSIN: 'Assassino',
};

export const ATTR_LABEL: Record<string, string> = {
  strength: 'FOR',
  dexterity: 'DES',
  intelligence: 'INT',
  vitality: 'VIT',
  resilience: 'RES',
  vigorAttribute: 'VIG',
};

/** Nome completo na ficha / coluna de atributos (primários). */
export const ATTR_NAME_FULL: Record<string, string> = {
  strength: 'Força',
  dexterity: 'Destreza',
  intelligence: 'Inteligência',
  vitality: 'Vitalidade',
  resilience: 'Resistência',
  vigorAttribute: 'Vigor',
};

/** Nome completo por stat secundário (ADR-011 / MODULES). */
export const SECONDARY_LABEL: { [K in keyof SecondaryStats]: string } = {
  physicalAttack: 'Ataque físico',
  magicalPower: 'Poder mágico',
  defense: 'Defesa',
  magicDefense: 'Defesa mágica',
  critChanceScore: 'Chance crítica',
  critDamageScore: 'Dano crítico',
  accuracy: 'Precisão',
  evasion: 'Esquiva',
  physicalPenetration: 'Penetração física',
  magicalPenetration: 'Penetração mágica',
  luck: 'Sorte',
};
