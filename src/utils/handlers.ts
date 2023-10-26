import { RequestHandler } from 'express'

export const wrapAsync = (func: RequestHandler) => async (req: any, res: any, next: any) => {
  try {
    await func(req, res, next)
  } catch (error) {
    next(error)
  }
}
