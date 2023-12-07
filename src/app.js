import express, { json, urlencoded } from 'express'
import {apiRouter} from './router/apiRouter.js'
import {webRouter} from './router/webRouter.js'
import {engine} from 'express-handlebars'
import {Server} from 'socket.io'
import path from 'path'
import __dirname from './util.js'
import mongoose from 'mongoose'

//MongoDB
import {MONGODB_CNX_STR} from './config/mongodb.config.js'
const db = await mongoose.connect(MONGODB_CNX_STR)
console.log("Se conectó correctamente a la DB")

//Express
import {PORT} from './config/server.config.js'
const app = express()


//Middlewares 
app.use(urlencoded({ extended: true }))
app.use(json())
app.use('/static', express.static(path.join(__dirname, '../static')))
app.engine('handlebars', engine())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'handlebars')

const server = app.listen(PORT, ()=>{console.log(`Servidor escuchando en puerto ${PORT}`)})

const ioServer = new Server(server)
app.use((req,res,next) => {
  req['io'] = ioServer
  next()
})

//Rutas
app.use('/api', apiRouter)
app.use('/', webRouter)
