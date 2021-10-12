const amqplib = require('amqplib')
const cron = require('node-cron')

const express = require('express')

const queue = 'heartbeat'


//async function IIF
;(async () => {
  const client = await amqplib.connect('amqp://localhost:5672')
  const channel = await client.createChannel()


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

