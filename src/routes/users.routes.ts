import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.controllers'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handlers'
const userRouter = Router()

userRouter.get('/login', loginValidator, loginController)

userRouter.post('/register', registerValidator, wrapAsync(registerController))

export default userRouter
