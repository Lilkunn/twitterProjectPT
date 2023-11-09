import { Request, Response, NextFunction } from 'express'
import mediasService from '~/services/media.services'
import { handleUploadSingleImage } from '~/utils/file'

export const uploadSingleImageController = async (req: Request, res: Response, next: NextFunction) => {
  const file = await mediasService.handleUploadSingleImage(req)
  return res.json({
    result: file
  })
}
