
const pool = require('../config/db');

async function findAll() {
    const [rows] = await pool.query(
        'SELECT * FROM `review` ORDER BY id DESC'
    );

    return rows;
}

async function findById(id) {
    const [rows] = await pool.query(
        'SELECT * FROM `review` WHERE id = ?',
        [id]
    );

    return rows[0] || null;
}

async function findByUserId(userId) {
    const [rows] = await pool.query(
        'SELECT * FROM `review` WHERE user_id = ? ORDER BY id DESC',
        [userId]
    );

    return rows;
}

async function findByGameId(gameId) {
    const [rows] = await pool.query(
        'SELECT * FROM `review` WHERE game_id = ? ORDER BY id DESC',
        [gameId]
    );

    return rows;
}

async function create(reviewData) {
    const {
        user_id,
        game_id,
        rating,
        comment,
        hours_played
    } = reviewData;

    const [result] = await pool.query(
        `INSERT INTO \`review\`
            (user_id, game_id, rating, comment, hours_played)
         VALUES (?, ?, ?, ?, ?)`,
        [
            user_id,
            game_id,
            rating,
            comment || null,
            hours_played ?? null
        ]
    );

    return findById(result.insertId);
}

async function update(id, reviewData) {
    const {
        user_id,
        game_id,
        rating,
        comment,
        hours_played
    } = reviewData;

    const [result] = await pool.query(
        `UPDATE \`review\`
         SET user_id = ?, game_id = ?, rating = ?,
             comment = ?, hours_played = ?
         WHERE id = ?`,
        [
            user_id,
            game_id,
            rating,
            comment || null,
            hours_played ?? null,
            id
        ]
    );

    if (result.affectedRows === 0) {
        return findById(id);
    }

    return findById(id);
}

async function remove(id) {
    const [result] = await pool.query(
        'DELETE FROM `review` WHERE id = ?',
        [id]
    );

    return result.affectedRows > 0;
}

module.exports = {
    findAll,
    findById,
    findByUserId,
    findByGameId,
    create,
    update,
    remove
};
