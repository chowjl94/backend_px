//business logic tend to be in services
// and route handling to be in routes

// this file will contain authentication logic


//import jwt for auth
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

//impor User Data model
const User = require('../models/user')

//salt rounds for ppl with similar password
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS)
const JWT_SECRET = process.env.JWT_SECRET
// defined own expiry time in .env
const JWT_EXPIRY = parseInt(process.env.JWT_EXPIRY)

// this function is being exproted and it returns a service object
module.exports = (db) => {
  // instantiate service obj
  const service = {}



  // genertate token function takes in a unique id and 
  service.generateToken = (uid) => {
    // jwt.sign(payload=>{uid}, secret=>JWT_SECRET, options=>{expiresIn:JWT_EXPIRY})
    return jwt.sign({ uid }, JWT_SECRET, { expiresIn: JWT_EXPIRY })
  }

  // a service that takes in a username to verify if it exist
  service.registerUser = async (username, password) => {
    // we check in database if the user name exists
    const user = await db.findUserByUsername(username)
    //if exist user exist return null this function should be useless
    if (user) {
      return null
      //else we hash the password
      // create a new user 
    } else {
      //cryptographic function to return a haashed password, bcrypt to provide salt rounds
      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
      //create a new User data model instance with a hashed password we never store unhased password in DBs
      const newUser = new User({ username, password_hash: passwordHash })
      //inserts the user into the database
      const user = await db.insertUser(newUser)
      //then we generate a new token for the user and return the token
      return service.generateToken(user.id)
    }
  }

  service.loginUser = async (username, password) => {
    const user = await db.findUserByUsername(username)
    if (user) {
      const isValid = await bcrypt.compare(password, user.password_hash)
      if (isValid) {
        return service.generateToken(user.id)
      }
    }
    return null
  }

  service.verifyToken = (token) => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      return decoded.uid
    } catch (err) {
      return null
    }
  }

  return service
}