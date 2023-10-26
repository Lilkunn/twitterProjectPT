import { NextFunction, Request, Response } from 'express'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import usersService from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterRequestBody } from '~/models/requests/User.request'

export const loginController = async (req: Request, res: Response) => {
  const { user }: any = req // lấy user từ req
  const user_id = user._id // lấy _id từ user
  const result = await usersService.login(user_id.toString())
  //login nhận vào user_id:string, nhưng user_id ta có
  //là objectid trên mongodb, nên phải toString()
  //trả ra kết quả, thiếu cái này là sending hoài luôn
  return res.json({
    message: 'Login success',
    result: result
  })
}

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await usersService.register(req.body)

  return res.status(201).json({
    message: 'Register success', //chỉnh lại thông báo
    result
  })
}
