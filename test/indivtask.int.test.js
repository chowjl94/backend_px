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
  token = await utils.registerUser(username,name,password)
});


afterAll(async () => {
  await utils.after();
});


describe('POST /indivtask', () => {
  let todo_id
  const todo = {
      title: 'todo_testt',
  }

  beforeAll(async () => {
      await db.clearIndivtask()
      await db.clearTodo()

      return await request(app)
          .post('/indivtask')
          .set('Authorization', token)
          .send(todo)
          .then(res => {
              todo_id = res.body.todo_id
          })
  })

  afterAll(async () => {
    await db.clearIndivtask()
    await db.clearTodo()
  })

  describe('task generate', () => {
      let task_id
      const indivtask = {
          task_title: 'test task description',
      }

      it('should return 201', async () => {
          return await request(app)
              .post('/task')
              .set('Authorization', token)
              .query({ todo: 1 })
              .send(indivtask)
              .expect(201)
              .then(res => {
                  task_id = res.body.task_id
                  expect(res.body).toMatchObject(indivtask)
              })
      })
  })
})

describe('PUT /indivtask', () => {
  let todo_id
  const todo = {
      title: 'todo_testt',
  }

  beforeAll(async () => {
    await db.clearIndivtask()
    await db.clearTodo()

      return await request(app)
          .post('/todo')
          .set('Authorization', token)
          .send(todo)
          .then(res => {
              todo_id = res.body.todo_id
          })
  })

  afterAll(async () => {
    await db.clearIndivtask()
    await db.clearTodo()
  })

  describe('Task Updating', () => {
      let task_id
      const indivtask = {
        task_title: 'test task description',
      }
      const indivtask2 = {
        task_title: 'test task description2',
        isFinished: true
      }

      beforeAll(async () => {
          return await request(app)
              .post('/indivtask')
              .set('Authorization', token)
              .query({ list: 1 })
              .send(indivtask)
              .expect(201)
              .then(res => {
                  task_id = res.body.task_id
              })
      })


      it('should return 200', async () => {
          return request(app)
              .put(`/indivtask`)
              .set('Authorization', token)
              .query({ todo: 1, indivtask: 1 })
              .send(indivtask2)
              .expect(200)
              .then((res) => {
                  expect(res.body).toMatchObject({
                      isFinished: indivtask2.completed,
                      task_title: indivtask2.task_title,
                      task_id: task_id,
                      todo_id: 1,
                  })
              })
      })
  })
})

describe('DELETE /indivtask', () => {
  let todo_id
  const todo = {
      title: 'todo_testt',
  }

  beforeAll(async () => {
    await db.clearIndivtask()
    await db.clearTodo()

      return await request(app)
          .post('/todo')
          .set('Authorization', token)
          .send(todo)
          .then(res => {
              todo_id = res.body.todo_id
          })
  })

  afterAll(async () => {
    await db.clearIndivtask()
    await db.clearTodo()
  })

  describe('delete a task', () => {
      let task_id
      const indivtask = {
          description: 'test_description',
      }

      beforeAll(async () => {
          return await request(app)
              .post('/indivtask')
              .set('Authorization', token)
              .query({ todo: 1 })
              .send(indivtask)
              .expect(201)
              .then(res => {
                  task_id = res.body.task_id
              })
      })

      it('should return 201', async () => {
          return await request(app)
              .delete('/indivtask')
              .set('Authorization', token)
              .query({ todo: 1, indivtask: 1 })
              .expect(201)
      })
  })
})