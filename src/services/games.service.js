const gamesRepository = require('../repositories/games.repository');

async function getAllGames() {
  return await gamesRepository.findAll();
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
  if (!gameData.name || !gameData.price || !gameData.genre) {
    const error = new Error('Nombre, precio y género son obligatorios');
    error.statusCode = 400;
    throw error;
  }
  return await gamesRepository.create(gameData);
}

async function updateGame(id, gameData) {
  await getGameById(id);
  return await gamesRepository.update(id, gameData);
}

async function deleteGame(id) {
  await getGameById(id);
  await gamesRepository.remove(id);
}

module.exports = { getAllGames, getGameById, createGame, updateGame, deleteGame };