import { Router } from 'express'
import {
  emailVerifyController,
  loginController,
  logoutController,
  registerController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
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

/**
 * des: verify email token
 * khi người dùng dki họ sẽ nhân đc email
 * khi nhấp vào link đó thì sẽ tạo ra 1 req gửi lên email_verify_token lên server
 * thì decoded_email_verify_token sẽ lấy ra user_id
 * và vào user_id để update email_vèuy_token thành '', verify : 1 ,uadate_at
 * parth: /user/verify-email
 * method: post
 *body: {email_verify_token : string}
 */
userRouter.post('/verify-email', emailVerifyTokenValidator, wrapAsync(emailVerifyController))
export default userRouter
