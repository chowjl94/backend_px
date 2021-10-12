const amqplib = require('amqplib')
const fs = require('fs') 

//this queue name has to match the producer que name
const queue = 'heartbeat'

;(async () => {



  const client = await amqplib.connect('amqp://localhost:5672')
  const channel = await client.createChannel()
  await channel.assertQueue(queue)

  channel.consume(queue, (msg) => {
    try{

      const data = JSON.parse(msg.content)

      console.log(data)
      var stream = fs.createWriteStream("log.txt", {flags:'a'})
      stream.write(data+ "\n")
      stream.end();
      console.log('The "data to append" was appended to file!');

      channel.ack(msg)
    }catch(err){
      console.log(err)
      channel.nack(msg)
    }

  })
})()