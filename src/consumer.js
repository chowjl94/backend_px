const amqplib = require('amqplib')
const fs = require('fs') 

//this queue name has to match the producer que name
const queue = 'heartbeat'

;(async () => {

  //same steps as producer 
  //connecting to port , createing a channel , and ensure the channel is in the right queue

  const client = await amqplib.connect('amqp://localhost:5672')
  const channel = await client.createChannel()
  await channel.assertQueue(queue)

  // function that takes in a queue and a msg
 
  // .ack(msg) is to acknowledge message for worker

  // provide a queue nanme and  funtion to process the message
  channel.consume(queue, (msg) => {
    try{
       // .content to get data payload
      const data = JSON.parse(msg.content)
      // once data is accessed we can manipulate the data or any logic you wannt execute
      console.log(data)
      var stream = fs.createWriteStream("log.txt", {flags:'a'})
      stream.write(data+ "\n")
      stream.end();
      console.log('The "data to append" was appended to file!');
      // will not consider the message being read until the consumer acknowledges it
      // by being the last final step as a check
      channel.ack(msg)
    }catch(err){
      console.log(err)
      channel.nack(msg)
    }

  })
})()
