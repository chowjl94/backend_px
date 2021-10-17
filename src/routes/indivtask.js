const express = require('express')

const Indivtask  = require('../models/model-indivtask')

module.exports = (db) => {
  const router = express.Router()
  function isInteger(n) { return /^\+?(0|[1-9]\d*)$/.test(n)}

  
  router.post('/:todo_id', async (req, res, next) => {
    const uid = req.uid
    const todo_id = req.params.todo_id
    console.log(uid)
    console.log(todo_id)
    if (!isInteger(todo_id)){
      res.status(400).json({error:'enter valid id number'})
    }
    const acces_rights= await db.getAccessRights(uid,todo_id)
    const role = acces_rights[0].role
    if (role === null || role==='read-only'){
      res.status(403).json({error:`you are neither creator or collaboratro of todo list of id ${todo_id}`})
    }else{
      const todos = await db.findTodoByTodoidUserId(uid)
      const {task_title,updated_on} = req.body
      const newIndivTask = new Indivtask({todo_id:todo_id,task_title,updated_by:todos[0].by,updated_on})
      const newTask = await db.insertIndivtask(newIndivTask)

      console.log(todos)
      console.log(newTask)
      res.status(201).json(newTask)
    }
  })




  router.put('/:task_id', async (req, res, next) => {
    const uid = req.uid
    console.log(uid)
    const task_id = req.params.task_id
    const task= await db.getTodoIdFromTask(task_id)
    console.log(task)
    const todo_id = task.todo_id
    const acces_rights= await db.getAccessRights(uid,todo_id)
    const role = acces_rights[0].role
    
    console.log(task_id)
    if (!isInteger(task_id)){
      res.status(400).json({error:'enter valid id number'})
    }
    if (role === null || role==='read-only'){
      res.status(403).json({error:`you are neither creator or collaboratro of todo list of id ${todo_id}`})
    }else{
      const {task_title,updated_by,updated_on,isFinished}=req.body
      const updatedTask = new Indivtask({todo_id:todo_id,task_title,updated_by,updated_on,isFinished})
      // new Indivtask({todo_id:todo_id,task_title,updated_by:todos[0].by,updated_on})
      const task = await db.updateTaskofTaskId(updatedTask,task_id)
      res.status(200).json(task)
    } 
  })


  router.delete('/:task_id', async (req, res, next) => {
    const uid = req.uid
    console.log(uid)
    const task_id = req.params.task_id
    const task= await db.getTodoIdFromTask(task_id)
    console.log(task)
    const todo_id = task.todo_id
    const acces_rights= await db.getAccessRights(uid,todo_id)
    const role = acces_rights[0].role
    console.log(task_id)


    if (!isInteger(task_id)){
      res.status(400).json({error:'enter valid id number'})
    }
    if (role === null || role==='read-only'){
      res.status(403).json({error:`you are neither creator or collaboratro of todo list of id ${todo_id}`})
    }else{
      const updatedTask = await db.doSoftDeleteTask(task_id)
      res.status(200).json(updatedTask)
    } 
  })

  return router
}
