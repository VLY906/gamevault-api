const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');

require('dotenv').config();

const gamesRoutes = require('./src/routes/games.routes');
const usersRoutes = require('./src/routes/users.routes');
const purchasesRoutes = require('./src/routes/purchases.routes');
const reviewsRoutes = require('./src/routes/reviews.routes');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'API de GameVault funcionando.'
    });
});

app.use('/games', gamesRoutes);
app.use('/users', usersRoutes);
app.use('/purchases', purchasesRoutes);
app.use('/reviews', reviewsRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Endpoint no encontrado
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint no encontrado.'
    });
});

// Middleware centralizado de errores
app.use((error, req, res, next) => {
    console.error('ERROR DETALLADO:', error);
    console.error('MENSAJE:', error.message);
    console.error('CODIGO MYSQL:', error.code);

    if (res.headersSent) {
        return next(error);
    }

    if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
            error: 'Ya existe un registro con esos datos.'
        });
    }

    const statusCode = error.statusCode || 500;

    res.status(statusCode).json({
        error: error.message || 'Error interno del servidor.'
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});