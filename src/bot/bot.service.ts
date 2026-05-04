import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreationStep } from '@prisma/client';
import { Telegraf } from 'telegraf';
import { CharacterService } from '../modules/character/character.service';
import { InventoryService } from '../modules/inventory/inventory.service';
import {
  CLASS_BLURB,
  MSG_CHARACTER_CREATED_PREFIX,
  MSG_DRAFT_LOST,
  MSG_ERROR_GENERIC,
  MSG_ERROR_START,
  MSG_INVALID_OPTION,
  MSG_MENU,
  MSG_NO_DRAFT_RESUME,
  MSG_PERSONAGEM_NO_CHAR,
  MSG_SHEET_NO_CHAR,
  MSG_START_WELCOME,
  RACE_BLURB,
  SECTION_RULE,
  WIZARD_NAME_PROMPT,
  WIZARD_NAME_RETRY,
  WIZARD_CLASS_NEXT,
  WIZARD_RACE_INTRO,
} from './bot.copy';
import { CLASS_LABEL, RACE_LABEL } from './bot.labels';
import {
  classKeyboard,
  confirmKeyboard,
  formatAfterClassChosenSummary,
  formatDraftConfirm,
  formatPostRaceReveal,
  bagPageKeyboard,
  characterHubKeyboard,
  equippedKeyboard,
  formatBagPage,
  formatCharacterHub,
  formatEquippedList,
  formatInventoryRoot,
  formatItemDetailFromBag,
  formatProfile,
  formatSlotDetail,
  formatWizardClassIntro,
  inventoryRootKeyboard,
  itemDetailKeyboard,
  mainMenuKeyboard,
  profileKeyboard,
  namePromptKeyboard,
  parseClass,
  parseEquipmentSlot,
  parseRace,
  raceKeyboard,
  slotEmptyKeyboard,
} from './bot.presenter';

@Injectable()
export class BotService implements OnApplicationBootstrap, OnApplicationShutdown {
  private readonly logger = new Logger(BotService.name);
  private bot?: Telegraf;

  constructor(
    private readonly config: ConfigService,
    private readonly characters: CharacterService,
    private readonly inventory: InventoryService,
  ) {}

