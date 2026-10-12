const reviewsRepository = require('../repositories/reviews.repository');
const purchasesRepository = require('../repositories/purchases.repository');
const usersRepository = require('../repositories/users.repository');
const gamesRepository = require('../repositories/games.repository');

async function getAllReviews() {
    return reviewsRepository.findAll();
}

async function getReviewById(id) {
    const review = await reviewsRepository.findById(id);

    if (!review) {
        const error = new Error('Reseña no encontrada.');
        error.statusCode = 404;
        throw error;
    }

    return review;
}

async function getReviewsByUserId(userId) {
    return reviewsRepository.findByUserId(userId);
}

async function getReviewsByGameId(gameId) {
    return reviewsRepository.findByGameId(gameId);
}

async function validateReviewData(reviewData) {
    const { user_id, game_id, rating, hours_played } = reviewData;

    if (!user_id || !game_id) {
        const error = new Error(
            'El ID del usuario y del juego son obligatorios.'
        );
        error.statusCode = 400;
        throw error;
    }

    if (
        !Number.isInteger(Number(user_id)) ||
        Number(user_id) <= 0 ||
        !Number.isInteger(Number(game_id)) ||
        Number(game_id) <= 0
    ) {
        const error = new Error(
            'user_id y game_id deben ser enteros positivos.'
        );
        error.statusCode = 400;
        throw error;
    }

    if (
        !Number.isInteger(Number(rating)) ||
        Number(rating) < 1 ||
        Number(rating) > 5
    ) {
        const error = new Error(
            'La calificación debe ser un número entero entre 1 y 5.'
        );
        error.statusCode = 400;
        throw error;
    }

    if (
        hours_played != null &&
        (!Number.isFinite(Number(hours_played)) ||
            Number(hours_played) < 0)
    ) {
        const error = new Error(
            'Las horas jugadas deben ser un número igual o mayor que cero.'
        );
        error.statusCode = 400;
        throw error;
    }

    const user = await usersRepository.findById(Number(user_id));

    if (!user) {
        const error = new Error('El usuario indicado no existe.');
        error.statusCode = 404;
        throw error;
    }

    const game = await gamesRepository.findById(Number(game_id));

    if (!game) {
        const error = new Error('El videojuego indicado no existe.');
        error.statusCode = 404;
        throw error;
    }

    const purchases = await purchasesRepository.findByUserId(
        Number(user_id)
    );

    const hasPurchasedGame = purchases.some(
        purchase =>
            Number(purchase.game_id) === Number(game_id) &&
            purchase.status === 'completed'
    );

    if (!hasPurchasedGame) {
        const error = new Error(
            'Solo puedes reseñar videojuegos que hayas comprado.'
        );
        error.statusCode = 403;
        throw error;
    }

    return {
        ...reviewData,
        user_id: Number(user_id),
        game_id: Number(game_id),
        rating: Number(rating),
        hours_played:
            hours_played == null ? null : Number(hours_played)
    };
}

async function createReview(reviewData) {
    const validatedData = await validateReviewData(reviewData);
    return reviewsRepository.create(validatedData);
}

async function updateReview(id, reviewData) {
    await getReviewById(id);

    const validatedData = await validateReviewData(reviewData);

    return reviewsRepository.update(id, validatedData);
}

async function deleteReview(id) {
    await getReviewById(id);
    return reviewsRepository.remove(id);
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