-- F1: fuzzy food name search (pg_trgm)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS foods_name_fr_trgm_idx ON foods USING gin ("nameFr" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS foods_name_en_trgm_idx ON foods USING gin ("nameEn" gin_trgm_ops)
WHERE "nameEn" IS NOT NULL;
