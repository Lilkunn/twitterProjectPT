import { Router } from 'express'
import { loginControllers, registerController } from '~/controllers/users.controllers'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'
const userRouter = Router()

userRouter.get('/login', loginValidator, loginControllers)

userRouter.post('/register', registerValidator, registerController)

export default userRouter
