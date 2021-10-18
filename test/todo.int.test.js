const { token } = require('morgan');
const request = require('supertest');
const utils = require('./utils')

const app = utils.app
const db = utils.db

const name = "test";
const username = "test@test.com";
const password = "testword";
let token


beforeAll(async () => {
  await utils.before();
  token = await utils.reigsiterUser(username,name,password)
});


afterAll(async () => {
  await utils.after();
});


describe('POST/todo',()=>{
  beforeAll(async () =>{
    await db.clearTodo()
  })
  let todo_id =''
  const todo = {todo_id:1,
                title:'test',
                uid:1,
                by:'tester',
                created_on:'2021-09-20T16:00:00.000Z'}

  const updatedtodo = {
                title:'updated',
                updated_by:'tester',
                updated_on:'2021-09-21T16:00:00.000Z',
                }
   it('should return 201 status', async ()=>{
     return await request(app)
     .post('/todo')
     .set("Authorisation",`Bearer ${token}`)
     .send(todo)
     .expect(201)
     .then((res)=>{
       expect(res.body).toMatch(todo)
       todo_id = res.body.todo_id
     })  
   })
   
   it('shoud return a single todo of todo_id',async ()=>{
     return await request(app)
     .get(`/todo/${todo_id}`)
     .set("Authorisation",token)
     .expect(200)
     .then((res)=>{
       expect(res.body).toMatchObject({
         ...todo,
         updated_by:'',
         updated_on:'',
         soft_delete:false
       }
       )
     })
   })

   it('should return a newly updated todo of todo_id', async ()=>{
     return await request(app)
     .put(`/todo/${todo_id}`)
     .set("Authorisation",token)
     .send(updatedtodo)
     .then((res)=>{
       expect(res.body).toMatchObject({
         ...updatedtodo,
         todo_id:todo.todo_id,
         uid:todo.uid,
         by:todo.by,
         created_on:todo.created_on,
         soft_delete:false
       })

     })
   })
  })



describe('GET/todo',()=>{
  beforeAll(async () =>{
    await db.clearTodo()
  })

  describe('there is not todo list yet',()=>{
    it('should return [] if no todo in db',async ()=>{
      return await request(app)
      .post('/todo')
      .set("Authorisation",token)
      .expect(200)
      .then((res)=>{
        expect(res.body).toEqual([])
      })
    })
  })

  describe('there are some todos posted',()=>{
    beforeAll(async ()=>{
      const todos = [
        {   
          "title":"test1",
          "by":"tester1",
          "created_on":"20/9/2021"
        },
        {
          "title":"test2",
          "by":"tester2",
          "created_on":"20/9/2021"
        },
      ];
      await db.clearTodo()
      for (const todo in todos){
        return await request(app)
        .post('/todo')
        .set("Authorisation",token)
        .send(todos[todo])
      }

    })
    

    it('should return items in the todo table',async ()=>{
      return await request(app)
      .get('/todo')
      .set("Authorisation",token)
      .expect(200)
      .then((res)=>{
        expect(res.body.length).toEqual(2)
        res.body.map((todo)=>{
          expect(todo).objectContaining(
            {
              title:todo.title,
              by:todo.by,
              created_on:todo.created_on,
              updated_by:'',
              updated_on:'',
              soft_delete:false
            })
        })
      })

    })

  })




})


describe('/DELETE/todo',()=>{
  beforeAll(async () =>{
    await db.clearTodo()
    let todo_id
    const todo = {todo_id:1,
      title:'test',
      uid:1,
      by:'tester',
      created_on:'2021-09-20T16:00:00.000Z'}

      return await request(app)
      .post('/todo')
      .set("Authorisation",token)
      .send(todo)
      .expect(201)
      .then((res)=>{
           todo_id = res.body.todo_id
      })  
    
  })


  it('should return 200 status',()=>{

    return request(app)
    .delete(`/todo/${todo_id}`)
    .set("Authorisation",token)
    .send(todo)
    .expect(200)
    })    
})
  
