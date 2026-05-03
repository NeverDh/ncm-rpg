import { CharacterClass, Race } from '@prisma/client';

/** Linha divisória (estilo `examples/texto-exemplo.txt`); também usada no presenter. */
export const SECTION_RULE = '━━━━━━━━━━━━━━━━━━━━';

/** Texto curto no corpo da mensagem (PRODUCT: apoio além do rótulo do botão). */
export const RACE_BLURB: Record<Race, string> = {
  HUMAN:
    'Generalista: +2 em tudo. Bom para testar qualquer classe.',
  ORCANO:
    'Brutamontes: FOR, VIT e VIG fortes; INT sofre. Feito para melê (ex.: Bárbaro).',
  SYLVARI:
    'Mente e aura: INT e RES altos; FOR baixa. Conjuração e resistência mágica.',
  UMBREN:
    'Sombra e reflexos: DES e VIG altos, VIT boa; RES penalizada. Furtivo e rápido.',
  DRAKARI:
    'Triplo FOR/DES/INT com VIG; RES menor. Versátil; lore elemental pode expandir depois.',
  VALTHERIN:
    'Muralha arcana: VIT, INT e RES; DES menor. Aguenta e conjura.',
};

export const CLASS_BLURB: Record<CharacterClass, string> = {
  BARBARIAN:
    'Fúria e corpo: soma mais em Força, Vitalidade e Vigor.',
  MAGE:
    'Arcano: soma mais em Inteligência, Resistência e Vigor.',
  ASSASSIN:
    'Agilidade: soma mais em Destreza e Vigor; precisão física.',
};

/** Mensagens do fluxo (evita divergência entre wizard e resume). */
export const MSG_START_WELCOME =
  '⚔ Seu herói começa aqui\n' +
  `${SECTION_RULE}\n\n` +
  'Monte a ficha pelo chat e consulte quando quiser.\n\n' +
  'Escolha abaixo:';

export const MSG_MENU =
  '📍 Menu\n' + `${SECTION_RULE}\n\n` + 'O que deseja fazer?';

export const WIZARD_RACE_INTRO =
  '🧬 Passo 2/4 · Origem\n' +
  `${SECTION_RULE}\n\n` +
  'Escolha o povo do seu personagem.\n\n' +
  'Cada raça soma um pacote próprio nos atributos; ao escolher, você vê também Vida, Mana, Stamina e os secundários calculados.';

export const WIZARD_NAME_PROMPT =
  '✏️ Passo 3/4 · Nome\n' +
  `${SECTION_RULE}\n\n` +
  'Como seu herói se chama?\n\n' +
  'Envie uma mensagem de texto com 2 a 32 caracteres (sem comandos que comecem com /).';

export const WIZARD_NAME_RETRY =
  '✏️ Nome de novo\n' +
  `${SECTION_RULE}\n\n` +
  'Envie o nome em uma mensagem (2 a 32 caracteres).';

/** Após confirmar a classe no teclado (antes da grade de raças). */
export const WIZARD_CLASS_NEXT = '➡️ Passo 2/4 · escolha a raça abaixo.';

export const MSG_PERSONAGEM_NO_CHAR =
  'Ainda não há personagem salvo.\n\n/start → Criar personagem.';

export const MSG_SHEET_NO_CHAR = 'Nenhum personagem ainda.\n\n/start para começar.';

export const MSG_NO_DRAFT_RESUME =
  'Não há criação em andamento. Toque em «Criar personagem» no menu (/start).';

export const MSG_INVALID_OPTION = 'Opção inválida ou expirada. Use /start e tente de novo.';

export const MSG_DRAFT_LOST =
  'Rascunho sumiu (sessão antiga?). /start para voltar ao menu.';

export const MSG_ERROR_GENERIC = 'Algo deu errado. Tente /start.';

export const MSG_ERROR_START = 'Erro ao iniciar.';

export const MSG_CHARACTER_CREATED_PREFIX =
  '🎉 Herói criado\n' + `${SECTION_RULE}\n\n`;
