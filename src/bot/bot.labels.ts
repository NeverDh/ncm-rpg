import { CharacterClass, EquipmentSlot, ItemRarity, ItemType, Race } from '@prisma/client';
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

export const EQUIPMENT_SLOT_LABEL: Record<EquipmentSlot, string> = {
  WEAPON: 'Arma',
  CHEST: 'Peitoral',
  HELM: 'Elmo',
  BOOTS: 'Bota',
  PANTS: 'Calça',
  RING_1: 'Anel 1',
  RING_2: 'Anel 2',
  NECKLACE: 'Colar',
  BELT: 'Cinto',
};

export const ITEM_RARITY_LABEL: Record<ItemRarity, string> = {
  COMMON: 'Comum',
  UNCOMMON: 'Incomum',
  RARE: 'Raro',
  EPIC: 'Épico',
  LEGENDARY: 'Lendário',
};

export const ITEM_TYPE_LABEL: Record<ItemType, string> = {
  WEAPON: 'Arma',
  ARMOR: 'Armadura',
  CONSUMABLE: 'Consumível',
  MATERIAL: 'Material',
  QUEST: 'Missão',
};
