-- Up Migration
CREATE INDEX user_id_tasks ON tasks (user_id);

-- Down Migration
DROP INDEX user_id_tasks;