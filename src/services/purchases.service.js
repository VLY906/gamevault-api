
const purchasesRepository = require('../repositories/purchases.repository');
const usersRepository = require('../repositories/users.repository');
const gamesRepository = require('../repositories/games.repository');

const VALID_STATUSES = ['completed', 'pending', 'cancelled'];

function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

function validatePositiveInteger(value, fieldName) {
    if (
        value === undefined ||
        value === null ||
        value === '' ||
        !Number.isInteger(Number(value)) ||
        Number(value) <= 0
    ) {
        throw createError(
            `${fieldName} debe ser un entero positivo`,
            400
        );
    }

    return Number(value);
}

function validateStatus(status, required = false) {
    if (!status && !required) {
        return 'completed';
    }

    if (!VALID_STATUSES.includes(status)) {
        throw createError(
            'status debe ser completed, pending o cancelled',
            400
        );
    }

    return status;
}

async function validateItems(items) {
    if (!Array.isArray(items) || items.length === 0) {
        throw createError(
            'items debe ser un arreglo con al menos un videojuego',
            400
        );
    }

    const validatedItems = [];

    for (const item of items) {
        if (!item || typeof item !== 'object') {
            throw createError(
                'Cada elemento de items debe ser un objeto válido',
                400
            );
        }

        const gameId = validatePositiveInteger(
            item.game_id,
            'game_id'
        );

        const game = await gamesRepository.findById(gameId);

        if (!game) {
            throw createError(
                `El videojuego con ID ${gameId} no existe`,
                404
            );
        }

        validatedItems.push({ game_id: gameId });
    }

    return validatedItems;
}

async function getAllPurchases() {
    return purchasesRepository.findAll();
}

async function getPurchaseById(id) {
    const purchaseId = validatePositiveInteger(id, 'id');
    const purchase = await purchasesRepository.findById(purchaseId);

    if (!purchase) {
        throw createError('Compra no encontrada', 404);
    }

    return purchase;
}

async function getPurchasesByUserId(userId) {
    const validatedUserId = validatePositiveInteger(
        userId,
        'userId'
    );

    const user = await usersRepository.findById(validatedUserId);

    if (!user) {
        throw createError('Usuario no encontrado', 404);
    }

    return purchasesRepository.findByUserId(validatedUserId);
}

async function getSalesByDate(date) {
    if (
        typeof date !== 'string' ||
        !/^\d{4}-\d{2}-\d{2}$/.test(date)
    ) {
        throw createError(
            'La fecha es obligatoria y debe tener formato YYYY-MM-DD',
            400
        );
    }

    const parsedDate = new Date(`${date}T00:00:00.000Z`);

    if (
        Number.isNaN(parsedDate.getTime()) ||
        parsedDate.toISOString().slice(0, 10) !== date
    ) {
        throw createError('La fecha indicada no es válida', 400);
    }

    const sales = await purchasesRepository.findSalesByDate(date);

    const totalSales = sales.reduce(
        (total, sale) => total + Number(sale.amount),
        0
    );

    return {
        date,
        total_sales: Number(totalSales.toFixed(2)),
        total_transactions: new Set(
            sales.map((sale) => sale.purchase_id)
        ).size,
        sales
    };
}

async function createPurchase(purchaseData) {
    const { user_id, items, status } = purchaseData;

    const userId = validatePositiveInteger(user_id, 'user_id');
    const purchaseStatus = validateStatus(status);

    const user = await usersRepository.findById(userId);

    if (!user) {
        throw createError('El usuario indicado no existe', 404);
    }

    const validatedItems = await validateItems(items);

    return purchasesRepository.create({
        user_id: userId,
        items: validatedItems,
        status: purchaseStatus
    });
}

async function updatePurchase(id, purchaseData) {
    const purchaseId = validatePositiveInteger(id, 'id');

    await getPurchaseById(purchaseId);

    const { user_id, items, status } = purchaseData;

    const userId = validatePositiveInteger(user_id, 'user_id');

    if (status === undefined || status === null || status === '') {
        throw createError('status es obligatorio', 400);
    }

    const purchaseStatus = validateStatus(status, true);

    const user = await usersRepository.findById(userId);

    if (!user) {
        throw createError('El usuario indicado no existe', 404);
    }

    let validatedItems;

    if (items !== undefined) {
        validatedItems = await validateItems(items);
    }

    return purchasesRepository.update(purchaseId, {
        user_id: userId,
        items: validatedItems,
        status: purchaseStatus
    });
}

async function deletePurchase(id) {
    const purchaseId = validatePositiveInteger(id, 'id');

    await getPurchaseById(purchaseId);

    return purchasesRepository.remove(purchaseId);
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
