-- M2 inventário — ADR-013 / ADR-014

CREATE TYPE "ItemType" AS ENUM ('WEAPON', 'ARMOR', 'CONSUMABLE', 'MATERIAL', 'QUEST');

CREATE TYPE "ItemRarity" AS ENUM ('COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY');

CREATE TYPE "EquipmentSlot" AS ENUM (
  'WEAPON',
  'CHEST',
  'HELM',
  'BOOTS',
  'PANTS',
  'RING_1',
  'RING_2',
  'NECKLACE',
  'BELT'
);

CREATE TABLE "item_definitions" (
  "id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "item_type" "ItemType" NOT NULL,
  "rarity" "ItemRarity" NOT NULL DEFAULT 'COMMON',
  "wear_slot" "EquipmentSlot",
  "bonus_strength" INTEGER NOT NULL DEFAULT 0,
  "bonus_dexterity" INTEGER NOT NULL DEFAULT 0,
  "bonus_intelligence" INTEGER NOT NULL DEFAULT 0,
  "bonus_vitality" INTEGER NOT NULL DEFAULT 0,
  "bonus_resilience" INTEGER NOT NULL DEFAULT 0,
  "bonus_vigor" INTEGER NOT NULL DEFAULT 0,
  "effect_heal_hp" INTEGER NOT NULL DEFAULT 0,
  "effect_restore_mana" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "item_definitions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "item_definitions_code_key" ON "item_definitions" ("code");

CREATE TABLE "inventory_items" (
  "id" TEXT NOT NULL,
  "character_id" TEXT NOT NULL,
  "item_definition_id" TEXT NOT NULL,
  "stack_count" INTEGER NOT NULL DEFAULT 1,
  "bag_slot_index" INTEGER,
  "equipped_slot" "EquipmentSlot",
  CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "inventory_items"
ADD CONSTRAINT "inventory_items_character_id_fkey"
FOREIGN KEY ("character_id") REFERENCES "characters" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "inventory_items"
ADD CONSTRAINT "inventory_items_item_definition_id_fkey"
FOREIGN KEY ("item_definition_id") REFERENCES "item_definitions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE INDEX "inventory_items_character_id_idx" ON "inventory_items" ("character_id");

CREATE UNIQUE INDEX "inventory_items_character_bag_slot_key"
ON "inventory_items" ("character_id", "bag_slot_index")
WHERE "bag_slot_index" IS NOT NULL;

CREATE UNIQUE INDEX "inventory_items_character_equipped_key"
ON "inventory_items" ("character_id", "equipped_slot")
WHERE "equipped_slot" IS NOT NULL;

-- Catálogo inicial (sistema)
INSERT INTO "item_definitions" (
  "id", "code", "name", "item_type", "rarity", "wear_slot",
  "bonus_strength", "bonus_dexterity", "bonus_intelligence", "bonus_vitality", "bonus_resilience", "bonus_vigor",
  "effect_heal_hp", "effect_restore_mana"
) VALUES
(
  'a1000000-0000-4000-8000-000000000001',
  'starter_trainee_sword',
  'Espada de aprendiz',
  'WEAPON',
  'COMMON',
  'WEAPON',
  1, 0, 0, 0, 0, 0,
  0, 0
),
(
  'a1000000-0000-4000-8000-000000000002',
  'starter_worn_chest',
  'Peitoral surrado',
  'ARMOR',
  'COMMON',
  'CHEST',
  0, 0, 0, 1, 0, 0,
  0, 0
),
(
  'a1000000-0000-4000-8000-000000000003',
  'starter_minor_heal',
  'Poção menor de vida',
  'CONSUMABLE',
  'COMMON',
  NULL,
  0, 0, 0, 0, 0, 0,
  15, 0
),
(
  'a1000000-0000-4000-8000-000000000004',
  'starter_minor_mana',
  'Poção menor de mana',
  'CONSUMABLE',
  'COMMON',
  NULL,
  0, 0, 0, 0, 0, 0,
  0, 12
),
(
  'a1000000-0000-4000-8000-000000000005',
  'starter_scrap_iron',
  'Sucata de ferro',
  'MATERIAL',
  'UNCOMMON',
  NULL,
  0, 0, 0, 0, 0, 0,
  0, 0
),
(
  'a1000000-0000-4000-8000-000000000006',
  'starter_sample_quest',
  'Pingente de missão (exemplo)',
  'QUEST',
  'RARE',
  NULL,
  0, 0, 0, 0, 0, 0,
  0, 0
);
