const amqplib = require('amqplib')
const cron = require('node-cron')

const express = require('express')



//define a name for a queue
const queue = 'heartbeat'


//async function IIF
;(async () => {
  const client = await amqplib.connect('amqp://localhost:5672')

  // get client and create chanel, a way for communication with rabbit mq
  const channel = await client.createChannel()

  // choose the named queue and assign it to the channel
  await channel.assertQueue(queue)

  setInterval(()=>{
    const message = `I'm alive at ${new Date()}`
    channel.sendToQueue(queue,Buffer.from(JSON.stringify(message)),{
      contentType: 'application/json'
    })
  },60000)

  cron.schedule('42 * * * *',()=>{
    const message ='42 is the meaning to life!'
    channel.sendToQueue(queue,Buffer.from(JSON.stringify(message)),{
      contentType:'application/json'
    })
  })


})()


