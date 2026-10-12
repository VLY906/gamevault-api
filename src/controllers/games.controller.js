const gamesService = require('../services/games.service');

async function getAllGames(req, res, next) {
    try {
        const games = await gamesService.getAllGames();
        res.status(200).json(games);
    } catch (error) {
        next(error);
    }
}

async function getGamesByGenre(req, res, next) {
    try {
        const games = await gamesService.getGamesByGenre(req.query.genre);
        res.status(200).json(games);
    } catch (error) {
        next(error);
    }
}

async function getGameById(req, res, next) {
    try {
        const game = await gamesService.getGameById(req.params.id);
        res.status(200).json(game);
    } catch (error) {
        next(error);
    }
}

async function createGame(req, res, next) {
    try {
        const game = await gamesService.createGame(req.body);
        res.status(201).json(game);
    } catch (error) {
        next(error);
    }
}

async function updateGame(req, res, next) {
    try {
        const game = await gamesService.updateGame(
            req.params.id,
            req.body
        );
        res.status(200).json(game);
    } catch (error) {
        next(error);
    }
}

async function deleteGame(req, res, next) {
    try {
        await gamesService.deleteGame(req.params.id);
        res.status(200).json({
            message: 'Juego eliminado correctamente'
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllGames,
    getGamesByGenre,
    getGameById,
    createGame,
    updateGame,
    deleteGame
};