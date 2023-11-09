import { Router } from 'express'
import { serveImageController, serveVideoController } from '~/controllers/medias.controllers'

const staticRouter = Router()

staticRouter.get('/image/:namefile  ', serveImageController)
staticRouter.get('/video/:namefile', serveVideoController)
export default staticRouter
