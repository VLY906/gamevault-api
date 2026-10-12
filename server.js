const express = require('express');
require('dotenv').config();

const gamesRoutes = require('./src/routes/games.routes');

const app = express();

app.use(express.json());
app.use('/games', gamesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});