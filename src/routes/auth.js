const express = require('express')

module.exports = (service) => {
  const router = express.Router()
  /**
   * @openapi
   * components:
   *  schemas:
   *    User:
   *      type: object
   *      required:
   *        - username
   *        - password
   *      properties:
   *        username:
   *          type: string
   *        name:
   *          type: string
   *        password:
   *          type: string
   */

  /**
   * @openapi
   * /register:
   *  post:
   *    tags:
   *    - auth
   *    description: Register a user
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/User'
   *    responses:
   *      200:
   *        description: OK
   *      400:
   *        description: Username already exists
   */

  
  router.post('/register', async (req, res, next) => {

    const { username,name, password } = req.body
    const token = await service.registerUser(username, name,password)
    if (token) {
      res.send({ token: token })
    } else {
      res.status(400).send(`Username ${username} already exists`)
    }
  })


    /**
   * @openapi
   *components:
   *  schemas:
   *    Login:
   *      type: object
   *      required:
   *        - username
   *        - password
   *      properties:
   *        username:
   *          type: string
   *        password:
   *          type: string
   * 
   * 
   */

  /**
   * @openapi
   * /login:
   *  post:
   *    tags:
   *    - auth
   *    description: Login a  Registered user
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/Login'
   * 
   *    responses:
   *      200:
   *        description: OK
   *      400:
   *        description: Username already exists
   */






  router.post('/login', async (req, res, next) => {
    const { username, password } = req.body
    const token = await service.loginUser(username, password)
    if (token) {
      res.send({ token: token })
      console.log(`logged in to ${username}`)
    } else {
      res.status(400).send('Invalid login credentials')
    }
  })




  return router
}