
const purchasesService = require('../services/purchases.service');

async function getAllPurchases(req, res, next) {
    try {
        const purchases = await purchasesService.getAllPurchases();
        return res.status(200).json(purchases);
    } catch (error) {
        return next(error);
    }
}

async function getPurchaseById(req, res, next) {
    try {
        const purchase = await purchasesService.getPurchaseById(
            req.params.id
        );

        return res.status(200).json(purchase);
    } catch (error) {
        return next(error);
    }
}

async function getPurchasesByUserId(req, res, next) {
    try {
        const purchases = await purchasesService.getPurchasesByUserId(
            req.params.userId
        );

        return res.status(200).json(purchases);
    } catch (error) {
        return next(error);
    }
}

async function getSalesByDate(req, res, next) {
    try {
        const salesReport = await purchasesService.getSalesByDate(
            req.query.date
        );

        return res.status(200).json(salesReport);
    } catch (error) {
        return next(error);
    }
}

async function createPurchase(req, res, next) {
    try {
        const purchase = await purchasesService.createPurchase(req.body);
        return res.status(201).json(purchase);
    } catch (error) {
        return next(error);
    }
}

async function updatePurchase(req, res, next) {
    try {
        const purchase = await purchasesService.updatePurchase(
            req.params.id,
            req.body
        );

        return res.status(200).json(purchase);
    } catch (error) {
        return next(error);
    }
}

async function deletePurchase(req, res, next) {
    try {
        await purchasesService.deletePurchase(req.params.id);

        return res.status(200).json({
            message: 'Compra eliminada correctamente.'
        });
    } catch (error) {
        return next(error);
    }
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
