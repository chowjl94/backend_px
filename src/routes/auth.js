const express = require('express')

module.exports = (service) => {
  const router = express.Router()


  //two routes


  // one to register
  
  router.post('/register', async (req, res, next) => {
    //post method passing username and passwor to request body
    //destructuring req body
    const { username, password } = req.body
    // call some service to register user  to get a token
    const token = await service.registerUser(username, password)
    //if token is valid send back the token
    if (token) {
      res.send({ token: token })
    // else return a a message 
    } else {
      res.status(400).send(`Username ${username} already exists`)
    }
  })

  // one to login
  router.post('/login', async (req, res, next) => {
    // destructing req body
    const { username, password } = req.body
    //call a loginUser service to get a token
    const token = await service.loginUser(username, password)
    // if token is valid send back the token
    if (token) {
      res.send({ token: token })
      console.log(`logged in to ${username}`)
    } else {
      res.status(400).send('Invalid login credentials')
    }
  })

  return router
}