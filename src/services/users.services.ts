import User from '~/models/schemas/User.schema'
import databaseService from './database.services'
import { RegisterRequestBody } from '~/models/requests/User.request'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import { TokenType } from '~/constants/enums'
import { ObjectId } from 'mongodb'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { USERS_MESSAGES } from '~/constants/messages'

class UsersService {
  async register(payload: RegisterRequestBody) {
    const result = await databaseService.user.insertOne(
      new User({
        ...payload,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    )
    // lay userid tu account vua tao
    const user_Id = result.insertedId.toString()
    // tu user_id tao AT vaf RT
    const [access_token, refresh_token] = await this.signAccessTKandRT(user_Id)
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        token: refresh_token,
        user_id: new ObjectId(user_Id)
      })
    )

    return { access_token, refresh_token }
  }

  async checkEmailExist(email: string) {
    //vào database tìm xem có hông
    const user = await databaseService.user.findOne({ email })
    return Boolean(user) //có true, k false
  }
  private signAccessToken(user_Id: string) {
    return signToken({
      payload: { user_Id, token_type: TokenType.AccessToken },
      options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN }
    })
  }
  private signRefreshToken(user_Id: string) {
    return signToken({
      payload: { user_Id, token_type: TokenType.RefreshToken },
      options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN }
    })
  }
  private signAccessTKandRT(user_Id: string) {
    return Promise.all([this.signAccessToken(user_Id), this.signRefreshToken(user_Id)])
  }
  async login(user_Id: string) {
    //dung user_id de tao AT và RT
    const [access_token, refresh_token] = await this.signAccessTKandRT(user_Id)
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        token: refresh_token,
        user_id: new ObjectId(user_Id)
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
