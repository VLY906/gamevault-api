
const pool = require('../config/db');

async function findAll() {
    const [rows] = await pool.query(
        'SELECT * FROM `game` ORDER BY id ASC'
    );

    return rows;
}

async function findById(id) {
    const [rows] = await pool.query(
        'SELECT * FROM `game` WHERE id = ?',
        [id]
    );

    return rows[0] || null;
}

async function findByGenre(genre) {
    const [rows] = await pool.query(
        'SELECT * FROM `game` WHERE LOWER(genre) = LOWER(?) ORDER BY id ASC',
        [genre]
    );

    return rows;
}

async function create(gameData) {
    const { name, price, genre, age_rating, description } = gameData;

    const [result] = await pool.query(
        `INSERT INTO \`game\`
            (name, price, genre, age_rating, description)
         VALUES (?, ?, ?, ?, ?)`,
        [name, price, genre, age_rating, description]
    );

    return {
        id: result.insertId,
        ...gameData
    };
}

async function update(id, gameData) {
    const { name, price, genre, age_rating, description } = gameData;

    const [result] = await pool.query(
        `UPDATE \`game\`
         SET name = ?, price = ?, genre = ?, age_rating = ?, description = ?
         WHERE id = ?`,
        [name, price, genre, age_rating, description, id]
    );

    if (result.affectedRows === 0) {
        return findById(id);
    }

    return findById(id);
}

async function remove(id) {
    const [result] = await pool.query(
        'DELETE FROM `game` WHERE id = ?',
        [id]
    );

    return result.affectedRows > 0;
}

module.exports = {
    findAll,
    findById,
    findByGenre,
    create,
    update,
    remove
};
