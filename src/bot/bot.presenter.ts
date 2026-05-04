import { Character, CharacterClass, EquipmentSlot, ItemType, Race } from '@prisma/client';
import { Markup } from 'telegraf';
import { ATTR_CREATION_BASE, FIXED_ENERGY_MVP } from '../modules/character/character.constants';
import { applyClass } from '../modules/character/class-modifiers';
import {
  deriveHpManaStamina,
  deriveSecondaryStats,
  SECONDARY_STAT_ORDER,
  toCoreAttrsFromCharacter,
  type CoreAttrs,
  type SecondaryStats,
} from '../modules/character/character.derivation';
import { BAG_SLOT_COUNT } from '../modules/inventory/inventory.constants';
import type { InventoryItemWithDef } from '../modules/inventory/inventory.service';
import {
  MSG_HUB_CHOOSE_ACTION,
  MSG_HUB_FOOTER_LINES,
  MSG_INV_BAG_TITLE,
  MSG_INV_EQUIPPED_TITLE,
  MSG_INV_OUT_OF_COMBAT_ONLY,
  MSG_INV_ROOT_TITLE,
  MSG_SHEET_INCLUDES_EQUIPMENT,
  SECTION_RULE,
} from './bot.copy';
import {
  ATTR_NAME_FULL,
  CLASS_LABEL,
  EQUIPMENT_SLOT_LABEL,
  ITEM_RARITY_LABEL,
  ITEM_TYPE_LABEL,
  RACE_LABEL,
  SECONDARY_LABEL,
} from './bot.labels';

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
  return formatDraftPrimariesSection('📊 Atributos (classe)', toCoreAttrsFromCharacter(c));
}

/**
 * Após escolher a raça: atributos finais da criação, recursos derivados e secundários
 * (ainda sem nome / confirmação).
 */
