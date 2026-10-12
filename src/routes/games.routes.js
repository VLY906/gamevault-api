
const express = require('express');
const router = express.Router();
const gamesController = require('../controllers/games.controller');
const {
    authenticateToken,
    authorizeRoles
} = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /games:
 *   get:
 *     summary: Obtener todos los juegos
 *     tags: [Juegos]
 *     responses:
 *       200:
 *         description: Lista de juegos obtenida correctamente
 *   post:
 *     summary: Crear un juego (solo administrador)
 *     tags: [Juegos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price, genre, age_rating]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Elden Ring
 *               price:
 *                 type: number
 *                 example: 59.99
 *               genre:
 *                 type: string
 *                 example: RPG
 *               age_rating:
 *                 type: string
 *                 example: 16+
 *               description:
 *                 type: string
 *                 example: Juego de rol y aventura
 *     responses:
 *       201:
 *         description: Juego creado correctamente
 *       401:
 *         description: Token ausente o inválido
 *       403:
 *         description: Acceso exclusivo para administradores
 *
 * /games/genre:
 *   get:
 *     summary: Filtrar juegos por género
 *     tags: [Juegos]
 *     parameters:
 *       - in: query
 *         name: genre
 *         required: true
 *         schema:
 *           type: string
 *           example: RPG
 *     responses:
 *       200:
 *         description: Lista de juegos del género indicado
 *       400:
 *         description: El género es obligatorio
 *
 * /games/{id}:
 *   get:
 *     summary: Obtener un juego por ID
 *     tags: [Juegos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Juego encontrado
 *       404:
 *         description: Juego no encontrado
 *   put:
 *     summary: Actualizar un juego (solo administrador)
 *     tags: [Juegos]
 *     security:
 *       - bearerAuth: []
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
 *             required: [name, price, genre, age_rating]
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               genre:
 *                 type: string
 *               age_rating:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Juego actualizado correctamente
 *       401:
 *         description: Token ausente o inválido
 *       403:
 *         description: Acceso exclusivo para administradores
 *       404:
 *         description: Juego no encontrado
 *   delete:
 *     summary: Eliminar un juego (solo administrador)
 *     tags: [Juegos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Juego eliminado correctamente
 *       401:
 *         description: Token ausente o inválido
 *       403:
 *         description: Acceso exclusivo para administradores
 *       404:
 *         description: Juego no encontrado
 */

router.get('/', gamesController.getAllGames);
router.get('/genre', gamesController.getGamesByGenre);
router.get('/:id', gamesController.getGameById);

// Operaciones restringidas a administradores
router.post(
    '/',
    authenticateToken,
    authorizeRoles('admin'),
    gamesController.createGame
);

router.put(
    '/:id',
    authenticateToken,
    authorizeRoles('admin'),
    gamesController.updateGame
);

router.delete(
    '/:id',
    authenticateToken,
    authorizeRoles('admin'),
    gamesController.deleteGame
);

module.exports = router;
