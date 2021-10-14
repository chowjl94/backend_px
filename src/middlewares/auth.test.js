const { getMockReq, getMockRes } = require('@jest-mock/express')
const { insertTodo } = require('../db')

const AuthMiddleware = require('./auth')
// mock a service functuon
const service={
    verifyToken: jest.fn()
}
const authMiddleware= AuthMiddleware(service)

describe('Auth Middleware',()=>{
    describe('Given a request header with a token',()=>{
        let req
        beforeEach(()=>{
            req = getMockReq({
                headers:{
                    authorization:"TOKEN"
                }
            })
        })
        it('should call next if valid',async ()=>{
            req = getMockReq({
                headers:{
                    authorization:"Bearer TOKEN"
                }
            })
            service.verifyToken.mockReturnValue(1)
            const { res, next } = getMockRes()
            authMiddleware(req, res, next)
            expect(next).toBeCalled()
        })
    
        it('should return error 401 if invalid',()=>{
            service.verifyToken.mockReturnValue(null)
            const {res,next}= getMockRes()
            authMiddleware(req,res,next);
            expect(next).not.toBeCalled()
            expect(res.status).toBeCalledWith(401)
        })
    })



    describe('Given a request header without a token',()=>{
        it('shoudl return error 401',()=>{
            service.verifyToken.mockReturnValue(null)
            const req = getMockReq()
            const {res,next}= getMockRes()
            authMiddleware(req,res,next);
            expect(next).not.toBeCalled()
            expect(res.status).toBeCalledWith(401)

        })
    })
})  

