const express = require('express')

const Indivtask  = require('../models/model-indivtask')

module.exports = (db) => {
  const router = express.Router()
  function isInteger(n) { return /^\+?(0|[1-9]\d*)$/.test(n)}

  /**
   * @openapi
   * components:
   *  schemas:
   *    indivtask:
   *      type: object
   *      required:
   *        - task_title
   *      properties:
   *        task_title:
   *          type: string   
   *        updated_by:
   *          type: string
   *        updated_on:
   *          type: string
   *          format: date
   *        isFinished_on:
   *          type: boolean
   */



  /**
   * @openapi
   * components:
   *  schemas:
   *    Error:
   *      type: object
   *      required:
   *        - error
   *      properties:
   *        error: 
   *          type: string
   */


  /**
   * @openapi
   * /indivtask/:todo_id:
   *  post:
   *    tags:
   *    - Individual Task
   *    description: Adding a task title to a existing todo list
   *    parameters:
   *      - in: path
   *        name: todo_id
   *        schema:
   *          type: integer
   *        required: true
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/indivtask'
   *    responses:
   *      201:
   *        description: Created
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/indivtask'
   *      403:
   *        description: Neither Creator or Collaborator
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Error'
   *      400:
   *        description: "Enter Valid id Number or List of todos not found"
   *        content:
   *          application/json:
   *            schema:
   *              type: array
   *              items:
   *                $ref: '#/components/schemas/Error'
   * 
   *    security:
   *      - bearerAuth:
   *          type: http
   *          scheme: bearer
   *          bearerFormat: JWT 
   * 
   */
  
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



    /**
   * @openapi
   * /indivtask/:task_id:
   *  put:
   *    tags:
   *    - Individual Task
   *    description: update a task based on the specified task_id
   *                  user has to be creator role or collaborator role
   *    parameters:
   *      - in: path
   *        name: task_id
   *        schema:
   *          type: integer
   *        required: true
   *    responses:
   *      200:
   *        description: OK
   *        content:
   *          application/json:
   *            schema:
   *              type: array
   *              items:
   *                $ref: '#/components/schemas/indivtask'
   *      400:
   *        description: "Enter Valid id Number"
   *        content:
   *          application/json:
   *            schema:
   *              type: array
   *              items:
   *                $ref: '#/components/schemas/Error'
   *      403:
   *        description: "Neither Creator nor collaborator"
   *        content:
   *          application/json:
   *            schema:
   *              type: array
   *              items:
   *                $ref: '#/components/schemas/Error'
   * 
   * 
   *    security:
   *      - bearerAuth:
   *          type: http
   *          scheme: bearer
   *          bearerFormat: JWT 
   * 
   *         
   */


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


    /**
   * @openapi
   * /indivtask/:task_id:
   *  delete:
   *    tags:
   *    - Individual Task
   *    description:  SOFT delete a task based on the specified task_id
   *                  user has to be creator role or collaborator role
   *    parameters:
   *      - in: path
   *        name: task_id
   *        schema:
   *          type: integer
   *        required: true
   *    responses:
   *      200:
   *        description: OK
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/indivtask'
   *      403:
   *        description: Neither Creator or Collaborator
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Error'
   *      400:
   *        description: "Enter Valid id Number or List of todos not found"
   *        content:
   *          application/json:
   *            schema:
   *              type: array
   *              items:
   *                $ref: '#/components/schemas/Error'
   * 
   * 
   *    security:
   *      - bearerAuth:
   *          type: http
   *          scheme: bearer
   *          bearerFormat: JWT 
   * 
   */

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
      const updatedTask = await db.doSoftDelete(task_id)
      res.status(200).json(updatedTask)
    } 
  })

  return router
}
