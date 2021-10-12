const express = require('express')
const logger = require('morgan')
const enableWs = require('express-ws')

const app = express()
enableWs(app)
app.use(logger('common'))

//define chat end-point
app.ws('/heartbeat', (ws, req) => {

  setInterval(()=>{
    curDate = new Date()
    const curMin = curDate.getMinutes()
    if (curMin==42){
      message = `42 is the meaning of life`
    }else{
      message = `I am alive at ${curDate}`
    }
    ws.send(message)
  },60000)
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})