export function formatPostRaceReveal(c: Character): string {
  if (!c.characterClass || !c.race) {
    return '';
  }
  const attrs = toCoreAttrsFromCharacter(c);
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

/** Painel inicial do herói (M2): classe, raça, nível e recursos — estilo `examples/texto-exemplo.txt`. */
export function formatCharacterHub(c: Character, effectiveAttrs?: CoreAttrs) {
  const race = c.race ? RACE_LABEL[c.race] : '—';
  const cls = c.characterClass ? CLASS_LABEL[c.characterClass] : '—';
  const attrs = effectiveAttrs ?? toCoreAttrsFromCharacter(c);
  let hp = c.hp;
  let mana = c.mana;
  let stamina = c.stamina;
  const energy = c.energy;
  let maxHp = Math.max(1, hp);
  let maxMana = Math.max(1, mana);
  let maxStamina = Math.max(1, stamina);
  if (c.characterClass) {
    const maxes = deriveHpManaStamina(c.characterClass, attrs);
    hp = Math.min(Math.max(0, c.hp), maxes.hp);
    mana = Math.min(Math.max(0, c.mana), maxes.mana);
    stamina = Math.min(Math.max(0, c.stamina), maxes.stamina);
    maxHp = maxes.hp;
    maxMana = maxes.mana;
    maxStamina = maxes.stamina;
  }
  const statusBlock = formatStatusEmojiBlock([
    emojiResourceBarBlock(`❤️ Vida ${hp}/${maxHp}`, hp, maxHp, 'hp'),
    emojiResourceBarBlock(`🔮 Mana ${mana}/${maxMana}`, mana, maxMana, 'mana'),
    emojiResourceBarBlock(`⚡ Stamina ${stamina}/${maxStamina}`, stamina, maxStamina, 'stamina'),
    emojiResourceBarBlock(`✨ Energia ${energy}/${energy}`, energy, Math.max(1, energy), 'energy'),
  ]);
  return (
    `📍 ${c.name ?? 'Herói'}\n` +
    `${SECTION_RULE}\n` +
    `⚔️ ${cls} · 🧬 ${race} · Nv. ${c.level}\n\n` +
    `❤️ Recursos\n` +
    `${statusBlock}\n\n` +
    `${SECTION_RULE}\n` +
    `${MSG_HUB_FOOTER_LINES}\n\n` +
    `${SECTION_RULE}\n` +
    `${MSG_HUB_CHOOSE_ACTION}`
  );
}

/**
 * Meu perfil: primários + secundários (e nota de equipamento quando houver bônus).
 * Recursos ficam no hub do herói.
 */
export function formatProfile(c: Character, effectiveAttrs?: CoreAttrs) {
  const race = c.race ? RACE_LABEL[c.race] : '—';
  const cls = c.characterClass ? CLASS_LABEL[c.characterClass] : '—';
  const attrs = effectiveAttrs ?? toCoreAttrsFromCharacter(c);
  const attrBlock = ATTR_KEYS.map((k) => `${ATTR_NAME_FULL[k]} ${attrs[k]}`).join('\n');
  const secondary = deriveSecondaryStats(attrs);
  const base = toCoreAttrsFromCharacter(c);
  const hasEquipBonus =
    !!effectiveAttrs && ATTR_KEYS.some((k) => effectiveAttrs[k] !== base[k]);
  const equipFoot = hasEquipBonus ? `\n\n${MSG_SHEET_INCLUDES_EQUIPMENT}` : '';
  return (
    `📊 Meu perfil\n` +
    `${SECTION_RULE}\n\n` +
    `👤 ${c.name}\n` +
    `${cls} · ${race} · Nv. ${c.level}\n\n` +
    `${SECTION_RULE}\n` +
    `📊 Atributos\n` +
    `${attrBlock}\n\n` +
    `${SECTION_RULE}\n` +
    `⚔️ Atributos secundários\n` +
    `${formatSecondaryLines(secondary)}${equipFoot}`
  );
}

/** Botões no estilo do exemplo (uma ação por linha); Mapas em diante são interativos. */
export function characterHubKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('🗺️ Mapas', 'hub:stub:mapas')],
    [Markup.button.callback('⚔️ Caçar', 'hub:stub:cacar')],
    [Markup.button.callback('📊 Meu perfil', 'profile:show')],
    [Markup.button.callback('🎒 Inventário', 'inv:root')],
    [Markup.button.callback('🏪 Comércio', 'hub:stub:comercio')],
    [Markup.button.callback('❤️‍🩹 Estalagem', 'hub:stub:estalagem')],
    [Markup.button.callback('⚡ Energia', 'hub:stub:energia')],
    [Markup.button.callback('🗼 Torre Infinita', 'hub:stub:torre')],
  ]);
}

/** Volta ao painel do personagem (hub), não ao /start. */
export function profileKeyboard() {
  return Markup.inlineKeyboard([[Markup.button.callback('« Menu', 'char:hub')]]);
}

export function raceKeyboard() {
  const row = (slice: Race[]) =>
    slice.map((r) => Markup.button.callback(RACE_LABEL[r], `race:${r}`));
  return Markup.inlineKeyboard([
    row(RACES.slice(0, 3)),
    row(RACES.slice(3, 6)),
    [
      Markup.button.callback('« Trocar classe', 'wizard:back'),
      Markup.button.callback('« Menu', 'char:hub'),
    ],
  ]);
}

/** Teclado no passo nome (texto + voltar etapa). */
export function namePromptKeyboard() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('« Trocar raça', 'wizard:back'),
      Markup.button.callback('« Menu', 'char:hub'),
    ],
  ]);
}

