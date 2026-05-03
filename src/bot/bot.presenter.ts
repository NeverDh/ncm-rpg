import { Character, CharacterClass, Race } from '@prisma/client';
import { Markup } from 'telegraf';
import { ATTR_CREATION_BASE, FIXED_ENERGY_MVP } from '../modules/character/character.constants';
import { applyClass } from '../modules/character/class-modifiers';
import {
  deriveHpManaStamina,
  deriveSecondaryStats,
  SECONDARY_STAT_ORDER,
  type CoreAttrs,
  type SecondaryStats,
} from '../modules/character/character.derivation';
import { SECTION_RULE } from './bot.copy';
import { ATTR_NAME_FULL, CLASS_LABEL, RACE_LABEL, SECONDARY_LABEL } from './bot.labels';

const RACES: Race[] = [
  Race.HUMAN,
  Race.ORCANO,
  Race.SYLVARI,
  Race.UMBREN,
  Race.DRAKARI,
  Race.VALTHERIN,
];

const CLASSES: CharacterClass[] = [
  CharacterClass.BARBARIAN,
  CharacterClass.MAGE,
  CharacterClass.ASSASSIN,
];

/** Ordem fixa na ficha (6 atributos; PER fora do MVP). */
export const ATTR_KEYS: (keyof CoreAttrs)[] = [
  'strength',
  'dexterity',
  'intelligence',
  'vitality',
  'resilience',
  'vigorAttribute',
];

function creationNeutralBase(): CoreAttrs {
  const v = ATTR_CREATION_BASE;
  return {
    strength: v,
    dexterity: v,
    intelligence: v,
    vitality: v,
    resilience: v,
    vigorAttribute: v,
  };
}

export function formatPrimaryTotalsLines(attrs: CoreAttrs): string {
  return ATTR_KEYS.map((k) => `${ATTR_NAME_FULL[k]} ${attrs[k]}`).join('\n');
}

export function formatDraftPrimariesSection(title: string, attrs: CoreAttrs): string {
  return `${SECTION_RULE}\n${title}\n${formatPrimaryTotalsLines(attrs)}`;
}

/** Largura das barras (igual ao estilo de `examples/texto-exemplo.txt`). */
const BAR_SEGMENTS = 10;

type ResourceBarKind = 'hp' | 'mana' | 'stamina' | 'energy';

const FILLED_SQUARE: Record<ResourceBarKind, string> = {
  hp: '🟥',
  mana: '🟦',
  stamina: '🟨',
  energy: '🟪',
};

/**
 * Uma linha "valor/max" + linha de 10 quadrados (preenchidos + ⬜), como no exemplo visual.
 * Com max igual ao valor atual (ficha em repouso), a proporção da barra reflete o preenchimento.
 */
function emojiResourceBarBlock(
  headerLine: string,
  current: number,
  max: number,
  kind: ResourceBarKind,
): string {
  const maxSafe = Math.max(1, max);
  const filled = Math.min(
    BAR_SEGMENTS,
    Math.max(0, Math.round((current / maxSafe) * BAR_SEGMENTS)),
  );
  const empty = BAR_SEGMENTS - filled;
  const square = FILLED_SQUARE[kind];
  return `${headerLine}\n${square.repeat(filled)}${'⬜'.repeat(empty)}`;
}

function formatStatusEmojiBlock(barBlocks: string[]): string {
  return [SECTION_RULE, barBlocks.join('\n\n')].join('\n');
}

/** Resumo dos seis atributos após escolher só a classe (rascunho persistido). */
export function formatAfterClassChosenSummary(c: Character): string {
  return formatDraftPrimariesSection('📊 Atributos (classe)', toCoreAttrs(c));
}

/**
 * Após escolher a raça: atributos finais da criação, recursos derivados e secundários
 * (ainda sem nome / confirmação).
 */
