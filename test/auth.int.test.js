const request = require('supertest');
const utils = require('./utils')

const app = utils.app
const db = utils.db

const name = "test";
const username = "test@test.com";
const password = "testword";

beforeAll(async () => {
  await utils.before();
});


afterAll(async () => {
  await utils.after();
});



describe("POST /register",()=>{
    beforeAll(async () =>{
        await db.clearUserstodo()
    })

    it('should return a token',async ()=>{
        return request(app)
        .post('/register')
        .send(username,name,password)
        .expect(200)
        .then((res)=>{
            expect(res.body.token).toBeTruthy()
        })
    })

    it('should return a error 400 if user is registered',async ()=>{
        return request(app)
        .post('/register')
        .send(username,name,password)
        .expect(400)
        .then((res)=>{
            expect(res.body.token).toBeFalsy()
        })
    })
})


describe("POST /login",()=>{
    beforeAll(async () =>{
        await db.clearUserstodo()
        await utils.registerUser(username, name, password);

    })

    it('should return a token if user is in db',async ()=>{
        return request(app)
        .post('/login')
        .send(username,password)
        .expect(200)
        .then((res)=>{
            expect(res.body.token).toBeTruthy()
        })
    })

    it('should return a error 400 is not in db',async ()=>{
        return request(app)
        .post('/login')
        .send(username,password)
        .expect(400)
        .then((res)=>{
            expect(res.body.token).toBeFalsy()
        })
    })
})