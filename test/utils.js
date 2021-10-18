require('dotenv').config({path: '.env.test'})
const App = require('../src/app')
const Router = require('../src/routes')
const AuthMiddleware = require('../src/middlewares/auth')
const AuthService = require('../src/services/auth')

const AmpqService = require('../src/services/amqp')
const db = require('../src/db')

const ampqService = AmpqService()

const authService = AuthService(db)
const authMiddleware = AuthMiddleware(authService)
const router = Router(authMiddleware, authService,ampqService, db)
const app = App(router)
// const name = "test";
// const username = "test@test.com";
// const password = "testword";
const utils = {}
utils.app = app
utils.db = db

utils.before = async () =>{
    await db.initialise()
    await db.clearAccess()
    await db.clearUserstodo()
    await db.clearTodo()
    await db.clearIndivtask()
}

utils.after = async () =>{
    await db.end()
}

utils.registerUser = async (username, email ,password ) => {
    const token = await authService.registerUser(username, email, password)
    return `Bearer ${token}`
  }

utils.loginUser = async(username,password)=>{
    const token = await authService.loginUser(username,password)
    return token
}
  


module.exports = utils