export function formatPostRaceReveal(c: Character): string {
  if (!c.characterClass || !c.race) {
    return '';
  }
  const attrs = toCoreAttrs(c);
  const { hp, mana, stamina } = deriveHpManaStamina(c.characterClass, attrs);
  const secondary = deriveSecondaryStats(attrs);
  const statusBlock = formatStatusEmojiBlock([
    emojiResourceBarBlock(`❤️ Vida ${hp}/${hp}`, hp, hp, 'hp'),
    emojiResourceBarBlock(`🔮 Mana ${mana}/${mana}`, mana, mana, 'mana'),
    emojiResourceBarBlock(`⚡ Stamina ${stamina}/${stamina}`, stamina, stamina, 'stamina'),
    emojiResourceBarBlock(
      `✨ Energia ${FIXED_ENERGY_MVP}/${FIXED_ENERGY_MVP}`,
      FIXED_ENERGY_MVP,
      FIXED_ENERGY_MVP,
      'energy',
    ),
  ]);
  return (
    `${formatDraftPrimariesSection('📊 Atributos (classe + raça)', attrs)}\n\n` +
    `${SECTION_RULE}\n` +
    `❤️ Recursos\n` +
    `${statusBlock}\n\n` +
    `${SECTION_RULE}\n` +
    `⚔️ Atributos secundários\n` +
    `${formatSecondaryLines(secondary)}`
  );
}

/** Passo 1: cada classe soma um pacote diferente de atributos (ficha começa em zero). */
export function formatWizardClassIntro(): string {
  const perClass = CLASSES.map((cl) => {
    const attrs = applyClass(cl, creationNeutralBase());
    return `• ${CLASS_LABEL[cl]}\n${formatPrimaryTotalsLines(attrs)}`;
  }).join('\n\n');
  return (
    `⚔ Passo 1/4 · Classe\n` +
    `${SECTION_RULE}\n\n` +
    `A ficha começa zerada. Cada classe soma um pacote próprio nos seis atributos; na etapa seguinte a raça soma mais uma vez.\n\n` +
    `${perClass}\n\n` +
    `Toque no botão da classe desejada.`
  );
}

export function mainMenuKeyboard(hasDraft: boolean, hasCharacter: boolean) {
  return Markup.inlineKeyboard([
    ...(hasCharacter
      ? []
      : [[Markup.button.callback('✨ Criar personagem', 'wizard:create')]]),
    [Markup.button.callback('📜 Meu personagem', 'sheet:show')],
    ...(hasDraft && !hasCharacter
      ? [[Markup.button.callback('▶ Continuar criação', 'wizard:resume')]]
      : []),
  ]);
}

export function raceKeyboard() {
  const row = (slice: Race[]) =>
    slice.map((r) => Markup.button.callback(RACE_LABEL[r], `race:${r}`));
  return Markup.inlineKeyboard([
    row(RACES.slice(0, 3)),
    row(RACES.slice(3, 6)),
    [
      Markup.button.callback('« Trocar classe', 'wizard:back'),
      Markup.button.callback('« Menu', 'menu:main'),
    ],
  ]);
}

/** Teclado no passo nome (texto + voltar etapa). */
export function namePromptKeyboard() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('« Trocar raça', 'wizard:back'),
      Markup.button.callback('« Menu', 'menu:main'),
    ],
  ]);
}

export function classKeyboard() {
  return Markup.inlineKeyboard([
    CLASSES.map((c) => Markup.button.callback(CLASS_LABEL[c], `class:${c}`)),
    [Markup.button.callback('« Menu', 'menu:main')],
  ]);
}

export function confirmKeyboard() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('✅ Salvar herói', 'confirm:yes'),
      Markup.button.callback('✏️ Mudar nome', 'confirm:no'),
    ],
    [Markup.button.callback('« Etapa anterior', 'wizard:back')],
  ]);
}

function formatSecondaryLines(stats: SecondaryStats): string {
  return SECONDARY_STAT_ORDER.map((k) => `${SECONDARY_LABEL[k]} ${stats[k]}`).join('\n');
}

