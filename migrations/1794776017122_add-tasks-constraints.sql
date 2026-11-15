-- Up Migration
ALTER TABLE tasks
  ADD COLUMN IF NOT EXISTS user_id INT;

ALTER TABLE tasks
  ADD CONSTRAINT fk_tasks_user
  FOREIGN KEY (user_id) REFERENCES users (User_id) ON DELETE CASCADE;

-- Down Migration
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS fk_tasks_user;
ALTER TABLE tasks DROP COLUMN IF EXISTS user_id;