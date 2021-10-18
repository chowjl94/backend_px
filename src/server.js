require('dotenv').config()

const App = require('./app')
const Router = require('./routes')
const AuthMiddleware = require('./middlewares/auth')
const AuthService = require('./services/auth')

const AmpqService = require('./services/amqp')
const db = require('./db')

const ampqService = AmpqService()

const authService = AuthService(db)
const authMiddleware = AuthMiddleware(authService)
const router = Router(authMiddleware, authService,ampqService, db)
const app = App(router)


const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})