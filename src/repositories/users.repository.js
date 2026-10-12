
const pool = require('../config/db');

async function findAll() {
    const [rows] = await pool.query(
        'SELECT id, name, email, role, created_at FROM users'
    );

    return rows;
}

async function findById(id) {
    const [rows] = await pool.query(
        'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
        [id]
    );

    return rows[0];
}

async function findByEmail(email) {
    const [rows] = await pool.query(
        'SELECT id, name, email, password, role, created_at FROM users WHERE email = ?',
        [email]
    );

    return rows[0];
}

async function create(userData) {
    const { name, email, password, role } = userData;

    const [result] = await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, password, role || 'user']
    );

    return findById(result.insertId);
}

async function update(id, userData) {
    const { name, email, password, role } = userData;

    await pool.query(
        'UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?',
        [name, email, password, role, id]
    );

    return findById(id);
}

async function remove(id) {
    const [result] = await pool.query(
        'DELETE FROM users WHERE id = ?',
        [id]
    );

    return result.affectedRows > 0;
}

module.exports = {
    findAll,
    findById,
    findByEmail,
    create,
    update,
    remove
};
