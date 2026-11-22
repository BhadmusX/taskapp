-- Up Migration
CREATE INDEX user_id_task_id_tasks ON tasks (user_id, task_id DESC);

-- Down Migration
DROP INDEX user_id_task_id_tasks;