require('dotenv').config()
const amqplib = require('amqplib')
const cron = require('node-cron')

const URL = process.env.CLOUDAMQP_URL || 'amqp://localhost:5672'

const QUEUE = 'email'
const TASK_QUEUE = 'TASK'

module.exports = () => {
  const service = {}

  service.publishAppendUser = async (message) => {
    const client = await amqplib.connect(URL)
    const channel = await client.createChannel()
    await channel.assertQueue(QUEUE)
    channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(message)),{
      contentType: 'application/json',
    })
  // // cron.schedule('*/2 * * * *',async ()=>{
  // //   const client = await amqplib.connect(URL)
  // //   const channel = await client.createChannel()
  // //   await channel.assertQueue(TASK_QUEUE)
  // //   const count = await updateService.updateCount()
  // //   channel.sendToQueue(TASK_QUEUE, Buffer.from(JSON.stringify(count)),{
  // //     contentType: 'application/json',
  // //   })
    
    
        
  //  })

    await channel.close()
    await client.close()
  }

  return service
}






