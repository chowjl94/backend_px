require('dotenv').config()
const bycrypt = require('bcrypt');

const AuthService = require('./auth');
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS)

const username = 'test@gmail.com'
const name = 'test'
const password = 'password1'

const Mockdb = () =>{

    const db = {}
    db.insertUser = jest.fn(user=>{
        return {user_id:1 ,...user}
    })

    db.findUserByUsername = jest.fn(async () =>{
        return { id:1, username:username ,name:name, password_hash: await bycrypt.hash(password,SALT_ROUNDS)}
    })

    return db
}

const db = Mockdb()
const authService = AuthService(db)



describe('Verification of token',()=>{
    describe('When a a user_id is received',()=>{
        it('should return the same user_id in user for a valid token',async()=>{
            const user = db.findUserByUsername()
            const token = authService.generateToken(user.user_id)
            const decodedtoken = authService.verifyToken(token)
            expect(decodedtoken).toEqual(user.user_id)
        })

        it('should returnn null if the token is invalid',async()=>{
            const decodedtoken = authService.verifyToken(123123)
            expect(decodedtoken).toBeNull()
        })
    })

})


describe('User Registration',()=>{
    describe('when a new user is registering',()=>{
        it('should return a valid token',async()=>{
            db.findUserByUsername.mockReturnValueOnce(null)
            const token = authService.registerUser(username,name,password)
            expect(token).toBeTruthy()
        })
    describe('when a registered user tries to register',()=>{
        it('should return null',async()=> {
            const token = await authService.registerUser(username,name,password)
            expect(token).toBeNull()
        })

    })
       
    })
})


describe('User Login',()=>{
    describe('given a registered  username and password',()=>{
        it('should return a valid signed token',async()=>{
            const token = await authService.loginUser(username,password)
            expect(token).toBeTruthy()
        })
    describe('given a user who is not yet registered',()=>{
        it('should reutrn null ',async()=>{
            db.findUserByUsername.mockReturnValueOnce(null)
            const token = await authService.loginUser(username,password)
            expect(token).toBeNull()
        })
    })

    describe('given a registered user who enters invalid password',()=>{
        it('should return null',async()=>{
            const token = await authService.loginUser(username,'wrong')
            expect(token).toBeNull()
        })
    })
      
    describe('given a registered user who enters invalid username',()=>{
        it('should return null',async()=>{
            db.findUserByUsername.mockReturnValueOnce(null)
            const token = await authService.loginUser('wrong',password)
            expect(token).toBeNull()
        })
    })

  })
})

