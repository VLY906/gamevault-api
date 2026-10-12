const gamesRepository = require('../repositories/games.repository');

async function getAllGames() {
    return await gamesRepository.findAll();
}

async function getGamesByGenre(genre) {
    if (!genre || !genre.trim()) {
        const error = new Error('El género es obligatorio');
        error.statusCode = 400;
        throw error;
    }

    return await gamesRepository.findByGenre(genre.trim());
}

async function getGameById(id) {
    const game = await gamesRepository.findById(id);

    if (!game) {
        const error = new Error('Juego no encontrado');
        error.statusCode = 404;
        throw error;
    }

    return game;
}

async function createGame(gameData) {
    const { name, price, genre, age_rating, description } = gameData;

    if (!name || price === undefined || !genre || !age_rating) {
        const error = new Error(
            'Nombre, precio, género y clasificación por edad son obligatorios'
        );
        error.statusCode = 400;
        throw error;
    }

    if (!Number.isFinite(Number(price)) || Number(price) < 0) {
        const error = new Error('El precio debe ser un número mayor o igual a cero');
        error.statusCode = 400;
        throw error;
    }

    return await gamesRepository.create({
        name: name.trim(),
        price: Number(price),
        genre: genre.trim(),
        age_rating: age_rating.trim(),
        description: description || null
    });
}

async function updateGame(id, gameData) {
    await getGameById(id);

    const { name, price, genre, age_rating, description } = gameData;

    if (!name || price === undefined || !genre || !age_rating) {
        const error = new Error(
            'Nombre, precio, género y clasificación por edad son obligatorios'
        );
        error.statusCode = 400;
        throw error;
    }

    if (!Number.isFinite(Number(price)) || Number(price) < 0) {
        const error = new Error('El precio debe ser un número mayor o igual a cero');
        error.statusCode = 400;
        throw error;
    }

    return await gamesRepository.update(id, {
        name: name.trim(),
        price: Number(price),
        genre: genre.trim(),
        age_rating: age_rating.trim(),
        description: description || null
    });
}

async function deleteGame(id) {
    await getGameById(id);
    return await gamesRepository.remove(id);
}

module.exports = {
    getAllGames,
    getGamesByGenre,
    getGameById,
    createGame,
    updateGame,
    deleteGame
};