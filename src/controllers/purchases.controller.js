const purchasesService = require('../services/purchases.service');

async function getAllPurchases(req, res, next) {
    try {
        const purchases = await purchasesService.getAllPurchases();
        res.status(200).json(purchases);
    } catch (error) {
        next(error);
    }
}

async function getPurchaseById(req, res, next) {
    try {
        const purchase = await purchasesService.getPurchaseById(req.params.id);
        res.status(200).json(purchase);
    } catch (error) {
        next(error);
    }
}

async function getPurchasesByUserId(req, res, next) {
    try {
        const purchases = await purchasesService.getPurchasesByUserId(
            req.params.userId
        );
        res.status(200).json(purchases);
    } catch (error) {
        next(error);
    }
}

async function getSalesByDate(req, res, next) {
    try {
        const sales = await purchasesService.getSalesByDate(req.query.date);
        res.status(200).json({
            date: req.query.date,
            total_sales: sales.reduce(
                (total, sale) => total + Number(sale.amount),
                0
            ),
            total_transactions: sales.length,
            sales
        });
    } catch (error) {
        next(error);
    }
}

async function createPurchase(req, res, next) {
    try {
        const purchase = await purchasesService.createPurchase(req.body);
        res.status(201).json(purchase);
    } catch (error) {
        next(error);
    }
}

async function updatePurchase(req, res, next) {
    try {
        const purchase = await purchasesService.updatePurchase(
            req.params.id,
            req.body
        );
        res.status(200).json(purchase);
    } catch (error) {
        next(error);
    }
}

async function deletePurchase(req, res, next) {
    try {
        await purchasesService.deletePurchase(req.params.id);
        res.status(200).json({
            message: 'Compra eliminada correctamente.'
        });
    } catch (error) {
        next(error);
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