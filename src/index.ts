import express from 'express'
import userRouter from './routes/users.routes'
import databaseService from './services/database.services'
const app = express()
const PORT = 3000

databaseService.conect()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('xin chao')
})

app.use('/users', userRouter)
//http://localhost:3000/users/tweets

app.listen(PORT, () => {
  console.log(`Project twitter này đang chạy trên post ${PORT}`)
})
