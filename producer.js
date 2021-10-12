require('dotenv').config()
const WebSocket =require('ws')
const PORT =8000

const wsServer = new WebSocket.Server({
    PORT:PORT
})


wsServer.on('connection',function(socket){
    console.log('Client Connected')

    socket.on('message',function(msg){
        console.log('Received'+msg)

        wsServer.clients.forEach(function(client){
            client.send('someone said ' + msg)
        })
    })
})


console.log('Server is listenning on '+ process.env.PRODUCER_PORT)