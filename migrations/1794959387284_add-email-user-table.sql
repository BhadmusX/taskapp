-- Up Migration
ALTER TABLE users
ADD COLUMN IF NOT EXISTS email text
-- Down Migration
ALTER TABLE users
DROP COLUMN IF EXISTS email