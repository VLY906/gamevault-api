const pool = require('../config/db');

async function findAll() {
    const [rows] = await pool.query(`
        SELECT
            p.id,
            p.user_id,
            u.name AS user_name,
            p.purchased_at,
            p.status,
            COALESCE(SUM(pi.price_paid), 0) AS total_amount,
            COUNT(pi.id) AS item_count,
            CASE
                WHEN COUNT(pi.id) = 0 THEN JSON_ARRAY()
                ELSE JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'item_id', pi.id,
                        'game_id', g.id,
                        'game_name', g.name,
                        'price_paid', pi.price_paid
                    )
                )
            END AS items
        FROM purchases p
        INNER JOIN users u ON u.id = p.user_id
        LEFT JOIN purchase_items pi ON pi.purchase_id = p.id
        LEFT JOIN games g ON g.id = pi.game_id
        GROUP BY
            p.id,
            p.user_id,
            u.name,
            p.purchased_at,
            p.status
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
            p.purchased_at,
            p.status,
            COALESCE(SUM(pi.price_paid), 0) AS total_amount,
            COUNT(pi.id) AS item_count,
            CASE
                WHEN COUNT(pi.id) = 0 THEN JSON_ARRAY()
                ELSE JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'item_id', pi.id,
                        'game_id', g.id,
                        'game_name', g.name,
                        'price_paid', pi.price_paid
                    )
                )
            END AS items
        FROM purchases p
        INNER JOIN users u ON u.id = p.user_id
        LEFT JOIN purchase_items pi ON pi.purchase_id = p.id
        LEFT JOIN games g ON g.id = pi.game_id
        WHERE p.id = ?
        GROUP BY
            p.id,
            p.user_id,
            u.name,
            p.purchased_at,
            p.status
    `, [id]);

    return rows[0] || null;
}

async function findByUserId(userId) {
    const [rows] = await pool.query(`
        SELECT
            p.id,
            p.user_id,
            u.name AS user_name,
            p.purchased_at,
            p.status,
            COALESCE(SUM(pi.price_paid), 0) AS total_amount,
            COUNT(pi.id) AS item_count
        FROM purchases p
        INNER JOIN users u ON u.id = p.user_id
        LEFT JOIN purchase_items pi ON pi.purchase_id = p.id
        WHERE p.user_id = ?
        GROUP BY
            p.id,
            p.user_id,
            u.name,
            p.purchased_at,
            p.status
        ORDER BY p.purchased_at DESC
    `, [userId]);

    return rows;
}

async function findSalesByDate(date) {
    const [rows] = await pool.query(`
        SELECT
            p.id AS purchase_id,
            p.user_id,
            pi.id AS item_id,
            pi.game_id,
            g.name AS game_name,
            DATE(p.purchased_at) AS sale_date,
            pi.price_paid AS amount,
            p.status
        FROM purchases p
        INNER JOIN purchase_items pi ON pi.purchase_id = p.id
        INNER JOIN games g ON g.id = pi.game_id
        WHERE p.purchased_at >= ?
          AND p.purchased_at < DATE_ADD(?, INTERVAL 1 DAY)
          AND p.status = 'completed'
        ORDER BY p.purchased_at DESC, p.id DESC
    `, [date, date]);

    return rows;
}

async function create(purchaseData) {
    const { user_id, items, status } = purchaseData;
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [purchaseResult] = await connection.query(`
            INSERT INTO purchases (user_id, status)
            VALUES (?, ?)
        `, [user_id, status || 'completed']);

        const purchaseId = purchaseResult.insertId;

        for (const item of items) {
            const [itemResult] = await connection.query(`
                INSERT INTO purchase_items
                    (purchase_id, game_id, price_paid)
                SELECT ?, g.id, g.price
                FROM games g
                WHERE g.id = ?
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
            UPDATE purchases
            SET user_id = ?, status = ?
            WHERE id = ?
        `, [user_id, status, id]);

        if (result.affectedRows === 0) {
            const [existingRows] = await connection.query(
                'SELECT id FROM purchases WHERE id = ?',
                [id]
            );

            if (existingRows.length === 0) {
                await connection.rollback();
                return null;
            }
        }

        if (Array.isArray(items)) {
            await connection.query(`
                DELETE FROM purchase_items
                WHERE purchase_id = ?
            `, [id]);

            for (const item of items) {
                const [itemResult] = await connection.query(`
                    INSERT INTO purchase_items
                        (purchase_id, game_id, price_paid)
                    SELECT ?, g.id, g.price
                    FROM games g
                    WHERE g.id = ?
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