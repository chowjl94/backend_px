const express = require('express')
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs');
const swaggerfile = YAML.load('./src/openapi/openapi.yml')

module.exports = (authMiddleware, authService,ampqservice, db) => {
  const router = express.Router()

  router.get('/', (req, res, next) => {
    res.send('Hello world!')

  })
  

  //import auth with DI and pass authService
  router.use('/', require('./auth')(authService))
  router.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerfile))//swagger ui to serve the specifications

  router.use(authMiddleware)
  router.use('/todo', require('./todo')(db,ampqservice))
  router.use('/indivtask', require('./indivtask')(db))
  

  return router
}
