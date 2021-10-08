// require('dotenv').config()
// const amqplib = require('amqplib')
// const Access = require('../models/model-access')
// const URL = process.env.CLOUDAMQP_URL || 'amqp://localhost:5672'


// module.exports = (db) => {
//     const service = {}

//     service.consumeEmail = async () => {
//       const client = await amqplib.connect(URL)
//       const channel = await client.createChannel()
//       await channel.assertQueue(process.env.QUEUE)
//       channel.consume(process.env.QUEUE, async (msg)=>{
//         const data =JSON.parse(msg.content)
//         console.log(data)
//         const username = await db.findUserByUsername(data.email)
//         if (username.length===0){
//           console.log('user is not registered')
//         }else{
//           const access_rights =await db.findAccessRolebyTodoid(data.todo_id)
//           const role =  access_rights.role
//           if (role ==='collaborator' || role=='creator'){
//             console.log('Already have access to this todo list')
//           }else{
//             const newAccessControl = new Access({ todo_id:access_rights.todo_id,todo_title: access_rights.todo_title,user_id:access_rights.user_id, nameof:data.name, role: 'collaborator' })
//             await db.insertAccess(newAccessControl)
//           }
  
//         }
//         channel.ack(msg)
//       })
//       await channel.close()
//       await client.close()
//     }
//     return service
// }
  
  
    
