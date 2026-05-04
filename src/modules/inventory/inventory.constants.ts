/** Capacidade fixa da bolsa (M2 — ADR-014). */
export const BAG_SLOT_COUNT = 20;

/** Itens iniciais na bolsa após criação do personagem (códigos em `item_definitions`). */
export const STARTER_ITEM_CODES: readonly string[] = [
  'starter_minor_heal',
  'starter_minor_mana',
  'starter_trainee_sword',
  'starter_worn_chest',
  'starter_scrap_iron',
  'starter_sample_quest',
] as const;
