const express = require('express')

module.exports = (authMiddleware, authService,ampqservice, db) => {
  const router = express.Router()

  router.get('/', (req, res, next) => {
    res.send('Hello world!')

  })
  

  //import auth with DI and pass authService
  router.use('/', require('./auth')(authService))

  // All routes from this point will use the auth middleware  
  // using middle ware before accessing the item route
  router.use(authMiddleware)
  router.use('/todo', require('./todo')(db,ampqservice))
  router.use('/indivtask', require('./indivtask')(db))
  

  return router
}
