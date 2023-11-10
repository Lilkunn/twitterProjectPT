import { ObjectId } from 'mongodb'

interface RefreshTokenType {
  _id?: ObjectId
  token: string
  created_at?: Date
  user_id: ObjectId
  iat: number //thêm
  exp: number //thêm
}
//cứ cho người dùng truyền number

export default class RefreshToken {
  _id?: ObjectId
  token: string
  created_at: Date
  user_id: ObjectId
  iat: Date //thêm
  exp: Date //thêm
  //khi tạo mình sẽ convert từ number sang date
  constructor({ _id, token, created_at, user_id, iat, exp }: RefreshTokenType) {
    this._id = _id
    this.token = token
    this.created_at = created_at || new Date()
    this.user_id = user_id
    this.iat = new Date(iat * 1000) //convert từ Epoch time sang Date
    this.exp = new Date(exp * 1000) //convert từ Epoch time sang Date
  }
}
