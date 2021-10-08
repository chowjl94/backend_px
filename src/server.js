require('dotenv').config()
const App = require('./app')
const Router = require('./routes')
const AuthMiddleware = require('./middlewares/auth')
const AuthService = require('./services/auth')
// const ConsumerService = require('./services/consumer')
const AmpqService = require('./services/amqp')
const db = require('./db')

const ampqService = AmpqService()
// const consumerservice = ConsumerService(db)
const authService = AuthService(db)
const authMiddleware = AuthMiddleware(authService)
const router = Router(authMiddleware, authService,ampqService, db)
const app = App(router)
// consumerservice.consumeEmail()

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})