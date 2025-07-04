import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Shopping Mall API',
      version: '1.0.0',
      description: 'API documentation for the Shopping Mall project',
    },
    components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
});