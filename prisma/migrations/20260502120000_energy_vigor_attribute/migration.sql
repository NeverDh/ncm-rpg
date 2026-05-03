-- Vigor passa a ser atributo; recurso antigo "vigor" vira Energia (energy).
ALTER TABLE "characters" RENAME COLUMN "vigor" TO "energy";

ALTER TABLE "characters" ADD COLUMN "vigor_attribute" INTEGER NOT NULL DEFAULT 8;

ALTER TABLE "characters" ALTER COLUMN "attribute_points_remaining" SET DEFAULT 14;
