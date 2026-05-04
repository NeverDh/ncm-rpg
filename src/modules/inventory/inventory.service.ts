import { Injectable } from '@nestjs/common';
import {
  Character,
  EquipmentSlot,
  ItemDefinition,
  ItemType,
  Prisma,
} from '@prisma/client';
import { PrismaService } from '../../infra/prisma/prisma.service';
import {
  addCoreAttrs,
  deriveHpManaStamina,
  toCoreAttrsFromCharacter,
  zeroCoreAttrs,
  type CoreAttrs,
} from '../character/character.derivation';
import { BAG_SLOT_COUNT, STARTER_ITEM_CODES } from './inventory.constants';

export type InventoryItemWithDef = {
  id: string;
  stackCount: number;
  bagSlotIndex: number | null;
  equippedSlot: EquipmentSlot | null;
  itemDefinition: ItemDefinition;
};

function definitionPrimaryBonus(def: ItemDefinition): CoreAttrs {
  return {
    strength: def.bonusStrength,
    dexterity: def.bonusDexterity,
    intelligence: def.bonusIntelligence,
    vitality: def.bonusVitality,
    resilience: def.bonusResilience,
    vigorAttribute: def.bonusVigor,
  };
}

async function firstFreeBagSlotInTx(
  tx: Prisma.TransactionClient,
  characterId: string,
): Promise<number | null> {
  const used = await tx.inventoryItem.findMany({
    where: { characterId, bagSlotIndex: { not: null } },
    select: { bagSlotIndex: true },
  });
  const taken = new Set(used.map((u) => u.bagSlotIndex as number));
  for (let i = 0; i < BAG_SLOT_COUNT; i++) {
    if (!taken.has(i)) {
      return i;
    }
  }
  return null;
}

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async onCharacterCreated(characterId: string): Promise<void> {
    const n = await this.prisma.inventoryItem.count({ where: { characterId } });
    if (n > 0) {
      return;
    }
    const defs = await this.prisma.itemDefinition.findMany({
      where: { code: { in: [...STARTER_ITEM_CODES] } },
    });
    const byCode = new Map(defs.map((d) => [d.code, d]));
    let slot = 0;
    for (const code of STARTER_ITEM_CODES) {
      if (slot >= BAG_SLOT_COUNT) {
        break;
      }
      const def = byCode.get(code);
      if (!def) {
        continue;
      }
      const stack =
        def.itemType === ItemType.CONSUMABLE && (def.effectHealHp > 0 || def.effectRestoreMana > 0)
          ? 3
          : 1;
      await this.prisma.inventoryItem.create({
        data: {
          characterId,
          itemDefinitionId: def.id,
          stackCount: stack,
          bagSlotIndex: slot,
        },
      });
      slot += 1;
    }
  }

  async listBag(characterId: string): Promise<InventoryItemWithDef[]> {
    const rows = await this.prisma.inventoryItem.findMany({
      where: { characterId, bagSlotIndex: { not: null } },
      include: { itemDefinition: true },
      orderBy: { bagSlotIndex: 'asc' },
    });
    return rows.map((r) => ({
      id: r.id,
      stackCount: r.stackCount,
      bagSlotIndex: r.bagSlotIndex,
      equippedSlot: r.equippedSlot,
      itemDefinition: r.itemDefinition,
    }));
  }

  async listEquipped(characterId: string): Promise<InventoryItemWithDef[]> {
    const rows = await this.prisma.inventoryItem.findMany({
      where: { characterId, equippedSlot: { not: null } },
      include: { itemDefinition: true },
      orderBy: { equippedSlot: 'asc' },
    });
    return rows.map((r) => ({
      id: r.id,
      stackCount: r.stackCount,
      bagSlotIndex: r.bagSlotIndex,
      equippedSlot: r.equippedSlot,
      itemDefinition: r.itemDefinition,
    }));
  }

  async getBagItem(characterId: string, itemId: string): Promise<InventoryItemWithDef | null> {
    const r = await this.prisma.inventoryItem.findFirst({
      where: { id: itemId, characterId },
      include: { itemDefinition: true },
    });
    if (!r) {
      return null;
    }
    return {
      id: r.id,
      stackCount: r.stackCount,
      bagSlotIndex: r.bagSlotIndex,
      equippedSlot: r.equippedSlot,
      itemDefinition: r.itemDefinition,
    };
  }

  async sumEquippedPrimaryBonuses(characterId: string): Promise<CoreAttrs> {
    const equipped = await this.prisma.inventoryItem.findMany({
      where: { characterId, equippedSlot: { not: null } },
      include: { itemDefinition: true },
    });
    let sum = zeroCoreAttrs();
    for (const row of equipped) {
      sum = addCoreAttrs(sum, definitionPrimaryBonus(row.itemDefinition));
    }
    return sum;
  }

  async resolveEffectiveCoreAttrs(character: Character): Promise<CoreAttrs> {
    const base = toCoreAttrsFromCharacter(character);
    const bonus = await this.sumEquippedPrimaryBonuses(character.id);
    return addCoreAttrs(base, bonus);
  }

  async firstFreeBagSlot(characterId: string): Promise<number | null> {
    return firstFreeBagSlotInTx(this.prisma, characterId);
  }

  async bagItemCount(characterId: string): Promise<number> {
    return this.prisma.inventoryItem.count({
      where: { characterId, bagSlotIndex: { not: null } },
    });
  }

  /** Grade 0..19 com ocupação atual (bolsa fixa M2). */
  async getBagSlotGrid(
    characterId: string,
  ): Promise<{ index: number; item: InventoryItemWithDef | null }[]> {
    const inBag = await this.listBag(characterId);
    const byIndex = new Map<number, InventoryItemWithDef>();
    for (const it of inBag) {
      if (it.bagSlotIndex !== null) {
        byIndex.set(it.bagSlotIndex, it);
      }
    }
    return Array.from({ length: BAG_SLOT_COUNT }, (_, index) => ({
      index,
      item: byIndex.get(index) ?? null,
    }));
  }

  async equipFromBag(characterId: string, inventoryItemId: string): Promise<void> {
    const item = await this.prisma.inventoryItem.findFirst({
      where: { id: inventoryItemId, characterId },
      include: { itemDefinition: true },
    });
    if (!item || item.bagSlotIndex === null) {
      throw new Error('Item não está na bolsa.');
    }
    const def = item.itemDefinition;
    if (def.itemType !== ItemType.WEAPON && def.itemType !== ItemType.ARMOR) {
      throw new Error('Só armas e armaduras podem ser equipadas.');
    }
    if (!def.wearSlot) {
      throw new Error('Item sem slot de uso definido.');
    }
    const targetSlot = def.wearSlot;

    await this.prisma.$transaction(async (tx) => {
      const occupant = await tx.inventoryItem.findFirst({
        where: { characterId, equippedSlot: targetSlot },
      });
      if (occupant) {
        const free = await firstFreeBagSlotInTx(tx, characterId);
        if (free === null) {
          throw new Error('Bolsa cheia (20/20). Desequipe ou use itens para liberar espaço.');
        }
        await tx.inventoryItem.update({
          where: { id: occupant.id },
          data: { equippedSlot: null, bagSlotIndex: free },
        });
      }
      await tx.inventoryItem.update({
        where: { id: item.id },
        data: { equippedSlot: targetSlot, bagSlotIndex: null },
      });
    });
  }

  async unequip(characterId: string, slot: EquipmentSlot): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const worn = await tx.inventoryItem.findFirst({
        where: { characterId, equippedSlot: slot },
      });
      if (!worn) {
        throw new Error('Nada equipado nesse slot.');
      }
      const free = await firstFreeBagSlotInTx(tx, characterId);
      if (free === null) {
        throw new Error('Bolsa cheia (20/20). Libere um slot para desequipar.');
      }
      await tx.inventoryItem.update({
        where: { id: worn.id },
        data: { equippedSlot: null, bagSlotIndex: free },
      });
    });
  }

  async useConsumable(characterId: string, inventoryItemId: string): Promise<void> {
    const char = await this.prisma.character.findFirst({
      where: { id: characterId, isComplete: true },
    });
    if (!char?.characterClass) {
      throw new Error('Personagem inválido.');
    }

    const item = await this.prisma.inventoryItem.findFirst({
      where: { id: inventoryItemId, characterId },
      include: { itemDefinition: true },
    });
    if (!item || item.bagSlotIndex === null) {
      throw new Error('Item não está na bolsa.');
    }
    if (item.itemDefinition.itemType !== ItemType.CONSUMABLE) {
      throw new Error('Não é um consumível.');
    }
    const heal = item.itemDefinition.effectHealHp;
    const mana = item.itemDefinition.effectRestoreMana;
    if (heal <= 0 && mana <= 0) {
      throw new Error('Este consumível não tem efeito configurado.');
    }

    const effective = await this.resolveEffectiveCoreAttrs(char);
    const maxes = deriveHpManaStamina(char.characterClass, effective);

    await this.prisma.$transaction(async (tx) => {
      const locked = await tx.character.findUniqueOrThrow({ where: { id: characterId } });
      let hp = locked.hp + heal;
      let m = locked.mana + mana;
      hp = Math.min(Math.max(0, hp), maxes.hp);
      m = Math.min(Math.max(0, m), maxes.mana);
      const nextStack = item.stackCount - 1;
      if (nextStack <= 0) {
        await tx.inventoryItem.delete({ where: { id: item.id } });
      } else {
        await tx.inventoryItem.update({
          where: { id: item.id },
          data: { stackCount: nextStack },
        });
      }
      await tx.character.update({
        where: { id: characterId },
        data: { hp, mana: m },
      });
    });
  }
}
