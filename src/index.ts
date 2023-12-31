import express, { Request, Response, NextFunction } from 'express'
import userRouter from './routes/users.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import mediasRouter from './routes/medias.routes'
import { initFolder } from './utils/file'
import { config } from 'dotenv'
config()
import argv from 'minimist'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from './constants/dir'
import staticRouter from './routes/static.routes'
import { MongoClient } from 'mongodb'

const options = argv(process.argv.splice(2))

const app = express()
const PORT = process.env.PORT || 4000
// tạo folder uploads
initFolder()
app.use(express.json())
databaseService.conect().then(() => {
  databaseService.indexUser()
})

app.get('/', (req, res) => {
  res.send('xin chao')
})

app.use('/users', userRouter)
//http://localhost:3000/users/tweets
app.use('/medias', mediasRouter) //route handler
app.use('/static', staticRouter)
// app.use('/static/video', express.static(UPLOAD_VIDEO_DIR))
// app sử dung 1 middleware 1 erorhandler tổng

app.use(defaultErrorHandler)

app.listen(PORT, () => {
  console.log(`Project twitter này đang chạy trên post ${PORT}`)
})
