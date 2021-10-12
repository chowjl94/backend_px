require('dotenv').config

const PORT = process.env.CONSUMER_PORT
console.log(PORT)

console.log(require('dotenv').config().parsed.CONSUMER_PORT)