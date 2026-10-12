const usersRepository = require('../repositories/users.repository');
const jwt = require('jsonwebtoken');

// Obtener todos los usuarios
async function getAllUsers() {
    return await usersRepository.findAll();
}

// Obtener un usuario por ID
async function getUserById(id) {
    const user = await usersRepository.findById(id);

    if (!user) {
        const error = new Error('Usuario no encontrado');
        error.statusCode = 404;
        throw error;
    }

    return user;
}

// Crear un usuario
async function createUser(userData) {
    const { name, email, password, role } = userData;

    if (!name || !email || !password) {
        const error = new Error(
            'Nombre, correo electrónico y contraseña son obligatorios'
        );
        error.statusCode = 400;
        throw error;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        const error = new Error('El correo electrónico no es válido');
        error.statusCode = 400;
        throw error;
    }

    if (String(password).length < 8) {
        const error = new Error(
            'La contraseña debe tener al menos 8 caracteres'
        );
        error.statusCode = 400;
        throw error;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await usersRepository.findByEmail(normalizedEmail);

    if (existingUser) {
        const error = new Error(
            'Ya existe un usuario registrado con ese correo'
        );
        error.statusCode = 409;
        throw error;
    }

    const newUser = {
        name: name.trim(),
        email: normalizedEmail,
        password,
        role: role || 'user'
    };

    if (!['user', 'admin'].includes(newUser.role)) {
        const error = new Error('El rol debe ser user o admin');
        error.statusCode = 400;
        throw error;
    }

    return await usersRepository.create(newUser);
}

// Actualizar un usuario
async function updateUser(id, userData) {
    await getUserById(id);

    const { name, email, password, role } = userData;

    if (!name || !email || !password || !role) {
        const error = new Error(
            'Nombre, correo, contraseña y rol son obligatorios para actualizar'
        );
        error.statusCode = 400;
        throw error;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        const error = new Error('El correo electrónico no es válido');
        error.statusCode = 400;
        throw error;
    }

    if (String(password).length < 8) {
        const error = new Error(
            'La contraseña debe tener al menos 8 caracteres'
        );
        error.statusCode = 400;
        throw error;
    }

    if (!['user', 'admin'].includes(role)) {
        const error = new Error('El rol debe ser user o admin');
        error.statusCode = 400;
        throw error;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await usersRepository.findByEmail(normalizedEmail);

    if (existingUser && Number(existingUser.id) !== Number(id)) {
        const error = new Error(
            'El correo ya está registrado por otro usuario'
        );
        error.statusCode = 409;
        throw error;
    }

    return await usersRepository.update(id, {
        name: name.trim(),
        email: normalizedEmail,
        password,
        role
    });
}

// Eliminar un usuario
async function deleteUser(id) {
    await getUserById(id);
    return await usersRepository.remove(id);
}

// Iniciar sesión y generar JWT
async function login(email, password) {
    if (!email || !password) {
        const error = new Error(
            'El correo electrónico y la contraseña son obligatorios'
        );
        error.statusCode = 400;
        throw error;
    }

    if (!process.env.JWT_SECRET) {
        const error = new Error(
            'La configuración de autenticación no está disponible'
        );
        error.statusCode = 500;
        throw error;
    }

    const user = await usersRepository.findByEmail(
        String(email).trim().toLowerCase()
    );

    if (!user || user.password !== password) {
        const error = new Error('Credenciales incorrectas');
        error.statusCode = 401;
        throw error;
    }

    const token = jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '2h'
        }
    );

    const {
        password: ignoredPassword,
        ...publicUser
    } = user;

    return {
        message: 'Inicio de sesión exitoso.',
        user: publicUser,
        token,
        token_type: 'Bearer',
        expires_in: 7200
    };
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    login
};