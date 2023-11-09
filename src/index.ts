import express, { Request, Response, NextFunction } from 'express'
import userRouter from './routes/users.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import mediasRouter from './routes/medias.routes'
import { initFolder } from './utils/file'
const app = express()
const PORT = process.env.PORT || 4000
// tạo folder uploads
initFolder()
app.use(express.json())
databaseService.conect()

app.get('/', (req, res) => {
  res.send('xin chao')
})

app.use('/users', userRouter)
//http://localhost:3000/users/tweets
app.use('/medias', mediasRouter) //route handler

// app sử dung 1 middleware 1 erorhandler tổng
app.use(defaultErrorHandler)

app.listen(PORT, () => {
  console.log(`Project twitter này đang chạy trên post ${PORT}`)
})
