const express = require('express')
const Todo = require('../models/model-todo')
const Access = require('../models/model-access')




module.exports = (db,amqpService) => {
  const router = express.Router()
  function isInteger(n) { return /^\+?(0|[1-9]\d*)$/.test(n)}


  /**
   * @openapi
   * components:
   *  schemas:
   *    Todo:
   *      type: object
   *      required:
   *        - title
   *        - by
   *        - created_on
   *      properties:        
   *        title:
   *          type: string   
   *        by:
   *          type: string
   *        created_on:
   *          type: string
   *          format: date
   *        updated_by:
   *          type: string
   *        updated_on:
   *          type: string
   *          format: date
   *  securitySchemes:
   *    bearerAuth:
   *      type: http
   *      scheme: bearer
   *      bearerFormat: JWT 
   * 
   *security:
   *  - bearerAuth:[]
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
   * 
   * 
   */


  /**
   * @openapi
   * /todo:
   *  post:
   *    tags:
   *    - Todo
   *    description: Post a new todolist
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/Todo'
   *    responses:
   *      201:
   *        description: Created
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Todo'
   *    security:
   *      - bearerAuth:
   *          type: http
   *          scheme: bearer
   *          bearerFormat: JWT 
   */
  
  router.post('/', async (req, res, next) => {
    const uid = req.uid
    const { todo_id, title, by, created_on } = req.body
    const newTodoList = new Todo({ todo_id , title , uid:uid , by,created_on })
    const todolist = await db.insertTodo(newTodoList)
    const newAccessControl = new Access({ todo_id:todolist.todo_id,todo_title: title,user_id:uid, nameof:by, role: 'creator' })
    await db.insertAccess(newAccessControl)
    // console.log(todo_id,title,by,created_on)
    console.log(newAccessControl)
    console.log(todolist)
    
    console.log(uid)
    res.status(201).json(todolist)
  
  })
  
 

  /**
   * @openapi
   * /todo:
   *  get:
   *    tags:
   *    - Todo
   *    description: Get all todos by current user_id
   *    responses:
   *      200:
   *        description: OK
   *        content:
   *          application/json:
   *            schema:
   *              type: array
   *              items:
   *                $ref: '#/components/schemas/Todo'
   *      400:
   *        description: "this person has no list of todos"
   *        content:
   *          application/json:
   *            schema:
   *              type: array
   *              items:
   *                $ref: '#/components/schemas/Error'
   *    security:
   *      - bearerAuth:
   *          type: http
   *          scheme: bearer
   *          bearerFormat: JWT 
   *         
   */


  router.get('/', async (req, res, next) => {
    const uid = req.uid
    const todos = await db.findTodoByTodoidUserId(uid)
    if (todos){
      console.log(uid)
      console.log('===============')
      console.log('===============')
      res.status(200).json(todos)
      // res.send(peopleInTodos)
    }else{
      res.status(403).send('this person has no list of todos')
    }
  }
  )


  /**
   * @openapi
   * /todo/:todo_id:
   *  get:
   *    tags:
   *    - Todo
   *    description: get a todolist based on the specified todo_id
   *                  user has to be creator role or collaborator role
   *    parameters:
   *      - in: path
   *        name: todo_id
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
   *                $ref: '#/components/schemas/Todo'
   *      400:
   *        description: "Enter Valid id Number or List of todos not found"
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
  
   *    security:
   *      - bearerAuth:
   *          type: http
   *          scheme: bearer
   *          bearerFormat: JWT 
   *         
   */



  router.get('/:todo_id', async (req, res, next) => {
    const uid = req.uid
    const todo_id = req.params.todo_id
    if (!isInteger(todo_id)){
      res.status(400).json({error:'enter valid id number'})
    }
    const todos = await db.getTodoListByUidId(uid,todo_id)
    const acces_rights= await db.getAccessRights(uid,todo_id)
    const role = acces_rights[0].role
    if (role === null || role==='read-only'){
      res.status(403).json({error:`you are neither creator or collaboratro of todo list of id ${todo_id}`})
    } else {
      if(todos){
        res.json(todos)
      } else {
        res.status(400).json({error:`List of todo_id ${todo_id} not found`})
      }
    }
  })



  /**
   * @openapi
   * /todo/:todo_id:
   *  put:
   *    tags:
   *    - Todo
   *    description: update a todolist based on the specified todo_id
   *                  user has to be creator role or collaborator role
   *    parameters:
   *      - in: path
   *        name: todo_id
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
   *                $ref: '#/components/schemas/Todo'
   *      400:
   *        description: "Enter Valid id Number or List of todos not found"
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
   *    security:
   *      - bearerAuth:
   *          type: http
   *          scheme: bearer
   *          bearerFormat: JWT 
   * 
   *         
   */



  router.put('/:todo_id', async (req, res, next) => {
    const uid = req.uid
    const todo_id = req.params.todo_id
    if (!isInteger(todo_id)){
      res.status(400).json({error:'enter valid id number'})
    }
    const acces_rights= await db.getAccessRights(uid,todo_id)
    console.log(uid)
    console.log(acces_rights)
    if (acces_rights.length===0){ 
      res.status(403).json( {error:`you do have access to list ${todo_id}`})
      console.log(acces_rights)
    }else{
      const role = acces_rights[0].role
      if (role === null || role==='read-only'){
        res.status(403).json({error:`you are neither creator or collaboratro of todo list of id ${todo_id}`})
      } else {
        const { title,updated_by,updated_on } = req.body
        console.log(title, updated_by,updated_on)
        const updatedTodo = new Todo({ todo_id:todo_id,uid:uid, title,updated_by,updated_on })
        const todo = await db.updateTodo(todo_id, updatedTodo)
        res.status(200).json(todo)
      }
      
    }    
  })

  
  /**
   * @openapi
   * /todos/:todo_id:
   *  delete:
   *    tags:
   *    - Todo
   *    description:  SOFT delete a todolist based on the specified todo_id
   *                  user has to be creator role or collaborator role
   *    parameters:
   *      - in: path
   *        name: todo_id
   *        schema:
   *          type: integer
   *        required: true
   *    responses:
   *      200:
   *        description: OK
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Todo'
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
   *      404:
   *        description: todo_id of  list not found
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Error'
   *    security:
   *      - bearerAuth:
   *          type: http
   *          scheme: bearer
   *          bearerFormat: JWT 
   */

  router.delete('/:todo_id', async (req, res, next) => {
    const uid = req.uid
    const todo_id = req.params.todo_id
    if (!isInteger(todo_id)) {
      res.status(400).json({ error: 'the id of the list must be a number' })
      return
    }

    const acces_rights= await db.getAccessRights(uid,todo_id)

    
    if (acces_rights.length===0){ 
      res.status(403).json( {error:`you do have access to list ${todo_id}`})
    }else{
      const role =acces_rights[0].role

      if (role===null || role==='read-only'){
        res.status(403).json({error:`you are neither creator or collaborator list ${todo_id}`})
      }else{
        if (role ==='collaborator' || role=='creator'){
 
          const updatedTodos= await db.doSoftDelete(todo_id)
          console.log(updatedTodos.soft_delete)
          if(updatedTodos){
            const todos = await db.getTodoListByUidId(uid,todo_id)          
            res.status(200).json(todos)
          }else{
            res.status(404).json({error:`Item id ${todo_id} not found`})
          }
        }
      }
    }
    
  })

    /**
   * @openapi
   * /todos/share/:todo_id:
   *  post:
   *    tags:
   *    - Todo
   *    description:  Share todo list to another user
   *    parameters:
   *      - in: path
   *        name: todo_id
   *        schema:
   *          type: integer
   *        required: true
   *    responses:
   *      200:
   *        description: OK
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Todo'
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
   *      404:
   *        description: todo_id of  list not found
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Error'
   * 
   *    security:
   *      - bearerAuth:
   *          type: http
   *          scheme: bearer
   *          bearerFormat: JWT 
   */
  


  router.post('/share/:todo_id', async (req, res) => {
    const uid = req.uid
    const todo_id = req.params.todo_id
    console.log(todo_id)
    if (!isInteger(todo_id)) {
      res.status(400).json({ error: 'the id of the list must be a number' })
      return
    }
    const access_rights= await db.getAccessRights(uid,todo_id)
    console.log(access_rights)
    if (access_rights.length===0){ 
      res.status(403).json( {error:`you do have access to list ${todo_id}`})
    }else{
      const role =access_rights[0].role
      if (role ==='collaborator' || role=='creator'){
        const message = {
          email:req.body.email,
          name:req.body.name,
          todo_id:Number(todo_id),
          role:req.body.role
        }
        console.log('===============')
        console.log(message)
        await amqpService.publishAppendUser(message)
        res.status(202).json({status:'Message Published Success'})
      }
    }
    
  })
  

  return router
}


