const express = require('express')
const logger = require('morgan')
const OpenApiValidator = require('express-openapi-validator');
const UpdateService = require('./services/updatecount')
const db = require('./db')
const enableWs = require('express-ws')
const cron = require('node-cron')
const updateService = UpdateService(db)
let global

module.exports = (router) => {
  const app = express()

  app.use(express.json())
  app.use(logger('common'))
  // app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerfile))
  app.use(router)
  
  app.use(OpenApiValidator.middleware({
    apiSpec: './src/openapi/openapi.yml',
    validateApiSpec: true,
    validateRequests: true,
    validateResponses: true
  }))
  enableWs(app)
  app.ws('/public', (ws, req) => {
    cron.schedule('*/1 * * * *',async ()=>{
      const count = await updateService.updateCount()
      global =count 
    })
    ws.send(global)
  })

  app.use((err, req, res, next) => {
    // format error
    res.status(err.status || 500).json({
      message: err.message,
      errors: err.errors,
    });
  });

  
  return app
}