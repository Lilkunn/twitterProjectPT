import { Request, Response, NextFunction } from 'express'
import path from 'path'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_TEMP_DIR } from '~/constants/dir'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import mediasService from '~/services/media.services'
import fs from 'fs'

import mime from 'mime'

export const uploadImageController = async (req: Request, res: Response, next: NextFunction) => {
  const url = await mediasService.uploadImage(req)
  return res.json({
    message: USERS_MESSAGES.UPLOAD_SUCCESS,
    result: url
  })
}
export const uploadVideoController = async (req: Request, res: Response, next: NextFunction) => {
  const url = await mediasService.uploadVideo(req) //uploadVideo chưa làm
  return res.json({
    message: USERS_MESSAGES.UPLOAD_SUCCESS,
    result: url
  })
}

//khỏi async vì có đợi gì đâu
export const serveImageController = (req: Request, res: Response, next: NextFunction) => {
  const { namefile } = req.params //lấy namefile từ param string
  return res.sendFile(path.resolve(UPLOAD_IMAGE_DIR, namefile), (error) => {
    console.log(error)
    if (error) {
      return res.json((error as any).status).send('File not found')
    }
  })
}
//khỏi async vì có đợi gì đâu
export const serveVideoStreamController = (req: Request, res: Response, next: NextFunction) => {
  const { namefile } = req.params //lấy namefile từ param string
  const range = req.headers.range //lấy range từ header string
  console.log(range)
  // lấy đường dẫn tới video đó
  const videoPath = path.resolve(UPLOAD_IMAGE_DIR, namefile)
  if (!range) {
    return res.json(HTTP_STATUS.BAD_REQUEST).send('Requires Range header')
  }
  // tổng dung lượng của video
  const videoSize = fs.statSync(videoPath).size

  const chunkSize = 10 ** 6
  const start = Number(range.replace(/\D/g, ''))
  console.log('start: ', start)
  const end = Math.min(start + chunkSize, videoSize - 1)

  const contentLength = end - start + 1
  const contentType = mime.getType(videoPath) || 'video/*' //lấy kiểu file, nếu k đc thì mặc định là video/*
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`, //end-1 vì nó tính từ 0
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': contentType
  }
  res.writeHead(HTTP_STATUS.PARTIAL_CONTENT, headers) //trả về phần nội dung
  //khai báo trong httpStatus.ts PARTIAL_CONTENT = 206: nội dung bị chia cắt nhiều đoạn
  const videoStreams = fs.createReadStream(videoPath, { start, end }) //đọc file từ start đến end
  videoStreams.pipe(res)
  //pipe: đọc file từ start đến end, sau đó ghi vào res để gữi cho client
}
