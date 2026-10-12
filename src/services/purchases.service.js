const purchasesRepository = require('../repositories/purchases.repository');
const usersRepository = require('../repositories/users.repository');
const gamesRepository = require('../repositories/games.repository');

async function getAllPurchases() {
    return await purchasesRepository.findAll();
}

async function getPurchaseById(id) {
    const purchase = await purchasesRepository.findById(id);

    if (!purchase) {
        const error = new Error('Compra no encontrada');
        error.statusCode = 404;
        throw error;
    }

    return purchase;
}

async function getPurchasesByUserId(userId) {
    const user = await usersRepository.findById(userId);

    if (!user) {
        const error = new Error('Usuario no encontrado');
        error.statusCode = 404;
        throw error;
    }

    return await purchasesRepository.findByUserId(userId);
}

async function getSalesByDate(date) {
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        const error = new Error(
            'La fecha es obligatoria y debe tener formato YYYY-MM-DD'
        );
        error.statusCode = 400;
        throw error;
    }

    const parsedDate = new Date(`${date}T00:00:00Z`);

    if (
        Number.isNaN(parsedDate.getTime()) ||
        parsedDate.toISOString().slice(0, 10) !== date
    ) {
        const error = new Error('La fecha indicada no es válida');
        error.statusCode = 400;
        throw error;
    }

    return await purchasesRepository.findSalesByDate(date);
}

async function createPurchase(purchaseData) {
    const { user_id, game_id, price_paid, status } = purchaseData;

    if (!user_id || !game_id || price_paid === undefined) {
        const error = new Error(
            'Los campos user_id, game_id y price_paid son obligatorios'
        );
        error.statusCode = 400;
        throw error;
    }

    if (!Number.isInteger(Number(user_id)) || Number(user_id) <= 0) {
        const error = new Error('user_id debe ser un entero positivo');
        error.statusCode = 400;
        throw error;
    }

    if (!Number.isInteger(Number(game_id)) || Number(game_id) <= 0) {
        const error = new Error('game_id debe ser un entero positivo');
        error.statusCode = 400;
        throw error;
    }

    if (!Number.isFinite(Number(price_paid)) || Number(price_paid) < 0) {
        const error = new Error(
            'price_paid debe ser un número mayor o igual a cero'
        );
        error.statusCode = 400;
        throw error;
    }

    const user = await usersRepository.findById(user_id);

    if (!user) {
        const error = new Error('El usuario indicado no existe');
        error.statusCode = 404;
        throw error;
    }

    const game = await gamesRepository.findById(game_id);

    if (!game) {
        const error = new Error('El videojuego indicado no existe');
        error.statusCode = 404;
        throw error;
    }

    const validStatuses = ['completed', 'pending', 'cancelled'];
    const purchaseStatus = status || 'completed';

    if (!validStatuses.includes(purchaseStatus)) {
        const error = new Error(
            'status debe ser completed, pending o cancelled'
        );
        error.statusCode = 400;
        throw error;
    }

    return await purchasesRepository.create({
        user_id: Number(user_id),
        game_id: Number(game_id),
        price_paid: Number(price_paid),
        status: purchaseStatus
    });
}

async function updatePurchase(id, purchaseData) {
    await getPurchaseById(id);

    const { user_id, game_id, price_paid, status } = purchaseData;

    if (!user_id || !game_id || price_paid === undefined || !status) {
        const error = new Error(
            'user_id, game_id, price_paid y status son obligatorios'
        );
        error.statusCode = 400;
        throw error;
    }

    if (!Number.isInteger(Number(user_id)) || Number(user_id) <= 0) {
        const error = new Error('user_id debe ser un entero positivo');
        error.statusCode = 400;
        throw error;
    }

    if (!Number.isInteger(Number(game_id)) || Number(game_id) <= 0) {
        const error = new Error('game_id debe ser un entero positivo');
        error.statusCode = 400;
        throw error;
    }

    if (!Number.isFinite(Number(price_paid)) || Number(price_paid) < 0) {
        const error = new Error(
            'price_paid debe ser un número mayor o igual a cero'
        );
        error.statusCode = 400;
        throw error;
    }

    if (!['completed', 'pending', 'cancelled'].includes(status)) {
        const error = new Error(
            'status debe ser completed, pending o cancelled'
        );
        error.statusCode = 400;
        throw error;
    }

    const user = await usersRepository.findById(user_id);

    if (!user) {
        const error = new Error('El usuario indicado no existe');
        error.statusCode = 404;
        throw error;
    }

    const game = await gamesRepository.findById(game_id);

    if (!game) {
        const error = new Error('El videojuego indicado no existe');
        error.statusCode = 404;
        throw error;
    }

    return await purchasesRepository.update(id, {
        user_id: Number(user_id),
        game_id: Number(game_id),
        price_paid: Number(price_paid),
        status
    });
}

async function deletePurchase(id) {
    await getPurchaseById(id);
    return await purchasesRepository.remove(id);
}

module.exports = {
    getAllPurchases,
    getPurchaseById,
    getPurchasesByUserId,
    getSalesByDate,
    createPurchase,
    updatePurchase,
    deletePurchase
};