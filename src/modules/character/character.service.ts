import { Injectable } from '@nestjs/common';
import { CharacterClass, CreationStep, Race } from '@prisma/client';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { InventoryService } from '../inventory/inventory.service';
import { ATTR_CREATION_BASE, ATTR_POINTS_AT_CREATION, FIXED_ENERGY_MVP } from './character.constants';
import { applyClass } from './class-modifiers';
import { applyRacial, deriveHpManaStamina, type CoreAttrs } from './character.derivation';

@Injectable()
export class CharacterService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly inventory: InventoryService,
  ) {}

  async ensureAccount(telegramUserId: bigint, username?: string) {
    return this.prisma.telegramAccount.upsert({
      where: { telegramUserId },
      create: { telegramUserId, username: username ?? null },
      update: { username: username ?? undefined },
    });
  }

  async getCompletedCharacter(accountId: string) {
    return this.prisma.character.findFirst({
      where: { accountId, isComplete: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getDraft(accountId: string) {
    return this.prisma.character.findFirst({
      where: { accountId, isComplete: false },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async startNewDraft(accountId: string) {
    const existingComplete = await this.getCompletedCharacter(accountId);
    if (existingComplete) {
      throw new Error('Você já possui um personagem. Use /personagem para visualizar.');
    }
    await this.prisma.character.deleteMany({ where: { accountId, isComplete: false } });
    return this.prisma.character.create({
      data: {
        accountId,
        creationStep: CreationStep.CLASS,
        attributePointsRemaining: ATTR_POINTS_AT_CREATION,
        strength: ATTR_CREATION_BASE,
        dexterity: ATTR_CREATION_BASE,
        intelligence: ATTR_CREATION_BASE,
        vitality: ATTR_CREATION_BASE,
        resilience: ATTR_CREATION_BASE,
        vigorAttribute: ATTR_CREATION_BASE,
      },
    });
  }

  /** Fluxo M1: classe primeiro, depois raça, nome, confirmar. */
  async setClass(accountId: string, characterClass: CharacterClass) {
    const draft = await this.requireDraft(accountId, CreationStep.CLASS);
    const zero: CoreAttrs = {
      strength: ATTR_CREATION_BASE,
      dexterity: ATTR_CREATION_BASE,
      intelligence: ATTR_CREATION_BASE,
      vitality: ATTR_CREATION_BASE,
      resilience: ATTR_CREATION_BASE,
      vigorAttribute: ATTR_CREATION_BASE,
    };
    const withClass = applyClass(characterClass, zero);
    return this.prisma.character.update({
      where: { id: draft.id },
      data: {
        characterClass,
        creationStep: CreationStep.RACE,
        strength: withClass.strength,
        dexterity: withClass.dexterity,
        intelligence: withClass.intelligence,
        vitality: withClass.vitality,
        resilience: withClass.resilience,
        vigorAttribute: withClass.vigorAttribute,
      },
    });
  }

  async setRace(accountId: string, race: Race) {
    const draft = await this.requireDraft(accountId, CreationStep.RACE);
    const base: CoreAttrs = {
      strength: draft.strength,
      dexterity: draft.dexterity,
      intelligence: draft.intelligence,
      vitality: draft.vitality,
      resilience: draft.resilience,
      vigorAttribute: draft.vigorAttribute,
    };
    const withRace = applyRacial(race, base);
    return this.prisma.character.update({
      where: { id: draft.id },
      data: {
        race,
        creationStep: CreationStep.NAME,
        strength: withRace.strength,
        dexterity: withRace.dexterity,
        intelligence: withRace.intelligence,
        vitality: withRace.vitality,
        resilience: withRace.resilience,
        vigorAttribute: withRace.vigorAttribute,
      },
    });
  }

  /** Volta da etapa raça → classe (limpa classe e zera atributos). */
  async goBackToClass(accountId: string) {
    const draft = await this.requireDraft(accountId, CreationStep.RACE);
    const z = ATTR_CREATION_BASE;
    return this.prisma.character.update({
      where: { id: draft.id },
      data: {
        creationStep: CreationStep.CLASS,
        characterClass: null,
        race: null,
        name: null,
        strength: z,
        dexterity: z,
        intelligence: z,
        vitality: z,
        resilience: z,
        vigorAttribute: z,
      },
    });
  }

  /** Volta da etapa nome → raça (limpa raça e nome; mantém só atributos da classe). */
  async goBackToRace(accountId: string) {
    const draft = await this.requireDraft(accountId, CreationStep.NAME);
    if (!draft.characterClass) {
      throw new Error('Rascunho sem classe. Use /start.');
    }
    const zero: CoreAttrs = {
      strength: ATTR_CREATION_BASE,
      dexterity: ATTR_CREATION_BASE,
      intelligence: ATTR_CREATION_BASE,
      vitality: ATTR_CREATION_BASE,
      resilience: ATTR_CREATION_BASE,
      vigorAttribute: ATTR_CREATION_BASE,
    };
    const withClass = applyClass(draft.characterClass, zero);
    return this.prisma.character.update({
      where: { id: draft.id },
      data: {
        creationStep: CreationStep.RACE,
        race: null,
        name: null,
        strength: withClass.strength,
        dexterity: withClass.dexterity,
        intelligence: withClass.intelligence,
        vitality: withClass.vitality,
        resilience: withClass.resilience,
        vigorAttribute: withClass.vigorAttribute,
      },
    });
  }

  async setCharacterName(accountId: string, rawName: string) {
    const draft = await this.requireDraft(accountId, CreationStep.NAME);
    const name = rawName.trim();
    if (name.length < 2 || name.length > 32) {
      throw new Error('Nome deve ter entre 2 e 32 caracteres.');
    }
    if (!/^[\p{L}\p{N} ]+$/u.test(name)) {
      throw new Error('Use apenas letras, números e espaços no nome.');
    }
    return this.prisma.character.update({
      where: { id: draft.id },
      data: { name, creationStep: CreationStep.CONFIRM },
    });
  }

  async finalize(accountId: string, confirm: boolean) {
    const draft = await this.requireDraft(accountId, CreationStep.CONFIRM);
    if (!confirm) {
      return this.prisma.character.update({
        where: { id: draft.id },
        data: { creationStep: CreationStep.NAME },
      });
    }
    if (!draft.race || !draft.characterClass || !draft.name) {
      throw new Error('Rascunho incompleto.');
    }
    const attrs: CoreAttrs = {
      strength: draft.strength,
      dexterity: draft.dexterity,
      intelligence: draft.intelligence,
      vitality: draft.vitality,
      resilience: draft.resilience,
      vigorAttribute: draft.vigorAttribute,
    };
    const { hp, mana, stamina } = deriveHpManaStamina(draft.characterClass, attrs);

    const done = await this.prisma.character.update({
      where: { id: draft.id },
      data: {
        hp,
        mana,
        stamina,
        energy: FIXED_ENERGY_MVP,
        isComplete: true,
        creationStep: CreationStep.DONE,
      },
    });
    await this.inventory.onCharacterCreated(done.id);
    return done;
  }

  private async requireDraft(accountId: string, expected: CreationStep) {
    const draft = await this.getDraft(accountId);
    if (!draft) {
      throw new Error('Nenhum rascunho ativo. Use /start.');
    }
    if (draft.creationStep !== expected) {
      throw new Error('Etapa inválida para esta ação. Use /start para ver o menu.');
    }
    return draft;
  }
}