export function classKeyboard() {
  return Markup.inlineKeyboard([
    CLASSES.map((c) => Markup.button.callback(CLASS_LABEL[c], `class:${c}`)),
    [Markup.button.callback('« Menu', 'char:hub')],
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

export function formatDraftConfirm(c: Character) {
  const race = c.race ? RACE_LABEL[c.race] : '?';
  const cls = c.characterClass ? CLASS_LABEL[c.characterClass] : '?';

  const finalAttrs = toCoreAttrsFromCharacter(c);
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

const BAG_PAGE_SIZE = 5;

export function formatInventoryRoot(bagUsed: number, equippedCount: number): string {
  return (
    MSG_INV_ROOT_TITLE +
    `Ocupação da bolsa: ${bagUsed}/${BAG_SLOT_COUNT}\n` +
    `Peças equipadas: ${equippedCount}/9`
  );
}

export function inventoryRootKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('📦 Ver bolsa', 'inv:bag:0')],
    [Markup.button.callback('🛡 Equipados', 'inv:equipped')],
    [Markup.button.callback('« Menu', 'char:hub')],
  ]);
}

export function formatBagPage(
  grid: { index: number; item: InventoryItemWithDef | null }[],
  page: number,
): string {
  const totalPages = Math.ceil(BAG_SLOT_COUNT / BAG_PAGE_SIZE);
  const p = Math.min(Math.max(0, page), Math.max(0, totalPages - 1));
  const start = p * BAG_PAGE_SIZE;
  const slice = grid.slice(start, start + BAG_PAGE_SIZE);
  const lines = slice.map(({ index, item }) => {
    const num = String(index + 1).padStart(2, '0');
    if (!item) {
      return `${num} · — vazio —`;
    }
    const st = item.stackCount > 1 ? ` ×${item.stackCount}` : '';
    return `${num} · ${ITEM_TYPE_LABEL[item.itemDefinition.itemType]} · ${item.itemDefinition.name}${st}`;
  });
  return (
    MSG_INV_BAG_TITLE +
    `Página ${p + 1}/${Math.max(1, totalPages)}\n\n` +
    lines.join('\n')
  );
}

export function bagPageKeyboard(page: number) {
  const totalPages = Math.ceil(BAG_SLOT_COUNT / BAG_PAGE_SIZE);
  const p = Math.min(Math.max(0, page), Math.max(0, totalPages - 1));
  const start = p * BAG_PAGE_SIZE;
  const rows: ReturnType<typeof Markup.button.callback>[][] = [];
  for (let i = 0; i < BAG_PAGE_SIZE; i++) {
    const slotIndex = start + i;
    if (slotIndex >= BAG_SLOT_COUNT) {
      break;
    }
    rows.push([
      Markup.button.callback(
        `Slot ${String(slotIndex + 1).padStart(2, '0')}`,
        `inv:slot:${slotIndex}:${p}`,
      ),
    ]);
  }
  const nav: ReturnType<typeof Markup.button.callback>[] = [];
  if (p > 0) {
    nav.push(Markup.button.callback('« Pág.', `inv:bag:${p - 1}`));
  }
  if (p < totalPages - 1) {
    nav.push(Markup.button.callback('Pág. »', `inv:bag:${p + 1}`));
  }
  if (nav.length) {
    rows.push(nav);
  }
  rows.push([
    Markup.button.callback('« Inventário', 'inv:root'),
    Markup.button.callback('« Menu', 'char:hub'),
  ]);
  return Markup.inlineKeyboard(rows);
}

export function formatSlotDetail(
  slotIndex: number,
  item: InventoryItemWithDef | null,
): string {
  const num = String(slotIndex + 1).padStart(2, '0');
  if (!item) {
    return MSG_INV_BAG_TITLE + `Slot ${num}\n\n— Vazio —`;
  }
  return formatItemDetailBlock(item, `Slot ${num}`);
}

export function formatEquippedList(items: InventoryItemWithDef[]): string {
  if (!items.length) {
    return MSG_INV_EQUIPPED_TITLE + 'Nada equipado.';
  }
  const lines = items.map(
    (it) =>
      `${EQUIPMENT_SLOT_LABEL[it.equippedSlot!]} · ${it.itemDefinition.name} (${ITEM_RARITY_LABEL[it.itemDefinition.rarity]})`,
  );
  return MSG_INV_EQUIPPED_TITLE + lines.join('\n');
}

