const express = require('express');
const router = express.Router();
const purchasesController = require('../controllers/purchases.controller');

/**
 * @swagger
 * /purchases:
 *   get:
 *     summary: Obtener todas las compras
 *     tags: [Compras]
 *     responses:
 *       200:
 *         description: Lista de compras obtenida correctamente
 *   post:
 *     summary: Registrar una compra
 *     tags: [Compras]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - game_id
 *               - price_paid
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 2
 *               game_id:
 *                 type: integer
 *                 example: 4
 *               price_paid:
 *                 type: number
 *                 example: 59.99
 *               status:
 *                 type: string
 *                 enum: [completed, pending, cancelled]
 *                 example: completed
 *     responses:
 *       201:
 *         description: Compra registrada correctamente
 *       400:
 *         description: Datos inválidos
 *
 * /purchases/sales-by-date:
 *   get:
 *     summary: Consultar ventas completadas por fecha
 *     tags: [Compras]
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         description: Fecha de consulta en formato YYYY-MM-DD
 *         schema:
 *           type: string
 *           format: date
 *           example: '2026-10-12'
 *     responses:
 *       200:
 *         description: Ventas y total recaudado en la fecha indicada
 *       400:
 *         description: Fecha ausente o inválida
 *
 * /purchases/user/{userId}:
 *   get:
 *     summary: Obtener las compras de un usuario
 *     tags: [Compras]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Compras del usuario obtenidas correctamente
 *       404:
 *         description: Usuario no encontrado
 *
 * /purchases/{id}:
 *   get:
 *     summary: Obtener una compra por ID
 *     tags: [Compras]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Compra encontrada
 *       404:
 *         description: Compra no encontrada
 *   put:
 *     summary: Actualizar una compra
 *     tags: [Compras]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - game_id
 *               - price_paid
 *               - status
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 2
 *               game_id:
 *                 type: integer
 *                 example: 4
 *               price_paid:
 *                 type: number
 *                 example: 59.99
 *               status:
 *                 type: string
 *                 enum: [completed, pending, cancelled]
 *                 example: completed
 *     responses:
 *       200:
 *         description: Compra actualizada correctamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Compra no encontrada
 *   delete:
 *     summary: Eliminar una compra
 *     tags: [Compras]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Compra eliminada correctamente
 *       404:
 *         description: Compra no encontrada
 */

router.get('/', purchasesController.getAllPurchases);

// Esta ruta debe ir antes de /:id.
router.get('/sales-by-date', purchasesController.getSalesByDate);

router.get('/user/:userId', purchasesController.getPurchasesByUserId);
router.get('/:id', purchasesController.getPurchaseById);

router.post('/', purchasesController.createPurchase);
router.put('/:id', purchasesController.updatePurchase);
router.delete('/:id', purchasesController.deletePurchase);

module.exports = router;