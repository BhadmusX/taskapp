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

const updateTask = async ({taskId, taskName}) => {
    const result = await pool.query(
        `update tasks set task_name = $1 where task_id = $2 returning *`,
        [taskName, taskId]
    );

    return result.rows[0] || null;
}

module.exports = {createTask, getTasks, getTaskById, updateTask, deleteTask};

