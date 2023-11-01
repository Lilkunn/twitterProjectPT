import User from '~/models/schemas/User.schema'
import databaseService from './database.services'
import { RegisterRequestBody } from '~/models/requests/User.request'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import { TokenType, UserVerifyStatus } from '~/constants/enums'
import { ObjectId } from 'mongodb'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { USERS_MESSAGES } from '~/constants/messages'

class UsersService {
  async register(payload: RegisterRequestBody) {
    const user_id = new ObjectId()
    const email_verify_token = await this.signEmailVerifyToken(user_id.toString())
    const result = await databaseService.user.insertOne(
      new User({
        ...payload,
        _id: user_id,
        email_verify_token,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    )

    // tu user_id tao AT vaf RT
    const [access_token, refresh_token] = await this.signAccessTKandRT(user_id.toString())
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        token: refresh_token,
        user_id: new ObjectId(user_id)
      })
    )
    // aws ses
    console.log(email_verify_token)

    return { access_token, refresh_token }
  }

  async checkEmailExist(email: string) {
    //vào database tìm xem có hông
    const user = await databaseService.user.findOne({ email })
    return Boolean(user) //có true, k false
  }
  private signAccessToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenType.AccessToken },
      options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
    })
  }
  private signRefreshToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenType.RefreshToken },
      options: { expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRE_IN },
      privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string
    })
  }
  // ham sighverify_email
  private signEmailVerifyToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenType.EmailVerificationToken },
      options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
    })
  }

  private signAccessTKandRT(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }

  async verifyEmail(user_id: string) {
    //token này chứa access_token và refresh_token

    databaseService.user.updateOne(
      { _id: new ObjectId(user_id) }, //tìm user thông qua _id
      [{ $set: { email_verify_token: '', updated_at: '$$NOW', verify: UserVerifyStatus.Verified } }]
      //set email_verify_token thành rỗng,và cập nhật ngày cập nhật, cập nhật status của verify
    )

    //destructuring token ra
    const [access_token, refresh_token] = await this.signAccessTKandRT(user_id)
    //lưu refresg_token vào database
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token })
    )
    //nếu họ verify thành công thì gữi họ access_token và refresh_token để họ đăng nhập luôn
    return {
      access_token,
      refresh_token
    }
  }

  async login(user_id: string) {
    //dung user_id de tao AT và RT
    const [access_token, refresh_token] = await this.signAccessTKandRT(user_id)
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        token: refresh_token,
        user_id: new ObjectId(user_id)
      })
    )
    //return AT và RT
    return { access_token, refresh_token }
  }
  async logout(refessh_token: string) {
    await databaseService.refreshTokens.deleteOne({ token: refessh_token })
    return {
      message: USERS_MESSAGES.LOGOUT_SUCCESS
    }
  }
}
const usersService = new UsersService()
export default usersService
