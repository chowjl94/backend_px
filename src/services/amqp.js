require('dotenv').config()
const amqplib = require('amqplib')

const URL = process.env.CLOUDAMQP_URL || 'amqp://localhost:5672'



module.exports = () => {
  const service = {}

  service.publishAppendUser = async (message) => {
    const client = await amqplib.connect(URL)
    const channel = await client.createChannel()
    await channel.assertQueue(process.env.QUEUE)
    channel.sendToQueue(process.env.QUEUE, Buffer.from(JSON.stringify(message)),{
      contentType: 'application/json',
    })
    await channel.close()
    await client.close()
  }

  return service
}