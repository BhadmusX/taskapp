-- Up Migration
ALTER TABLE users
  DROP CONSTRAINT IF EXISTS users_task_id_fkey;

ALTER TABLE users
  DROP COLUMN IF EXISTS task_id;
-- Down Migration