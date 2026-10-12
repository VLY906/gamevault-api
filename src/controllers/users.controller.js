
const usersService = require('../services/users.service');

async function getAllUsers(req, res, next) {
    try {
        const users = await usersService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

async function getUserById(req, res, next) {
    try {
        const user = await usersService.getUserById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

async function createUser(req, res, next) {
    try {
        const user = await usersService.createUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
}

async function updateUser(req, res, next) {
    try {
        const user = await usersService.updateUser(
            req.params.id,
            req.body
        );

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

async function deleteUser(req, res, next) {
    try {
        const result = await usersService.deleteUser(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        const user = await usersService.login(email, password);

        res.status(200).json({
            message: 'Inicio de sesión exitoso.',
            user
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    login
};
