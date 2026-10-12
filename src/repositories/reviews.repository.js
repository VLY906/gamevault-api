
const pool = require('../config/db');

async function findAll() {
    const [rows] = await pool.query(
        'SELECT * FROM reviews ORDER BY id DESC'
    );

    return rows;
}

async function findById(id) {
    const [rows] = await pool.query(
        'SELECT * FROM reviews WHERE id = ?',
        [id]
    );

    return rows[0];
}

async function findByUserId(userId) {
    const [rows] = await pool.query(
        'SELECT * FROM reviews WHERE user_id = ? ORDER BY id DESC',
        [userId]
    );

    return rows;
}

async function findByGameId(gameId) {
    const [rows] = await pool.query(
        'SELECT * FROM reviews WHERE game_id = ? ORDER BY id DESC',
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
        `INSERT INTO reviews
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

    await pool.query(
        `UPDATE reviews
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

    return findById(id);
}

async function remove(id) {
    const [result] = await pool.query(
        'DELETE FROM reviews WHERE id = ?',
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
