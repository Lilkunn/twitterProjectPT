import { NextFunction, Request, Response } from 'express'
import { omit } from 'lodash'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'
// trong er thi có status va mesage
// noi tap ket loi tu moi noi do ve
export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ErrorWithStatus) {
    return res.status(err.status).json(omit(err, ['status']))
  }
  // neeus err chay xuonsg day thi sex laf loi mac dinh
  //err(message, stack, name)

  // mảng những thuộc tính của err

  Object.getOwnPropertyNames(err).forEach((key) => {
    Object.defineProperty(err, key, { enumerable: true })

    // ném lỗi cho người dùng
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: err.mesage,
      errorInfor: omit(err, ['stack'])
    })
  })
}
