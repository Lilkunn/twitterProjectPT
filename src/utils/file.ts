import { Request } from 'express'
import formidable, { File } from 'formidable'

import fs from 'fs' //thư viện giúp handle các đường dẫn
import path from 'path'
export const initFolder = () => {
  //nếu không có đường dẫn 'TwitterProject/uploads' thì tạo ra
  const uploadsFolderPath = path.resolve('uploads')
  if (!fs.existsSync(uploadsFolderPath)) {
    fs.mkdirSync(uploadsFolderPath, {
      recursive: true //cho phép tạo folder nested vào nhau
      //uploads/image/bla bla bla
    }) //mkdirSync: giúp tạo thư mục
  }
}
export const handleUploadSingleImage = async (req: Request): Promise<File> => {
  const form = formidable({
    uploadDir: path.resolve('uploads'),
    maxFiles: 1,
    keepExtensions: true,
    maxFileSize: 300 * 1024,

    filter: function ({ name, originalFilename, mimetype }) {
      console.log(name, originalFilename, mimetype) //log để xem, nhớ comment

      const valid = name === 'image' && Boolean(mimetype?.includes('image/'))
      //mimetype? nếu là string thì check, k thì thôi
      //ép Boolean luôn, nếu k thì valid sẽ là boolean | undefined

      //nếu sai valid thì dùng form.emit để gữi lỗi
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
        //as any vì bug này formidable chưa fix, khi nào hết thì bỏ as any
      }
      //nếu đúng thì return valid
      return valid
    }
  })
  //form.parse về thành promise
  //files là object có dạng giống hình test code cuối cùng
  return new Promise<File>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err) //để ý dòng này
      if (!files.image) {
        return reject(new Error('Image is empty'))
      }
      resolve((files.image as File[])[0])
    })
  })
}