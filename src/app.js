const express = require('express')
const logger = require('morgan')
const OpenApiValidator = require('express-openapi-validator');

module.exports = (router) => {
  const app = express()
  app.use(express.json())
  app.use(logger('common'))
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

  app.use(router)
  return app
}