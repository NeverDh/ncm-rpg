import { CharacterClass, Race } from '@prisma/client';
import { CLASS_BASES } from './class-bases';
import { RACIAL_MODIFIERS, type RacialModifier } from './racial-modifiers';

/** Os 6 atributos persistidos (sem PER). */
export type CoreAttrs = {
  strength: number;
  dexterity: number;
  intelligence: number;
  vitality: number;
  resilience: number;
  vigorAttribute: number;
};

/** Soma de bônus de equipamento (primários) sobre a base persistida — ADR-013. */
export function addCoreAttrs(a: CoreAttrs, b: CoreAttrs): CoreAttrs {
  return {
    strength: a.strength + b.strength,
    dexterity: a.dexterity + b.dexterity,
    intelligence: a.intelligence + b.intelligence,
    vitality: a.vitality + b.vitality,
    resilience: a.resilience + b.resilience,
    vigorAttribute: a.vigorAttribute + b.vigorAttribute,
  };
}

export function zeroCoreAttrs(): CoreAttrs {
  return {
    strength: 0,
    dexterity: 0,
    intelligence: 0,
    vitality: 0,
    resilience: 0,
    vigorAttribute: 0,
  };
}

export function toCoreAttrsFromCharacter(c: {
  strength: number;
  dexterity: number;
  intelligence: number;
  vitality: number;
  resilience: number;
  vigorAttribute: number;
}): CoreAttrs {
  return {
    strength: c.strength,
    dexterity: c.dexterity,
    intelligence: c.intelligence,
    vitality: c.vitality,
    resilience: c.resilience,
    vigorAttribute: c.vigorAttribute,
  };
}

export function applyRacial(race: Race, base: CoreAttrs): CoreAttrs {
  const r: RacialModifier = RACIAL_MODIFIERS[race];
  return {
    strength: base.strength + (r.strength ?? 0),
    dexterity: base.dexterity + (r.dexterity ?? 0),
    intelligence: base.intelligence + (r.intelligence ?? 0),
    vitality: base.vitality + (r.vitality ?? 0),
    resilience: base.resilience + (r.resilience ?? 0),
    vigorAttribute: base.vigorAttribute + (r.vigorAttribute ?? 0),
  };
}

/** HP, Mana e Stamina a partir da classe e dos atributos já com racial (sem PER). Nunca negativos. */
export function deriveHpManaStamina(
  characterClass: CharacterClass,
  attrs: CoreAttrs,
): { hp: number; mana: number; stamina: number } {
  const base = CLASS_BASES[characterClass];
  const hp = base.hp + attrs.vitality * 2 + attrs.resilience;
  const mana = base.mana + attrs.intelligence * 2;
  const stamina = base.stamina + attrs.dexterity * 2 + Math.floor(attrs.strength / 2);
  return {
    hp: Math.max(0, hp),
    mana: Math.max(0, mana),
    stamina: Math.max(0, stamina),
  };
}

/**
 * Atributos secundários de combate / utilidade: **não persistidos**; derivados dos 6 primários
 * (pós-racial) + futuros modificadores de equipamento/buff (M2+). Ver ADR-011 e `docs/MODULES.md`.
 * Valores são inteiros “índice” no MVP; % e caps entram com o combate (M4).
 */
export type SecondaryStats = {
  physicalAttack: number;
  magicalPower: number;
  defense: number;
  magicDefense: number;
  critChanceScore: number;
  critDamageScore: number;
  accuracy: number;
  evasion: number;
  physicalPenetration: number;
  magicalPenetration: number;
  luck: number;
};

export const SECONDARY_STAT_ORDER: (keyof SecondaryStats)[] = [
  'physicalAttack',
  'magicalPower',
  'defense',
  'magicDefense',
  'critChanceScore',
  'critDamageScore',
  'accuracy',
  'evasion',
  'physicalPenetration',
  'magicalPenetration',
  'luck',
];

export function deriveSecondaryStats(attrs: CoreAttrs): SecondaryStats {
  const s = attrs.strength;
  const d = attrs.dexterity;
  const i = attrs.intelligence;
  const v = attrs.vitality;
  const r = attrs.resilience;
  const g = attrs.vigorAttribute;
  return {
    physicalAttack: s + Math.floor(d / 2),
    magicalPower: i + Math.floor(g / 2),
    defense: v + r + Math.floor(s / 2),
    magicDefense: r + i + Math.floor(v / 2),
    critChanceScore: d + Math.floor(g / 2),
    critDamageScore: s + i,
    accuracy: d + Math.floor(i / 2),
    evasion: d + g,
    physicalPenetration: Math.floor(s / 2) + d,
    magicalPenetration: Math.floor(i / 2) + g,
    luck: 0,
  };
}
