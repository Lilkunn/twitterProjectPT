import { Router } from 'express'
import {
  emailVerifyController,
  forgotPasswordController,
  getMeController,
  getProfileController,
  loginController,
  logoutController,
  registerController,
  resendEmailVerifyController,
  resetPasswordController,
  updateMeController,
  verifyForgotPasswordTokenController
} from '~/controllers/users.controllers'
import { filterMiddleware } from '~/middlewares/common.middleware'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  updateMeValidator,
  verifiedUserValidator,
  verifyForgotPasswordTokenValidator
} from '~/middlewares/users.middlewares'
import { UpdateMeReqBody } from '~/models/requests/User.request'
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
/*
des: reset password
path: '/reset-password'
method: POST
Header: không cần, vì  ngta quên mật khẩu rồi, thì sao mà đăng nhập để có authen đc
body: {forgot_password_token: string, password: string, confirm_password: string}
*/
userRouter.post(
  '/reset-password',
  resetPasswordValidator,
  verifyForgotPasswordTokenValidator,
  wrapAsync(resetPasswordController)
)

/*
des: get profile của user
path: '/me'
method: get
Header: {Authorization: Bearer <access_token>}
body: {}
*/
userRouter.get('/me', accessTokenValidator, wrapAsync(getMeController))
userRouter.patch(
  '/me',
  accessTokenValidator,
  verifiedUserValidator,
  filterMiddleware<UpdateMeReqBody>([
    'name',
    'date_of_birth',
    'bio',
    'location',
    'website',
    'avatar',
    'username',
    'cover_photo'
  ]),
  updateMeValidator,
  wrapAsync(updateMeController)
)

/*
des: get profile của user khác bằng unsername
path: '/:username'
method: get
không cần header vì, chưa đăng nhập cũng có thể xem
*/
userRouter.get('/:username', wrapAsync(getProfileController))
export default userRouter
