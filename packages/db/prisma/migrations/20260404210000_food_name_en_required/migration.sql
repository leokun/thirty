-- Require nameEn on foods (backfill from French label when missing)
UPDATE foods SET "nameEn" = "nameFr" WHERE "nameEn" IS NULL;
ALTER TABLE foods ALTER COLUMN "nameEn" SET NOT NULL;
