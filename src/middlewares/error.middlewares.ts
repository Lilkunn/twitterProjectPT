import { NextFunction, Request, Response } from 'express'
import { omit } from 'lodash'
import HTTP_STATUS from '~/constants/httpStatus'
// trong er thi có status va mesage
export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.log('lỗi nè ' + err.message)
  res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json(omit(err, ['status']))
}