  async onApplicationBootstrap() {
    const token = this.config.get<string>('botToken');
    if (!token) {
      this.logger.warn('BOT_TOKEN ausente — bot Telegram desligado (HTTP segue ativo).');
      return;
    }

    const bot = new Telegraf(token);

    bot.start(async (ctx) => {
      try {
        const uid = BigInt(ctx.from!.id);
        const account = await this.characters.ensureAccount(uid, ctx.from?.username);
        const draft = await this.characters.getDraft(account.id);
        const complete = await this.characters.getCompletedCharacter(account.id);
        await ctx.reply(MSG_START_WELCOME, mainMenuKeyboard(!!draft, !!complete));
      } catch (e) {
        const msg = e instanceof Error ? e.message : MSG_ERROR_START;
        await ctx.reply(msg);
      }
    });

    bot.command('personagem', async (ctx) => {
      try {
        const uid = BigInt(ctx.from!.id);
        const account = await this.characters.ensureAccount(uid, ctx.from?.username);
        const c = await this.characters.getCompletedCharacter(account.id);
        if (!c) {
          await ctx.reply(MSG_PERSONAGEM_NO_CHAR);
          return;
        }
        await this.inventory.onCharacterCreated(c.id);
        const eff = await this.inventory.resolveEffectiveCoreAttrs(c);
        await ctx.reply(formatCharacterHub(c, eff), characterHubKeyboard());
      } catch (e) {
        const msg = e instanceof Error ? e.message : MSG_ERROR_GENERIC;
        await ctx.reply(msg);
      }
    });

    bot.action('char:hub', async (ctx) => {
      await ctx.answerCbQuery();
      try {
        const uid = BigInt(ctx.from!.id);
        const account = await this.characters.ensureAccount(uid, ctx.from?.username);
        const draft = await this.characters.getDraft(account.id);
        const c = await this.characters.getCompletedCharacter(account.id);
        if (!c) {
          await ctx.editMessageText(MSG_MENU, mainMenuKeyboard(!!draft, false));
          return;
        }
        await this.inventory.onCharacterCreated(c.id);
        const eff = await this.inventory.resolveEffectiveCoreAttrs(c);
        await ctx.editMessageText(formatCharacterHub(c, eff), characterHubKeyboard());
      } catch (e) {
        const msg = e instanceof Error ? e.message : MSG_ERROR_GENERIC;
        await ctx.reply(msg);
      }
    });

    bot.action('profile:show', async (ctx) => {
      await ctx.answerCbQuery();
      try {
        const uid = BigInt(ctx.from!.id);
        const account = await this.characters.ensureAccount(uid, ctx.from?.username);
        const c = await this.characters.getCompletedCharacter(account.id);
        if (!c) {
          await ctx.reply(MSG_SHEET_NO_CHAR);
          return;
        }
        const eff = await this.inventory.resolveEffectiveCoreAttrs(c);
        await ctx.editMessageText(formatProfile(c, eff), profileKeyboard());
      } catch (e) {
        const msg = e instanceof Error ? e.message : MSG_ERROR_GENERIC;
        await ctx.reply(msg);
      }
    });

    bot.action(/^hub:stub:.+$/, async (ctx) => {
      await this.safeAnswerCbQuery(ctx, 'Em breve neste marco ou em M3/M4.', { show_alert: true });
    });

    bot.action('inv:root', async (ctx) => {
      await ctx.answerCbQuery();
      try {
        const uid = BigInt(ctx.from!.id);
        const account = await this.characters.ensureAccount(uid, ctx.from?.username);
        const c = await this.characters.getCompletedCharacter(account.id);
        if (!c) {
          await ctx.reply(MSG_SHEET_NO_CHAR);
          return;
        }
        await this.inventory.onCharacterCreated(c.id);
        const grid = await this.inventory.getBagSlotGrid(c.id);
        const bagUsed = grid.filter((g) => g.item).length;
        const equipped = await this.inventory.listEquipped(c.id);
        await ctx.editMessageText(
          formatInventoryRoot(bagUsed, equipped.length),
          inventoryRootKeyboard(),
        );
      } catch (e) {
        const msg = e instanceof Error ? e.message : MSG_ERROR_GENERIC;
        await ctx.reply(msg);
      }
    });

    bot.action('inv:equipped', async (ctx) => {
      await ctx.answerCbQuery();
      try {
        const uid = BigInt(ctx.from!.id);
        const account = await this.characters.ensureAccount(uid, ctx.from?.username);
        const c = await this.characters.getCompletedCharacter(account.id);
        if (!c) {
          await ctx.reply(MSG_SHEET_NO_CHAR);
          return;
        }
        const equipped = await this.inventory.listEquipped(c.id);
        const kb = equipped.length ? equippedKeyboard(equipped) : inventoryRootKeyboard();
        await ctx.editMessageText(formatEquippedList(equipped), kb);
      } catch (e) {
        const msg = e instanceof Error ? e.message : MSG_ERROR_GENERIC;
        await ctx.reply(msg);
      }
    });

    bot.action(/^inv:bag:(\d+)$/, async (ctx) => {
      await ctx.answerCbQuery();
      try {
        const page = parseInt(ctx.match[1], 10) || 0;
        const uid = BigInt(ctx.from!.id);
        const account = await this.characters.ensureAccount(uid, ctx.from?.username);
        const c = await this.characters.getCompletedCharacter(account.id);
        if (!c) {
          await ctx.reply(MSG_SHEET_NO_CHAR);
          return;
        }
        const grid = await this.inventory.getBagSlotGrid(c.id);
        await ctx.editMessageText(formatBagPage(grid, page), bagPageKeyboard(grid, page));
      } catch (e) {
        const msg = e instanceof Error ? e.message : MSG_ERROR_GENERIC;
        await ctx.reply(msg);
      }
    });

    bot.action(/^inv:slot:(\d+):(\d+)$/, async (ctx) => {
      await ctx.answerCbQuery();
      try {
        const slotIndex = parseInt(ctx.match[1], 10);
        const bagPage = parseInt(ctx.match[2], 10) || 0;
        const uid = BigInt(ctx.from!.id);
        const account = await this.characters.ensureAccount(uid, ctx.from?.username);
        const c = await this.characters.getCompletedCharacter(account.id);
        if (!c) {
          await ctx.reply(MSG_SHEET_NO_CHAR);
          return;
        }
        const grid = await this.inventory.getBagSlotGrid(c.id);
        const cell = grid.find((g) => g.index === slotIndex);
        if (!cell?.item) {
          await ctx.editMessageText(formatSlotDetail(slotIndex, null), slotEmptyKeyboard(bagPage));
          return;
        }
        await ctx.editMessageText(
          formatItemDetailFromBag(cell.item),
          itemDetailKeyboard(cell.item, bagPage),
        );
      } catch (e) {
        const msg = e instanceof Error ? e.message : MSG_ERROR_GENERIC;
        await ctx.reply(msg);
      }
    });

    bot.action(/^inv:eq:([0-9a-f-]{36})$/, async (ctx) => {
      await ctx.answerCbQuery();
      try {
        const itemId = ctx.match[1];
        const uid = BigInt(ctx.from!.id);
        const account = await this.characters.ensureAccount(uid, ctx.from?.username);
        const c = await this.characters.getCompletedCharacter(account.id);
        if (!c) {
          await ctx.reply(MSG_SHEET_NO_CHAR);
          return;
        }
        await this.inventory.equipFromBag(c.id, itemId);
        const grid = await this.inventory.getBagSlotGrid(c.id);
        await ctx.editMessageText(formatBagPage(grid, 0), bagPageKeyboard(grid, 0));
      } catch (e) {
        const msg = e instanceof Error ? e.message : MSG_ERROR_GENERIC;
        await this.safeAnswerCbQuery(ctx, msg, { show_alert: true });
      }
    });

    bot.action(/^inv:use:([0-9a-f-]{36})$/, async (ctx) => {
      await ctx.answerCbQuery();
      try {
        const itemId = ctx.match[1];
        const uid = BigInt(ctx.from!.id);
        const account = await this.characters.ensureAccount(uid, ctx.from?.username);
        const c = await this.characters.getCompletedCharacter(account.id);
        if (!c) {
          await ctx.reply(MSG_SHEET_NO_CHAR);
          return;
        }
        await this.inventory.useConsumable(c.id, itemId);
        const grid = await this.inventory.getBagSlotGrid(c.id);
        await ctx.editMessageText(formatBagPage(grid, 0), bagPageKeyboard(grid, 0));
      } catch (e) {
        const msg = e instanceof Error ? e.message : MSG_ERROR_GENERIC;
        await this.safeAnswerCbQuery(ctx, msg, { show_alert: true });
      }
    });

    bot.action(/^inv:uneq:(.+)$/, async (ctx) => {
      await ctx.answerCbQuery();
      try {
        const slot = parseEquipmentSlot(ctx.match[1]);
        if (!slot) {
          await ctx.reply(MSG_INVALID_OPTION);
          return;
        }
        const uid = BigInt(ctx.from!.id);
        const account = await this.characters.ensureAccount(uid, ctx.from?.username);
        const c = await this.characters.getCompletedCharacter(account.id);
        if (!c) {
          await ctx.reply(MSG_SHEET_NO_CHAR);
          return;
        }
        await this.inventory.unequip(c.id, slot);
        const equipped = await this.inventory.listEquipped(c.id);
        const kb = equipped.length ? equippedKeyboard(equipped) : inventoryRootKeyboard();
        await ctx.editMessageText(formatEquippedList(equipped), kb);
      } catch (e) {
        const msg = e instanceof Error ? e.message : MSG_ERROR_GENERIC;
        await this.safeAnswerCbQuery(ctx, msg, { show_alert: true });
      }
    });

    bot.action('wizard:create', async (ctx) => {
      await ctx.answerCbQuery();
      try {
        const uid = BigInt(ctx.from!.id);
        const account = await this.characters.ensureAccount(uid, ctx.from?.username);
        await this.characters.startNewDraft(account.id);
        await ctx.editMessageText(formatWizardClassIntro(), classKeyboard());
      } catch (e) {
        const msg = e instanceof Error ? e.message : MSG_ERROR_GENERIC;
        await ctx.reply(msg);
      }
    });

    bot.action('wizard:resume', async (ctx) => {
      await ctx.answerCbQuery();
      try {
        const uid = BigInt(ctx.from!.id);
        const account = await this.characters.ensureAccount(uid, ctx.from?.username);
        const draft = await this.characters.getDraft(account.id);
        if (!draft) {
          await ctx.reply(MSG_NO_DRAFT_RESUME);
          return;
        }
        await this.replyForStep(ctx, draft.creationStep, account.id);
      } catch (e) {
        const msg = e instanceof Error ? e.message : MSG_ERROR_GENERIC;
        await ctx.reply(msg);
      }
    });

    bot.action('wizard:back', async (ctx) => {
      await ctx.answerCbQuery();
      try {
        const uid = BigInt(ctx.from!.id);
        const account = await this.characters.ensureAccount(uid, ctx.from?.username);
        const draft = await this.characters.getDraft(account.id);
        if (!draft) {
          await ctx.reply(MSG_NO_DRAFT_RESUME);
          return;
        }
        switch (draft.creationStep) {
          case CreationStep.CONFIRM: {
            await this.characters.finalize(account.id, false);
            await ctx.editMessageText(WIZARD_NAME_PROMPT, namePromptKeyboard());
            break;
          }
          case CreationStep.NAME: {
            await this.characters.goBackToRace(account.id);
            const d = await this.characters.getDraft(account.id);
            if (!d?.characterClass) {
              await ctx.editMessageText(MSG_DRAFT_LOST, mainMenuKeyboard(false, false));
              return;
            }
            const classBlock =
              `⚔ Classe: ${CLASS_LABEL[d.characterClass]}\n\n` +
              `${formatAfterClassChosenSummary(d)}\n\n`;
            await ctx.editMessageText(classBlock + WIZARD_RACE_INTRO, raceKeyboard());
            break;
          }
          case CreationStep.RACE: {
            await this.characters.goBackToClass(account.id);
            await ctx.editMessageText(formatWizardClassIntro(), classKeyboard());
            break;
          }
          default:
            await ctx.reply('Não há etapa anterior aqui. Use « Menu se estiver preso.');
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : MSG_ERROR_GENERIC;
        await ctx.reply(msg);
      }
    });

    bot.action(/^class:(.+)$/, async (ctx) => {
      await ctx.answerCbQuery();
      try {
        const code = ctx.match[1];
        const characterClass = parseClass(code);
        if (!characterClass) {
          await ctx.reply(MSG_INVALID_OPTION);
          return;
        }
        const uid = BigInt(ctx.from!.id);
        const account = await this.characters.ensureAccount(uid, ctx.from?.username);
        const afterClass = await this.characters.setClass(account.id, characterClass);
        await ctx.editMessageText(
          `⚔ Passo 1/4 · ${CLASS_LABEL[characterClass]}\n` +
            `${SECTION_RULE}\n\n` +
            `${CLASS_BLURB[characterClass]}\n\n` +
            `${formatAfterClassChosenSummary(afterClass)}\n\n` +
            WIZARD_CLASS_NEXT,
          raceKeyboard(),
        );
      } catch (e) {
        const msg = e instanceof Error ? e.message : MSG_ERROR_GENERIC;
        await ctx.reply(msg);
      }
    });

    bot.action(/^race:(.+)$/, async (ctx) => {
      await ctx.answerCbQuery();
      try {
        const code = ctx.match[1];
        const race = parseRace(code);
        if (!race) {
          await ctx.reply(MSG_INVALID_OPTION);
          return;
        }
        const uid = BigInt(ctx.from!.id);
        const account = await this.characters.ensureAccount(uid, ctx.from?.username);
        const afterRace = await this.characters.setRace(account.id, race);
        await ctx.editMessageText(
          `🧬 Passo 2/4 · ${RACE_LABEL[race]}\n` +
            `${SECTION_RULE}\n\n` +
            `${RACE_BLURB[race]}\n\n` +
            `${formatPostRaceReveal(afterRace)}\n\n` +
            WIZARD_NAME_PROMPT,
          namePromptKeyboard(),
        );
      } catch (e) {
        const msg = e instanceof Error ? e.message : MSG_ERROR_GENERIC;
        await ctx.reply(msg);
      }
    });

    bot.action('confirm:yes', async (ctx) => {
      try {
        const uid = BigInt(ctx.from!.id);
        const account = await this.characters.ensureAccount(uid, ctx.from?.username);
        const done = await this.characters.finalize(account.id, true);
        await this.safeAnswerCbQuery(ctx);
        const eff = await this.inventory.resolveEffectiveCoreAttrs(done);
        const text = MSG_CHARACTER_CREATED_PREFIX + formatCharacterHub(done, eff);
        const kb = characterHubKeyboard();
        try {
          await ctx.editMessageText(text, kb);
        } catch (editErr) {
          this.logger.warn(
            `editMessageText após confirmar falhou, enviando nova mensagem: ${editErr instanceof Error ? editErr.message : editErr}`,
          );
          await ctx.reply(text, kb);
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : MSG_ERROR_GENERIC;
        await this.safeAnswerCbQuery(ctx, msg, { show_alert: true });
        await ctx.reply(msg).catch(() => undefined);
      }
    });

    bot.action('confirm:no', async (ctx) => {
      try {
        const uid = BigInt(ctx.from!.id);
        const account = await this.characters.ensureAccount(uid, ctx.from?.username);
        await this.characters.finalize(account.id, false);
        await this.safeAnswerCbQuery(ctx);
        const text = WIZARD_NAME_RETRY;
        try {
          await ctx.editMessageText(text, namePromptKeyboard());
        } catch (editErr) {
          this.logger.warn(
            `editMessageText após voltar ao nome falhou: ${editErr instanceof Error ? editErr.message : editErr}`,
          );
          await ctx.reply(text);
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : MSG_ERROR_GENERIC;
        await this.safeAnswerCbQuery(ctx, msg, { show_alert: true });
        await ctx.reply(msg).catch(() => undefined);
      }
    });

    bot.action('sheet:show', async (ctx) => {
      await ctx.answerCbQuery();
      try {
        const uid = BigInt(ctx.from!.id);
        const account = await this.characters.ensureAccount(uid, ctx.from?.username);
        const c = await this.characters.getCompletedCharacter(account.id);
        if (!c) {
          await ctx.reply(MSG_SHEET_NO_CHAR);
          return;
        }
        await this.inventory.onCharacterCreated(c.id);
        const eff = await this.inventory.resolveEffectiveCoreAttrs(c);
        const text = formatCharacterHub(c, eff);
        const kb = characterHubKeyboard();
        try {
          await ctx.editMessageText(text, kb);
        } catch {
          await ctx.reply(text, kb);
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : MSG_ERROR_GENERIC;
        await ctx.reply(msg);
      }
    });

    bot.on('text', async (ctx, next) => {
      if (ctx.chat?.type !== 'private') {
        return next();
      }
      const text = ctx.message.text;
      if (text.startsWith('/')) {
        return next();
      }
      const uid = BigInt(ctx.from!.id);
      const account = await this.characters.ensureAccount(uid, ctx.from?.username);
      const draft = await this.characters.getDraft(account.id);
      if (!draft || draft.creationStep !== CreationStep.NAME) {
        return next();
      }
      try {
        const updated = await this.characters.setCharacterName(account.id, text);
        await ctx.reply(formatDraftConfirm(updated), confirmKeyboard());
      } catch (e) {
        const msg = e instanceof Error ? e.message : MSG_ERROR_GENERIC;
        await ctx.reply(msg, namePromptKeyboard());
      }
    });

    bot.catch((err) => this.logger.error(err));

    await bot.launch();
    this.bot = bot;
    this.logger.log('Telegram bot em polling.');
  }

  async onApplicationShutdown() {
    this.bot?.stop('shutdown');
  }

  private async safeAnswerCbQuery(
    ctx: { answerCbQuery: (text?: string, options?: { show_alert?: boolean }) => Promise<boolean> },
    text?: string,
    options?: { show_alert?: boolean },
  ) {
    try {
      await ctx.answerCbQuery(text, options);
    } catch (e) {
      this.logger.warn(
        `answerCbQuery ignorado (rede/timeout?): ${e instanceof Error ? e.message : String(e)}`,
      );
    }
  }

  private async replyForStep(
    ctx: { editMessageText: (...args: unknown[]) => Promise<unknown> },
    step: CreationStep,
    accountId: string,
  ) {
    const draft = await this.characters.getDraft(accountId);
    if (!draft) {
      await ctx.editMessageText(MSG_DRAFT_LOST, mainMenuKeyboard(false, false));
      return;
    }
    switch (step) {
      case CreationStep.CLASS:
        await ctx.editMessageText(formatWizardClassIntro(), classKeyboard());
        break;
      case CreationStep.RACE: {
        const classBlock = draft.characterClass
          ? `⚔ Classe: ${CLASS_LABEL[draft.characterClass]}\n\n${formatAfterClassChosenSummary(draft)}\n\n`
          : '';
        await ctx.editMessageText(classBlock + WIZARD_RACE_INTRO, raceKeyboard());
        break;
      }
      case CreationStep.NAME:
        await ctx.editMessageText(WIZARD_NAME_PROMPT, namePromptKeyboard());
        break;
      case CreationStep.CONFIRM:
        await ctx.editMessageText(formatDraftConfirm(draft), confirmKeyboard());
        break;
      default:
        await ctx.editMessageText('Use /start para o menu.', mainMenuKeyboard(false, true));
    }
  }
}
