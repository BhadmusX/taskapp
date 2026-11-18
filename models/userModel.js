const pool = require('../db/index.js');

const createUser = async ({firstName, lastName, age, email}) =>{
    const result = await pool.query(
        `INSERT INTO  users (First_Name, Last_Name, Age, email)
VALUES       ($1, $2, $3, $4)
RETURNING    *`,
        [firstName, lastName, age, email]
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

const updateUser = async ({id, firstName, lastName, age, email}) => {
    const result = await pool.query(
        `UPDATE     users
SET        First_Name = $1, Last_Name = $2, Age = $3, email = $4
WHERE      user_id = $5
RETURNING  *`,
        [firstName, lastName, age, email, id]
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

const getUserByEmail = async (email) => {
    const result = await pool.query(
        `select from users where email = $1`,
        [email]
    );
    return result.rows[0] || null;
}

module.exports = {createUser, getUserById, getUsers, updateUser, deleteUser, getUserByEmail};