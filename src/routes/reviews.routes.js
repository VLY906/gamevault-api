
const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviews.controller');

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Obtener todas las reseñas
 *     tags: [Reseñas]
 *     responses:
 *       200:
 *         description: Lista de reseñas obtenida correctamente
 *   post:
 *     summary: Crear una reseña
 *     tags: [Reseñas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - game_id
 *               - rating
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 2
 *               game_id:
 *                 type: integer
 *                 example: 3
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: Excelente juego
 *               hours_played:
 *                 type: number
 *                 minimum: 0
 *                 example: 25
 *     responses:
 *       201:
 *         description: Reseña creada correctamente
 *       400:
 *         description: Datos inválidos
 *
 * /reviews/user/{userId}:
 *   get:
 *     summary: Obtener las reseñas de un usuario
 *     tags: [Reseñas]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reseñas del usuario obtenidas correctamente
 *
 * /reviews/game/{gameId}:
 *   get:
 *     summary: Obtener las reseñas de un juego
 *     tags: [Reseñas]
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reseñas del juego obtenidas correctamente
 *
 * /reviews/{id}:
 *   get:
 *     summary: Obtener una reseña por ID
 *     tags: [Reseñas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reseña encontrada
 *       404:
 *         description: Reseña no encontrada
 *   put:
 *     summary: Actualizar una reseña
 *     tags: [Reseñas]
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
 *             properties:
 *               user_id:
 *                 type: integer
 *               game_id:
 *                 type: integer
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *               hours_played:
 *                 type: number
 *                 minimum: 0
 *     responses:
 *       200:
 *         description: Reseña actualizada correctamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Reseña no encontrada
 *   delete:
 *     summary: Eliminar una reseña
 *     tags: [Reseñas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reseña eliminada correctamente
 *       404:
 *         description: Reseña no encontrada
 */

router.get('/', reviewsController.getAllReviews);
router.get('/user/:userId', reviewsController.getReviewsByUserId);
router.get('/game/:gameId', reviewsController.getReviewsByGameId);
router.get('/:id', reviewsController.getReviewById);
router.post('/', reviewsController.createReview);
router.put('/:id', reviewsController.updateReview);
router.delete('/:id', reviewsController.deleteReview);

module.exports = router;
