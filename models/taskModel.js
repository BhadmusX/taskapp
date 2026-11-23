const pool = require('../db/index.js');

const createTask = async({taskName, userId}) => {
    const result = await pool.query(
        `insert into tasks (task_name, user_id) values ($1, $2) returning *`,
        [taskName, userId]
    );

    return result.rows[0] || null;
}

const getTasks = async(filter) => {
    console.log(filter)

    let conditions = [];
    let values = [];

    if(filter.userId !== undefined){
        values.push(filter.userId);
        conditions.push('user_id = $' + values.length);
    }

    if(filter.stat !== undefined){
        values.push(filter.stat);
        conditions.push('stat = $'+ values.length);
    }

    let sql = 'select * from tasks';

    if(conditions.length > 0){
        sql += ' where ' + conditions.join(' and ');
    } 

    if(filter.limit !== undefined){
        values.push(filter.limit);
        sql += ' LIMIT $' + values.length; 
    }

    if(filter.skip !== undefined){
        values.push(filter.skip);
        sql += ' OFFSET $' + values.length;
    }

    console.log(sql, values);
    const result = await pool.query(sql, values);

    // const result = await pool.query(
    //     `select * from tasks where stat = $1 and user_id = $2`,
    //     [boolStat, userId]
    // )

    return result.rows || null;
}

const getTaskById = async ({userId, taskId}) => {
    const result = await pool.query(
        `select * from tasks where task_id = $1 and user_id = $2`,
        [taskId, userId]
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

const getUserStat = async ({id}) => {
    console.log(id);
    const result = await pool.query(
        `select count(*) as total, count(*) filter (where stat = true) as completed from tasks where user_id = $1`,
        [id]
    )
    console.log(result.rows)

    return result.rows[0] || null;
}

module.exports = {createTask, getTasks, getTaskById, updateTask, deleteTask, getCompletedTasks, getUserStat};
