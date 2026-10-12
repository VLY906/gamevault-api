const pool = require('../config/db');

async function findAll() {
  const [rows] = await pool.query('SELECT * FROM games');
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM games WHERE id = ?', [id]);
  return rows[0];
}

async function create(gameData) {
  const { name, price, genre, age_rating, description } = gameData;
  const [result] = await pool.query(
    'INSERT INTO games (name, price, genre, age_rating, description) VALUES (?, ?, ?, ?, ?)',
    [name, price, genre, age_rating, description]
  );
  return { id: result.insertId, ...gameData };
}

async function update(id, gameData) {
  const { name, price, genre, age_rating, description } = gameData;
  await pool.query(
    'UPDATE games SET name = ?, price = ?, genre = ?, age_rating = ?, description = ? WHERE id = ?',
    [name, price, genre, age_rating, description, id]
  );
  return { id, ...gameData };
}

async function remove(id) {
  await pool.query('DELETE FROM games WHERE id = ?', [id]);
}

module.exports = { findAll, findById, create, update, remove };