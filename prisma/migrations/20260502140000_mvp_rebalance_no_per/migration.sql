-- MVP rebalance: 6 atributos (remove perception), sem etapa ATTRIBUTES, base 10, sem pontos na criação.
-- Energia (status) passa a 20 fixo na app; aqui normalizamos energy para personagens já completos.

UPDATE "characters" SET "creation_step" = 'NAME' WHERE "creation_step" = 'ATTRIBUTES';

ALTER TABLE "characters" DROP COLUMN "perception";

ALTER TABLE "characters" ALTER COLUMN "creation_step" DROP DEFAULT;
ALTER TABLE "characters" ALTER COLUMN "creation_step" TYPE TEXT USING ("creation_step"::text);

DROP TYPE "CreationStep";

CREATE TYPE "CreationStep" AS ENUM ('START', 'RACE', 'CLASS', 'NAME', 'CONFIRM', 'DONE');

ALTER TABLE "characters" ALTER COLUMN "creation_step" TYPE "CreationStep" USING ("creation_step"::"CreationStep");
ALTER TABLE "characters" ALTER COLUMN "creation_step" SET DEFAULT 'START'::"CreationStep";

ALTER TABLE "characters" ALTER COLUMN "strength" SET DEFAULT 10;
ALTER TABLE "characters" ALTER COLUMN "dexterity" SET DEFAULT 10;
ALTER TABLE "characters" ALTER COLUMN "intelligence" SET DEFAULT 10;
ALTER TABLE "characters" ALTER COLUMN "vitality" SET DEFAULT 10;
ALTER TABLE "characters" ALTER COLUMN "resilience" SET DEFAULT 10;
ALTER TABLE "characters" ALTER COLUMN "vigor_attribute" SET DEFAULT 10;
ALTER TABLE "characters" ALTER COLUMN "attribute_points_remaining" SET DEFAULT 0;

UPDATE "characters" SET
  "strength" = 10,
  "dexterity" = 10,
  "intelligence" = 10,
  "vitality" = 10,
  "resilience" = 10,
  "vigor_attribute" = 10,
  "attribute_points_remaining" = 0
WHERE "is_complete" = false;

UPDATE "characters" SET "energy" = 20 WHERE "is_complete" = true;