function toCoreAttrs(c: {
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

export function formatDraftConfirm(c: Character) {
  const race = c.race ? RACE_LABEL[c.race] : '?';
  const cls = c.characterClass ? CLASS_LABEL[c.characterClass] : '?';

  const finalAttrs = toCoreAttrs(c);
  const { hp, mana, stamina } =
    c.characterClass && c.race
      ? deriveHpManaStamina(c.characterClass, finalAttrs)
      : { hp: 0, mana: 0, stamina: 0 };

  const attrLines = ATTR_KEYS.map((k) => `${ATTR_NAME_FULL[k]} ${finalAttrs[k]}`).join('\n');

  const statusBlock = formatStatusEmojiBlock([
    emojiResourceBarBlock(`❤️ Vida ${hp}/${hp}`, hp, hp, 'hp'),
    emojiResourceBarBlock(`🔮 Mana ${mana}/${mana}`, mana, mana, 'mana'),
    emojiResourceBarBlock(`⚡ Stamina ${stamina}/${stamina}`, stamina, stamina, 'stamina'),
    emojiResourceBarBlock(
      `✨ Energia ${FIXED_ENERGY_MVP}/${FIXED_ENERGY_MVP}`,
      FIXED_ENERGY_MVP,
      FIXED_ENERGY_MVP,
      'energy',
    ),
  ]);

  const secondary = deriveSecondaryStats(finalAttrs);

  return (
    `✨ Passo 4/4 · Confirme a ficha\n` +
    `${SECTION_RULE}\n\n` +
    `👤 ${c.name}\n` +
    `🧬 ${race}  ·  ⚔ ${cls}\n\n` +
    `${SECTION_RULE}\n` +
    `📊 Atributos\n` +
    `${attrLines}\n\n` +
    `${SECTION_RULE}\n` +
    `❤️ Recursos\n` +
    `${statusBlock}\n\n` +
    `${SECTION_RULE}\n` +
    `⚔️ Atributos secundários\n` +
    `${formatSecondaryLines(secondary)}`
  );
}

export function formatSheet(c: Character) {
  const race = c.race ? RACE_LABEL[c.race] : '—';
  const cls = c.characterClass ? CLASS_LABEL[c.characterClass] : '—';
  const attrBlock = ATTR_KEYS.map((k) => `${ATTR_NAME_FULL[k]} ${c[k]}`).join('\n');
  const secondary = deriveSecondaryStats(toCoreAttrs(c));
  const hp = c.hp;
  const mana = c.mana;
  const stamina = c.stamina;
  const energy = c.energy;
  const statusBlock = formatStatusEmojiBlock([
    emojiResourceBarBlock(`❤️ Vida ${hp}/${hp}`, hp, hp, 'hp'),
    emojiResourceBarBlock(`🔮 Mana ${mana}/${mana}`, mana, mana, 'mana'),
    emojiResourceBarBlock(`⚡ Stamina ${stamina}/${stamina}`, stamina, stamina, 'stamina'),
    emojiResourceBarBlock(`✨ Energia ${energy}/${energy}`, energy, Math.max(1, energy), 'energy'),
  ]);
  return (
    `🧙 ${c.name}\n` +
    `${SECTION_RULE}\n` +
    `${cls}  ·  ${race}  ·  Nv. ${c.level}\n\n` +
    `❤️ Recursos\n` +
    `${statusBlock}\n\n` +
    `${SECTION_RULE}\n` +
    `📊 Atributos\n` +
    `${attrBlock}\n\n` +
    `${SECTION_RULE}\n` +
    `⚔️ Atributos secundários\n` +
    `${formatSecondaryLines(secondary)}\n\n` +
    `🎯 Skills — em breve\n` +
    `🎒 Equipamentos — em breve`
  );
}

export function parseRace(value: string): Race | null {
  return (Object.values(Race) as string[]).includes(value) ? (value as Race) : null;
}

export function parseClass(value: string): CharacterClass | null {
  return (Object.values(CharacterClass) as string[]).includes(value)
    ? (value as CharacterClass)
    : null;
}
