const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');

const {
    authenticateToken,
    authorizeRoles
} = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtener todos los usuarios (solo administrador)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida correctamente
 *       401:
 *         description: Token ausente o inválido
 *       403:
 *         description: Acceso exclusivo para administradores
 *
 *   post:
 *     summary: Registrar un usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ana Pérez
 *               email:
 *                 type: string
 *                 example: ana@example.com
 *               password:
 *                 type: string
 *                 example: Clave123
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: El correo ya está registrado
 *
 * /users/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: prueba2@gamevault.com
 *               password:
 *                 type: string
 *                 example: Clave123
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso; devuelve un token JWT
 *       400:
 *         description: Faltan credenciales
 *       401:
 *         description: Credenciales incorrectas
 *
 * /users/{id}:
 *   get:
 *     summary: Obtener un usuario por ID (solo administrador)
 *     tags: [Usuarios]
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
 *         description: Usuario encontrado
 *       401:
 *         description: Token ausente o inválido
 *       403:
 *         description: Acceso exclusivo para administradores
 *       404:
 *         description: Usuario no encontrado
 *
 *   put:
 *     summary: Actualizar un usuario (solo administrador)
 *     tags: [Usuarios]
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
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Token ausente o inválido
 *       403:
 *         description: Acceso exclusivo para administradores
 *       404:
 *         description: Usuario no encontrado
 *
 *   delete:
 *     summary: Eliminar un usuario (solo administrador)
 *     tags: [Usuarios]
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
 *         description: Usuario eliminado correctamente
 *       401:
 *         description: Token ausente o inválido
 *       403:
 *         description: Acceso exclusivo para administradores
 *       404:
 *         description: Usuario no encontrado
 */

// Login y registro públicos
router.post('/login', usersController.login);
router.post('/', usersController.createUser);

// Gestión de usuarios: solo administradores
router.get(
    '/',
    authenticateToken,
    authorizeRoles('admin'),
    usersController.getAllUsers
);

router.get(
    '/:id',
    authenticateToken,
    authorizeRoles('admin'),
    usersController.getUserById
);

router.put(
    '/:id',
    authenticateToken,
    authorizeRoles('admin'),
    usersController.updateUser
);

router.delete(
    '/:id',
    authenticateToken,
    authorizeRoles('admin'),
    usersController.deleteUser
);

module.exports = router;