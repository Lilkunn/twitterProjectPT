// định nghĩa nhưng request body , param , query

import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/constants/enums'

export interface RegisterRequestBody {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth: string
}

//định nghĩa req cho thằng logoutController
export interface LogoutReqBody {
  refresh_token: string
}

// 1 payload có user_id và tokenType

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
}
