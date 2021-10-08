require('dotenv').config()
const Access = require('../models/model-access')



module.exports = (db) => {
    const service = {}

    service.addAccess = async (data) => {
      console.log("received Data",data)
      const user = await db.findUserByUsername(data.email)
      const todolist = await db.getTodoListById(data.todo_id)
      console.log(user)
      console.log(todolist.title)
      //user not in database
        if (!user){
          console.log('user is not registered, please register with us!')
        }
        else{
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
            
      //  access_right of user by checking access table
      //  if uid not in access table then add access
      //  if uid is in access table , check if its a read-only 

          }
        //   console.log(access_rights)
        //   const role =  access_rights.role
        //   console.log(access_rights)
        //   console.log(role)
        //   if (role ==='collaborator' || role=='creator'){
        //     console.log('This Already have access to this todo list')
        //   }else{
        //     const newAccessControl = new Access({ todo_id:access_rights.todo_id,todo_title: access_rights.todo_title,user_id:access_rights.user_id, nameof:name, role: 'collaborator' })
        //     await db.insertAccess(newAccessControl)
        //   }
  
          
    }
    return service
}
  
  
    
