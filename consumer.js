require('dotenv').config()
const WebSocket = require('ws')
const fs = require('fs')
const PORT = 5000
const ws = new WebSocket(`ws://127.0.0.1:5000`)

ws.on('open',function(){
    ws.send('Connected to Server')
})


ws.on('message',function(msg){
    console.log(msg.data)
    // fs.appendFile('log.txt',msg.data + '\n\n')
})