import { Router } from 'express'
import {productRouter} from './productRouter.js'
import {cartRouter} from './cartRouter.js'

export const apiRouter = Router()

apiRouter.use('/products', productRouter)

apiRouter.use('/carts', cartRouter)