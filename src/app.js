const express = require('express')
const logger = require('morgan')
const OpenApiValidator = require('express-openapi-validator');
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs');
const swaggerfile = YAML.load('./src/openapi/openapi.yml')

module.exports = (router) => {
  const app = express()
  app.use(express.json())
  app.use(logger('common'))
  app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerfile))
  app.use(router)
  
  app.use(OpenApiValidator.middleware({
    apiSpec: './src/openapi/openapi.yml',
    validateApiSpec: true,
    validateRequests: true,
    validateResponses: true
  }))

  

  app.use((err, req, res, next) => {
    // format error
    res.status(err.status || 500).json({
      message: err.message,
      errors: err.errors,
    });
  });

  
  return app
}