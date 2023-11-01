import { Router } from 'express'
import {
  emailVerifyController,
  forgotPasswordController,
  loginController,
  logoutController,
  registerController,
  resendEmailVerifyController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
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

/**
 * des: resend email_verify_token
 * khi email bị mất, hoặc hết hạn , thì người dùng sẽ muốn mình gửi lại email_verify_token
 *
 * method: post
 * path: resend-email-verify-token
 * header:{Authorization: "Bearer<access_token>"} đăng nhập đc mưới resend
 * body: {}
 */
userRouter.post('/resend-verify-email', accessTokenValidator, wrapAsync(resendEmailVerifyController))

/**
 * des : forgot password
 * khi người dùng quên mật khẩu thì họ cần mình gửi lại cho họ forgot_password
 *path: /forgot-password
  method: POST
  Header: không cần, vì  ngta quên mật khẩu rồi, thì sao mà đăng nhập để có authen đc
  body: {email: string}
 */
userRouter.post('/forgot-password', forgotPasswordValidator, wrapAsync(forgotPasswordController))
/*
des: Verify link in email to reset password
path: /verify-forgot-password
method: POST
Header: không cần, vì  ngta quên mật khẩu rồi, thì sao mà đăng nhập để có authen đc
body: {forgot_password_token: string}
*/
userRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapAsync(verifyForgotPasswordTokenController)
)
export default userRouter
