const pool = require('../db/index.js');

const createUser = async ({firstName, lastName, age}) =>{
    const result = await pool.query(
        `INSERT INTO  users (First_Name, Last_Name, Age)
VALUES       ($1, $2, $3)
RETURNING    *`,
        [firstName, lastName, age]
    );
    return result.rows[0] || null;
};

const getUserById = async (id) => {
    const result = await pool.query(
        `SELECT  *
FROM    users
WHERE   user_id = $1`,
        [id]
    );
    return result.rows[0] || null;
};

const getUsers = async () => {
    const result = await pool.query(
        `SELECT  *
FROM    users`
    );
    return result.rows || null;
};

const updateUser = async ({id, firstName, lastName, age}) => {
    const result = await pool.query(
        `UPDATE     users
SET        First_Name = $1, Last_Name = $2, Age = $3
WHERE      user_id = $4
RETURNING  *`,
        [firstName, lastName, age, id]
    );
    return result.rows[0] || null;
};

const deleteUser = async (id) => {
    const result = await pool.query(
        `DELETE FROM  users
WHERE        user_id = $1
RETURNING    *`,
        [id]
    );
    return result.rows[0] || null;
}

module.exports = {createUser, getUserById, getUsers, updateUser, deleteUser};