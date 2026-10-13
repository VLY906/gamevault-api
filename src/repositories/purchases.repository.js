
const pool = require('../config/db');

async function findAll() {
    const [rows] = await pool.query(`
        SELECT
            purchase.id,
            purchase.user_id,
            user.name AS user_name,
            purchase.purchased_at,
            purchase.status,
            COALESCE(SUM(purchase_item.price_paid), 0) AS total_amount,
            COUNT(purchase_item.id) AS item_count,
            CASE
                WHEN COUNT(purchase_item.id) = 0 THEN JSON_ARRAY()
                ELSE JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'item_id', purchase_item.id,
                        'game_id', game.id,
                        'game_name', game.name,
                        'price_paid', purchase_item.price_paid
                    )
                )
            END AS items
        FROM purchase
        INNER JOIN user ON user.id = purchase.user_id
        LEFT JOIN purchase_item
            ON purchase_item.purchase_id = purchase.id
        LEFT JOIN game ON game.id = purchase_item.game_id
        GROUP BY
            purchase.id,
            purchase.user_id,
            user.name,
            purchase.purchased_at,
            purchase.status
        ORDER BY purchase.purchased_at DESC
    `);

    return rows;
}

async function findById(id) {
    const [rows] = await pool.query(`
        SELECT
            purchase.id,
            purchase.user_id,
            user.name AS user_name,
            purchase.purchased_at,
            purchase.status,
            COALESCE(SUM(purchase_item.price_paid), 0) AS total_amount,
            COUNT(purchase_item.id) AS item_count,
            CASE
                WHEN COUNT(purchase_item.id) = 0 THEN JSON_ARRAY()
                ELSE JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'item_id', purchase_item.id,
                        'game_id', game.id,
                        'game_name', game.name,
                        'price_paid', purchase_item.price_paid
                    )
                )
            END AS items
        FROM purchase
        INNER JOIN user ON user.id = purchase.user_id
        LEFT JOIN purchase_item
            ON purchase_item.purchase_id = purchase.id
        LEFT JOIN game ON game.id = purchase_item.game_id
        WHERE purchase.id = ?
        GROUP BY
            purchase.id,
            purchase.user_id,
            user.name,
            purchase.purchased_at,
            purchase.status
    `, [id]);

    return rows[0] || null;
}

async function findByUserId(userId) {
    const [rows] = await pool.query(`
        SELECT
            purchase.id,
            purchase.user_id,
            user.name AS user_name,
            purchase.purchased_at,
            purchase.status,
            COALESCE(SUM(purchase_item.price_paid), 0) AS total_amount,
            COUNT(purchase_item.id) AS item_count
        FROM purchase
        INNER JOIN user ON user.id = purchase.user_id
        LEFT JOIN purchase_item
            ON purchase_item.purchase_id = purchase.id
        WHERE purchase.user_id = ?
        GROUP BY
            purchase.id,
            purchase.user_id,
            user.name,
            purchase.purchased_at,
            purchase.status
        ORDER BY purchase.purchased_at DESC
    `, [userId]);

    return rows;
}

async function findSalesByDate(date) {
    const [rows] = await pool.query(`
        SELECT
            purchase.id AS purchase_id,
            purchase.user_id,
            purchase_item.id AS item_id,
            purchase_item.game_id,
            game.name AS game_name,
            DATE(purchase.purchased_at) AS sale_date,
            purchase_item.price_paid AS amount,
            purchase.status
        FROM purchase
        INNER JOIN purchase_item
            ON purchase_item.purchase_id = purchase.id
        INNER JOIN game ON game.id = purchase_item.game_id
        WHERE purchase.purchased_at >= ?
          AND purchase.purchased_at < DATE_ADD(?, INTERVAL 1 DAY)
          AND purchase.status = 'completed'
        ORDER BY purchase.purchased_at DESC, purchase.id DESC
    `, [date, date]);

    return rows;
}

async function create(purchaseData) {
    const { user_id, items, status } = purchaseData;
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [purchaseResult] = await connection.query(`
            INSERT INTO purchase (user_id, status)
            VALUES (?, ?)
        `, [user_id, status || 'completed']);

        const purchaseId = purchaseResult.insertId;

        for (const item of items) {
            const [itemResult] = await connection.query(`
                INSERT INTO purchase_item
                    (purchase_id, game_id, price_paid)
                SELECT ?, game.id, game.price
                FROM game
                WHERE game.id = ?
            `, [purchaseId, item.game_id]);

            if (itemResult.affectedRows === 0) {
                throw new Error(
                    `El videojuego ${item.game_id} no existe.`
                );
            }
        }

        await connection.commit();

        return await findById(purchaseId);
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

async function update(id, purchaseData) {
    const { user_id, items, status } = purchaseData;
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [result] = await connection.query(`
            UPDATE purchase
            SET user_id = ?, status = ?
            WHERE id = ?
        `, [user_id, status, id]);

        if (result.affectedRows === 0) {
            const [existingRows] = await connection.query(
                'SELECT id FROM purchase WHERE id = ?',
                [id]
            );

            if (existingRows.length === 0) {
                await connection.rollback();
                return null;
            }
        }

        if (Array.isArray(items)) {
            await connection.query(`
                DELETE FROM purchase_item
                WHERE purchase_id = ?
            `, [id]);

            for (const item of items) {
                const [itemResult] = await connection.query(`
                    INSERT INTO purchase_item
                        (purchase_id, game_id, price_paid)
                    SELECT ?, game.id, game.price
                    FROM game
                    WHERE game.id = ?
                `, [id, item.game_id]);

                if (itemResult.affectedRows === 0) {
                    throw new Error(
                        `El videojuego ${item.game_id} no existe.`
                    );
                }
            }
        }

        await connection.commit();

        return await findById(id);
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

async function remove(id) {
    const [result] = await pool.query(
        'DELETE FROM purchase WHERE id = ?',
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
