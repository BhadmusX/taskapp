-- Up Migration
CREATE INDEX user_id_task_id_tasks_partial_stat ON tasks (user_id, task_id DESC)
WHERE
    stat = FALSE;

-- Down Migration
DROP INDEX user_id_task_id_tasks_partial_stat;