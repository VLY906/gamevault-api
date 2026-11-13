const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');

require('dotenv').config();

const gamesRoutes = require('./src/routes/games.routes');
const usersRoutes = require('./src/routes/users.routes');
const purchasesRoutes = require('./src/routes/purchases.routes');
const reviewsRoutes = require('./src/routes/reviews.routes');

const app = express();

// Permitir conexiones desde el frontend en puertos locales.
app.use(cors({
    origin: (origin, callback) => {
        // Permitir herramientas como Postman que no envían origin.
        if (!origin) {
            return callback(null, true);
        }

        const allowedOrigin =
            /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

        if (allowedOrigin) {
            return callback(null, true);
        }

        return callback(new Error('Origen no permitido por CORS.'));
    }
}));

app.use(express.json());

// Ruta principal
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'API de GameVault funcionando.'
    });
});

// Rutas de la API
app.use('/games', gamesRoutes);
app.use('/users', usersRoutes);
app.use('/purchases', purchasesRoutes);
app.use('/reviews', reviewsRoutes);

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Endpoint no encontrado
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint no encontrado.'
    });
});

// Manejo centralizado de errores
app.use((error, req, res, next) => {
    console.error('ERROR:', error);

    if (res.headersSent) {
        return next(error);
    }

    res.status(error.statusCode || 500).json({
        error: error.message || 'Error interno del servidor.'
    });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, '127.0.0.1', () => {
    console.log(`Servidor corriendo en http://127.0.0.1:${PORT}`);
});

server.on('error', (error) => {
    console.error('ERROR AL INICIAR EL SERVIDOR:', error);
});

server.on('close', () => {
    console.log('ATENCION: El servidor se ha cerrado.');
});