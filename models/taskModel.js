const pool = require('../db/index.js');

const createTask = async({taskName, userId}) => {
    const result = await pool.query(
        `insert into tasks (task_name, user_id) values ($1, $2) returning *`,
        [taskName, userId]
    );

    return result.rows[0] || null;
}

const getTasks = async() => {
    const result = await pool.query(
        `select * from tasks`
    )

    return result.rows || null;
}

const getTaskById = async (id) => {
    const result = await pool.query(
        `select * from tasks where task_id = $1`,
        [id]
    );

    return result.rows[0] || null;
}

const deleteTask = async (id) => {
    const result = await pool.query(
        `delete from tasks where task_id = $1 returning *`,
        [id]
    );
     return result.rows[0] || null;
}

const updateTask = async ({taskId, taskName, stat}) => {
    const result = await pool.query(
        `update tasks set task_name = coalesce($1, task_Name), stat = coalesce($2, stat) where task_id = $3 returning *`,
        [taskName, stat, taskId]
    );

    return result.rows[0] || null;
}

module.exports = {createTask, getTasks, getTaskById, updateTask, deleteTask};
