require('dotenv').config()
const Access = require('../models/model-access')
const Error = require('../models/model-error')



module.exports = (db) => {
    const service = {}

    service.addAccess = async (data) => {
      console.log("received Data",data)
      const user = await db.findUserByUsername(data.username)
      const todolist = await db.getTodoListById(data.todo_id)
      console.log(user)
      console.log(todolist.title)
      //user in database
      try{
        const access = await db.findAccessRolebyUid(user.user_id)
        console.log(access)
        if (access===null){
          const newAccess = new Access(
            { todo_id:data.todo_id,
              todo_title:todolist.title,
              user_id:user.user_id,
              nameof:data.name,
              role: data.role })
    
          await db.insertAccess(newAccess)
          console.log('inserted ',data.name,' as collaborator')
        }else{
          console.log('user you are trying to add already has access')
        }
      }
      catch(error){   
             
        return new Error(error, 'user is not registered, please register with us!')

      } 
          
    }
    return service
}
  
  
    



// if (!user){
//   console.log('user is not registered, please register with us!')
// }
// else{
//     const access = await db.findAccessRolebyUid(user.user_id)
//     console.log(access)
//     if (access===null){
//       const newAccess = new Access(
//         { todo_id:data.todo_id,
//           todo_title:todolist.title,
//           user_id:user.user_id,
//           nameof:data.name,
//           role: data.role })

//       await db.insertAccess(newAccess)
//       console.log('inserted ',data.name,' as collaborator')
//     }else{
//       console.log('user you are trying to add already has access')
//     }
    
//  }