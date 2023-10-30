import { TokenPayload } from './models/requests/User.request'
import User from './models/schemas/User.schema'
import { Request } from 'express'

// định nghĩa lại Request
// định nghĩa lại những thg trong modul
// lưu thêm 1 cái j đó và định nghĩa declare cho modul đó
declare module 'express' {
  interface Request {
    user?: User //thêm ? vì k phải request nào cũng có user
    decoded_authorization?: TokenPayload
    decoded_refresh_token?: TokenPayload
  }
}
