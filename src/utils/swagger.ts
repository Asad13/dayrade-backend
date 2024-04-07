import swaggerJSDoc, { type Options } from 'swagger-jsdoc';

const swaggerJSDocOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Demo Docs',
      description: 'A demo API',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/**/*.ts', './src/schemas/openapi/**/*.ts'],
};

const swaggerDoc = swaggerJSDoc(swaggerJSDocOptions);

export default swaggerDoc;
