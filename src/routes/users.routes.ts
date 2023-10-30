import { Router } from 'express'
import { loginController, logoutController, registerController } from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handlers'
const userRouter = Router()

userRouter.get('/login', loginValidator, wrapAsync(loginController))

userRouter.post('/register', registerValidator, wrapAsync(registerController))

/*
des: logout : dang xuat
path: /user/logout
method: POST
header: authorrization: 'Bearer: access_token'
body: (refessh_token: string)
*/

userRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapAsync(logoutController))
export default userRouter
