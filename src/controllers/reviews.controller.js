
const reviewsService = require('../services/reviews.service');

async function getAllReviews(req, res, next) {
    try {
        const reviews = await reviewsService.getAllReviews();
        res.status(200).json(reviews);
    } catch (error) {
        next(error);
    }
}

async function getReviewById(req, res, next) {
    try {
        const review = await reviewsService.getReviewById(req.params.id);
        res.status(200).json(review);
    } catch (error) {
        next(error);
    }
}

async function getReviewsByUserId(req, res, next) {
    try {
        const reviews = await reviewsService.getReviewsByUserId(
            req.params.userId
        );
        res.status(200).json(reviews);
    } catch (error) {
        next(error);
    }
}

async function getReviewsByGameId(req, res, next) {
    try {
        const reviews = await reviewsService.getReviewsByGameId(
            req.params.gameId
        );
        res.status(200).json(reviews);
    } catch (error) {
        next(error);
    }
}

async function createReview(req, res, next) {
    try {
        const review = await reviewsService.createReview(req.body);
        res.status(201).json(review);
    } catch (error) {
        next(error);
    }
}

async function updateReview(req, res, next) {
    try {
        const review = await reviewsService.updateReview(
            req.params.id,
            req.body
        );
        res.status(200).json(review);
    } catch (error) {
        next(error);
    }
}

async function deleteReview(req, res, next) {
    try {
        await reviewsService.deleteReview(req.params.id);

        res.status(200).json({
            message: 'Reseña eliminada correctamente.'
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllReviews,
    getReviewById,
    getReviewsByUserId,
    getReviewsByGameId,
    createReview,
    updateReview,
    deleteReview
};
