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

const utils = {}
utils.app = app
utils.db = db

utils.before = async () =>{
    await db.initialise()
    await db.clearIndivtask()
    await db.clearAccess()
    await db.clearTodo()
    await db.clearUserstodo()
   

    
    
}

utils.after = async () =>{
    await db.end()
}

utils.registerUser = async (username,name,password) => {
    const token = await authService.registerUser(username,name,password)
    return token

}


module.exports = utils