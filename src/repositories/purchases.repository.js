const pool = require('../config/db');

async function findAll() {
    const [rows] = await pool.query(`
        SELECT
            p.id,
            p.user_id,
            u.name AS user_name,
            p.game_id,
            g.name AS game_name,
            p.price_paid,
            p.status,
            p.purchased_at
        FROM purchases p
        INNER JOIN users u ON u.id = p.user_id
        INNER JOIN games g ON g.id = p.game_id
        ORDER BY p.purchased_at DESC
    `);

    return rows;
}

async function findById(id) {
    const [rows] = await pool.query(`
        SELECT
            p.id,
            p.user_id,
            u.name AS user_name,
            p.game_id,
            g.name AS game_name,
            p.price_paid,
            p.status,
            p.purchased_at
        FROM purchases p
        INNER JOIN users u ON u.id = p.user_id
        INNER JOIN games g ON g.id = p.game_id
        WHERE p.id = ?
    `, [id]);

    return rows[0] || null;
}

async function findByUserId(userId) {
    const [rows] = await pool.query(`
        SELECT
            p.id,
            p.user_id,
            u.name AS user_name,
            p.game_id,
            g.name AS game_name,
            p.price_paid,
            p.status,
            p.purchased_at
        FROM purchases p
        INNER JOIN users u ON u.id = p.user_id
        INNER JOIN games g ON g.id = p.game_id
        WHERE p.user_id = ?
        ORDER BY p.purchased_at DESC
    `, [userId]);

    return rows;
}

async function findSalesByDate(date) {
    const [rows] = await pool.query(`
        SELECT
            p.id AS purchase_id,
            p.game_id,
            g.name AS game_name,
            DATE(p.purchased_at) AS sale_date,
            p.price_paid AS amount,
            p.status
        FROM purchases p
        INNER JOIN games g ON g.id = p.game_id
        WHERE DATE(p.purchased_at) = ?
          AND p.status = 'completed'
        ORDER BY p.purchased_at DESC
    `, [date]);

    return rows;
}

async function create(purchaseData) {
    const { user_id, game_id, price_paid, status } = purchaseData;

    const [result] = await pool.query(`
        INSERT INTO purchases
            (user_id, game_id, price_paid, status)
        VALUES (?, ?, ?, ?)
    `, [
        user_id,
        game_id,
        price_paid,
        status || 'completed'
    ]);

    return findById(result.insertId);
}

async function update(id, purchaseData) {
    const { user_id, game_id, price_paid, status } = purchaseData;

    await pool.query(`
        UPDATE purchases
        SET user_id = ?,
            game_id = ?,
            price_paid = ?,
            status = ?
        WHERE id = ?
    `, [user_id, game_id, price_paid, status, id]);

    return findById(id);
}

async function remove(id) {
    const [result] = await pool.query(
        'DELETE FROM purchases WHERE id = ?',
        [id]
    );

    return result.affectedRows > 0;
}

module.exports = {
    findAll,
    findById,
    findByUserId,
    findSalesByDate,
    create,
    update,
    remove
};