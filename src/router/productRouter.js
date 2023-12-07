import { Router } from 'express'
import {productManager} from '../dao/services/productManager.mongoose.js'


export const productRouter = Router()

//Obtener productos
productRouter.get('/',  async (req,res)=>{
    const products =  await productManager.getProducts(req.query)
    if (products.length === 0) {
        return res.status(404).json({status: "Error", error: "No existen productos."})
    }
    return res.status(200).json({status: "Success", payload: products})
})

//Obtener producto
productRouter.get('/:id',  async (req,res)=>{
    try {
        const id = req.params.id
        const product = await productManager.getProductById(id)
        return res.status(200).json({status: "Success", payload: product})
    } catch (error) {
        console.log(error)
        res.status(404).json({status: "Error", error: error.message})
    }
})

//Crear producto
productRouter.post('/',  async (req,res)=>{
    try {
        const {body} = req
        const product = await productManager.addProduct(body)
        return res.status(200).json({status: "Success", payload: product})
    } catch (error) {
        res.status(500).json({status: "Error", error: error.message})
    }
})

//Modificar producto
productRouter.put('/:pid',  async (req, res)=>{
    try {
        const {pid} = req.params
        const {body} = req
        const product = await productManager.updateProduct(pid, body)
        return res.status(200).json({status: "Success", payload: product})
    } catch (error) {
        res.status(500).json({status: "Error", error: error.message})
    }
})

//Eliminar producto
productRouter.delete('/:pid',  async (req, res)=>{
    try {
        const {pid} = req.params
        const product = await productManager.deleteProduct(pid)
        return res.status(200).json({status: "Success", payload: product})
    } catch (error) {
        res.status(500).json({status: "Error", error: error.message})
    }
})
