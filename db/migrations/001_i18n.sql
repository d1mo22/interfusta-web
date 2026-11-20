-- i18n: machine/hand translations of the Catalan columns, keyed by language.
-- Shape: {"es": {"title": "…", "description": "…"}, "fr": {…}, "en": {…}, "pt": {…}}
-- Missing keys fall back to the Catalan column on read.
ALTER TABLE project  ADD COLUMN IF NOT EXISTS translations jsonb NOT NULL DEFAULT '{}';
ALTER TABLE feature  ADD COLUMN IF NOT EXISTS translations jsonb NOT NULL DEFAULT '{}';
ALTER TABLE category ADD COLUMN IF NOT EXISTS translations jsonb NOT NULL DEFAULT '{}';
