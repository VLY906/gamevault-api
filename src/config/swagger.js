const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',

        info: {
            title: 'GameVault API',
            version: '1.0.0',
            description:
                'API REST para gestionar usuarios, juegos, compras y reseñas de GameVault.'
        },

        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor local de desarrollo'
            }
        ],

        tags: [
            {
                name: 'Usuarios',
                description: 'Gestión de usuarios y autenticación'
            },
            {
                name: 'Juegos',
                description: 'Gestión del catálogo de juegos'
            },
            {
                name: 'Compras',
                description: 'Gestión de compras'
            },
            {
                name: 'Reseñas',
                description: 'Gestión de reseñas de juegos'
            }
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description:
                        'Introduce el token JWT obtenido al iniciar sesión.'
                }
            }
        }
    },

    apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;