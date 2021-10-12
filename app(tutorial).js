const express = require('express')
const logger = require('morgan')

//enable websocket
const enableWs = require('express-ws')

const app = express()
//logger middle ware
app.use(logger('common'))
//enable websocket
enableWs(app)

// const replies = [
//   "I'm glad we hit it off well!",
//   "Would you like a cup of coffee?",
//   "That's interesting to hear.",
//   "Nice to meet you!",
//   "Have a good day!"
// ]


//define chat end-point
app.ws('/heartbeat', (ws, req) => {
  // on client message coming in
  // (msg)=>{} handler to handle message , and send reply in a timeout
  ws.on('message', (msg) => {
    console.log(msg)
    setTimeout(() => {
      const reply = replies[Math.floor(Math.random() * replies.length)]
      ws.send(reply)
    }, 200)


  setInterval(()=>{
    ws.send('hello!')
  },2000)
  })
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})