export function equippedKeyboard(items: InventoryItemWithDef[]) {
  const rows = items.map((it) => [
    Markup.button.callback(
      `⎋ ${EQUIPMENT_SLOT_LABEL[it.equippedSlot!]}`,
      `inv:uneq:${it.equippedSlot}`,
    ),
  ]);
  rows.push([
    Markup.button.callback('« Inventário', 'inv:root'),
    Markup.button.callback('« Menu', 'char:hub'),
  ]);
  return Markup.inlineKeyboard(rows);
}

function formatItemDetailBlock(item: InventoryItemWithDef, slotLabel: string): string {
  const def = item.itemDefinition;
  const rarity = ITEM_RARITY_LABEL[def.rarity];
  const ty = ITEM_TYPE_LABEL[def.itemType];
  const bonus = [
    def.bonusStrength ? `FOR +${def.bonusStrength}` : '',
    def.bonusDexterity ? `DES +${def.bonusDexterity}` : '',
    def.bonusIntelligence ? `INT +${def.bonusIntelligence}` : '',
    def.bonusVitality ? `VIT +${def.bonusVitality}` : '',
    def.bonusResilience ? `RES +${def.bonusResilience}` : '',
    def.bonusVigor ? `VIG +${def.bonusVigor}` : '',
  ]
    .filter(Boolean)
    .join(' · ');
  const eff =
    def.effectHealHp || def.effectRestoreMana
      ? `Cura +${def.effectHealHp} HP · Mana +${def.effectRestoreMana}\n${MSG_INV_OUT_OF_COMBAT_ONLY}`
      : '';
  return (
    `🔎 ${def.name}\n` +
    `${SECTION_RULE}\n` +
    `${slotLabel}\n` +
    `${ty} · ${rarity}\n` +
    (def.wearSlot ? `Ocupa: ${EQUIPMENT_SLOT_LABEL[def.wearSlot]}\n` : '') +
    (bonus ? `Bônus: ${bonus}\n` : '') +
    (eff ? `\n${eff}\n` : '')
  );
}

export function formatItemDetailFromBag(item: InventoryItemWithDef): string {
  return formatItemDetailBlock(item, 'Na bolsa');
}

export function slotEmptyKeyboard(bagPage: number) {
  return Markup.inlineKeyboard([
    [Markup.button.callback('« Bolsa', `inv:bag:${bagPage}`)],
    [Markup.button.callback('« Menu', 'char:hub')],
  ]);
}

export function itemDetailKeyboard(item: InventoryItemWithDef, bagPage: number) {
  const row: ReturnType<typeof Markup.button.callback>[] = [];
  if (item.itemDefinition.itemType === ItemType.WEAPON || item.itemDefinition.itemType === ItemType.ARMOR) {
    row.push(Markup.button.callback('⬆ Equipar', `inv:eq:${item.id}`));
  }
  if (item.itemDefinition.itemType === ItemType.CONSUMABLE) {
    row.push(Markup.button.callback('🧪 Usar', `inv:use:${item.id}`));
  }
  const kb: ReturnType<typeof Markup.button.callback>[][] = [];
  if (row.length) {
    kb.push(row);
  }
  kb.push([
    Markup.button.callback('« Bolsa', `inv:bag:${bagPage}`),
    Markup.button.callback('« Inventário', 'inv:root'),
  ]);
  kb.push([Markup.button.callback('« Menu', 'char:hub')]);
  return Markup.inlineKeyboard(kb);
}

export function parseEquipmentSlot(value: string): EquipmentSlot | null {
  return (Object.values(EquipmentSlot) as string[]).includes(value)
    ? (value as EquipmentSlot)
    : null;
}

export function parseRace(value: string): Race | null {
  return (Object.values(Race) as string[]).includes(value) ? (value as Race) : null;
}

export function parseClass(value: string): CharacterClass | null {
  return (Object.values(CharacterClass) as string[]).includes(value)
    ? (value as CharacterClass)
    : null;
}
