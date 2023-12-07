import { Router } from 'express'
import multerMiddleware from '../middleware/multer.js'
const upload = multerMiddleware('images', 'product')
import {productManager} from '../dao/services/productManager.mongoose.js'
import {cartManager} from '../dao/services/cartManager.mongoose.js'

export const webRouter = Router()

//Endpoint para subir imágenes
webRouter.post('/uploads', upload.single('image'), async (req, res) =>{
   try {
        const {code} = req.body 
        const {filename} = req.file
        const product = await productManager.addImageToProduct(code, filename)
        return res.status(200).json({status: "Success", payload: product})
   } catch (error) {
        res.status(500).json({status: "Error", error: error.message})
   }
})

//Enpoint para mostrar productos

webRouter.get('/products', async(req,res)=> {
     try {
          //Limit fijo para probar paginación
          req.query.limit = 1
          const products = await productManager.getProducts(req.query)
          console.log(products)
          return res.render('products', {title:"Nuestros productos", products})
     } catch (error) {
          res.status(500).json({status: "Error", error: error.message})
     }

})

//Detalle del producto
webRouter.get('/products/:pid', async(req,res)=> {
     try {
          const {pid} = req.params
          const product = await productManager.getProductById(pid)
          console.log(product)
          return res.render('product', {title: `${product.title}`, product})
     } catch (error) {
          res.status(500).json({status: "Error", error: error.message})
     }

})

//Detalle del carrito
webRouter.get('/carts/:cid', async(req,res)=> {
     try {
          const {cid} = req.params
          const products = await cartManager.getCartById(cid)
          console.log(products)
          return res.render('cart', {title: "Tu carrito", products: products})
     } catch (error) {
          res.status(500).json({status: "Error", error: error.message})
     }

})

//Chat
// webRouter.get('/chat', async (req, res) =>{
//      try {
//        const ioServer = req.io
       
//        ioServer.on('connection', async (socket)=>{
//           let messages = await dbChat.find().lean()
//           console.log("Cliente conectado")
//           socket.emit('mensajes', messages)

//           socket.broadcast.emit('nuevoUsuario',
//                socket.handshake.auth.username
//           )

//           socket.on('mensaje', async message =>{
//                console.log("llega esto", message)
//                message._id = randomUUID()
//                const msg = await dbChat.create(message)
//                messages = await dbChat.find().lean()
//                ioServer.sockets.emit('mensajes',messages)
//           })

//           socket.on('disconnecting', reason => {
//                socket.broadcast.emit('usuarioDesconectado',
//                  socket.handshake.auth.username)
//           })
//        })
//        return res.render('chat', {title:"Chat"})
//      } catch (error) {
//           res.status(500).json({status: "Error", error: error.message})
//      }
//   })

