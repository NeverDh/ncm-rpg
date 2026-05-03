-- Criação: atributos começam em 0; classe e raça somam camadas (ver ADR-012 / MODULES).
ALTER TABLE "characters" ALTER COLUMN "strength" SET DEFAULT 0;
ALTER TABLE "characters" ALTER COLUMN "dexterity" SET DEFAULT 0;
ALTER TABLE "characters" ALTER COLUMN "intelligence" SET DEFAULT 0;
ALTER TABLE "characters" ALTER COLUMN "vitality" SET DEFAULT 0;
ALTER TABLE "characters" ALTER COLUMN "resilience" SET DEFAULT 0;
ALTER TABLE "characters" ALTER COLUMN "vigor_attribute" SET DEFAULT 0;
