import express, { Request, Response, NextFunction } from 'express'
import userRouter from './routes/users.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
const app = express()
const PORT = 4000

databaseService.conect()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('xin chao')
})

app.use('/users', userRouter)
//http://localhost:3000/users/tweets

// app sử dung 1 middleware 1 erorhandler tổng
app.use(defaultErrorHandler)

app.listen(PORT, () => {
  console.log(`Project twitter này đang chạy trên post ${PORT}`)
})
