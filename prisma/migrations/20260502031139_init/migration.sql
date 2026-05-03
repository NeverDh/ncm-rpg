-- CreateEnum
CREATE TYPE "Race" AS ENUM ('HUMAN', 'ORCANO', 'SYLVARI', 'UMBREN', 'DRAKARI', 'VALTHERIN');

-- CreateEnum
CREATE TYPE "CharacterClass" AS ENUM ('BARBARIAN', 'MAGE', 'ASSASSIN');

-- CreateEnum
CREATE TYPE "CreationStep" AS ENUM ('START', 'RACE', 'CLASS', 'ATTRIBUTES', 'NAME', 'CONFIRM', 'DONE');

-- CreateTable
CREATE TABLE "telegram_accounts" (
    "id" TEXT NOT NULL,
    "telegram_user_id" BIGINT NOT NULL,
    "username" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "telegram_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "characters" (
    "id" TEXT NOT NULL,
    "telegram_account_id" TEXT NOT NULL,
    "name" TEXT,
    "race" "Race",
    "character_class" "CharacterClass",
    "strength" INTEGER NOT NULL DEFAULT 8,
    "dexterity" INTEGER NOT NULL DEFAULT 8,
    "intelligence" INTEGER NOT NULL DEFAULT 8,
    "vitality" INTEGER NOT NULL DEFAULT 8,
    "resilience" INTEGER NOT NULL DEFAULT 8,
    "perception" INTEGER NOT NULL DEFAULT 8,
    "attribute_points_remaining" INTEGER NOT NULL DEFAULT 12,
    "hp" INTEGER NOT NULL DEFAULT 0,
    "mana" INTEGER NOT NULL DEFAULT 0,
    "stamina" INTEGER NOT NULL DEFAULT 0,
    "vigor" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "creation_step" "CreationStep" NOT NULL DEFAULT 'START',
    "is_complete" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "characters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "telegram_accounts_telegram_user_id_key" ON "telegram_accounts"("telegram_user_id");

-- CreateIndex
CREATE INDEX "characters_telegram_account_id_is_complete_idx" ON "characters"("telegram_account_id", "is_complete");

-- AddForeignKey
ALTER TABLE "characters" ADD CONSTRAINT "characters_telegram_account_id_fkey" FOREIGN KEY ("telegram_account_id") REFERENCES "telegram_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
