import fs from 'fs/promises'
import Cart from '../models/cart.js'

export default class CartManager{
    static carttId = 1

    constructor(path){
        this.path = path
    }

    //Métodos

    /**
    * Genera un id autoincrementable 
    * @returns {number} - Id nuevo
    */
    async addIncrementId(){
        try {
            //Buscamos el id del último elemento en el array para incrementar
            const carts = JSON.parse(await fs.readFile(this.path, 'utf-8'))
            const id = carts[carts.length - 1].id + 1
            return id
        } catch (error) {       
            //Si no hay productos retornamos un id inicial     
            return CartManager.carttId++
        }
    }

      /**
     * Devuelve los carritos existentes
     * @returns {Array} - arreglo de productos
     */
      async #getCarts(){
        try {
            //Si el limit es = 0 devolvemos todos los productos sino la cantidad pedida
            const carts = JSON.parse(await fs.readFile(this.path, 'utf-8'))
            return carts
        } catch (e) {
            console.log(e.message)
            //Si no hay producto retornamos array vacío
            return []
        }
    }

    /**
    * Crea un producto
    * @param {Object} a - un producto
    * @throws {Error} - si el code se repite o falta alguna propiedad
    */
    async addProductToCart(cid, pid){

        //Traemos todos los carritos
        const carts = await this.#getCarts()

        //Buscamos el carrito en particular
        const cart = carts.find(cart => cart.id === Number(cid))
        if (!cart){
            throw new Error("El carrito no existe")
        }
        
        //Buscamos el producto en el carrito
        const {products} = cart
        const product = products.find(item => item.product === Number(pid))

        //Si no existe lo agregamos al array y si existe modificamos cantidad
        if (!product) {
            products.push({
                product: Number(pid),
                quantity: 1
            })
        } else {
            product.quantity += 1
        }
        
        cart.products = products

        //Buscamos le posición de carrito en el array
        const index = carts.findIndex(cart => cart.id === Number(cid))

        //Devolvemos carrito a la misma posición del array
        carts[index] = cart
        
        //Guardamos carrito
        const cartsJson = JSON.stringify(carts, null, 2)
        await fs.writeFile(this.path, cartsJson)
        console.log("Producto agregado exitosamente.")
        return cart
    }

    /**
    * Crea un carrito de compras
    * @returns {Object} - Retorna el carrito creado
    */
    async createCart(){

        //Buscamos todos los carritos o creamos un array vacío
        const carts = await this.#getCarts()
        
        //Generemos id único y creamos producto
        const id = await this.addIncrementId()
       
        //Creamos carrito y lo agregamos en el array 
        const products = []
        const cart = new Cart({id, products})

        carts.push(cart)
        
        //Guardamos producto
        const cartsJson = JSON.stringify(carts, null, 2)
        await fs.writeFile(this.path, cartsJson)
        console.log("Carrito creado exitosamente.")
        return cart
    }

    /**
     * Retorna un producto según id o lanza error si este no existe
     * @param {number} a - un id
     * @throws {Error} - si no existe el id
     * @returns {Object} - produto encontrado
     */

    async getCartById(id){
        const carts = await this.#getCarts()      
        const cart = carts.find(cart => cart.id === id)
        if (!cart){
            throw new Error("El carrito no existe")
        }
        const {products} = cart
        return products
    }

     /**
     * Actualiza un producto
     * @param {number} a - un id
     * @param {Object} a - Atributos de un producto
     * @throws {Error} - si no existe el producto o los atributos están incompletos
     * @returns {Object} - poducto actualizado
     */
    async updateProduct(req){
        const {pid} = req.params
        const {body} = req

        //Chequeamos si el producto existe
        await this.getProductById(Number(pid))
        
        //Traemos todos los productos
        const products = await this.getProducts()

        //Validación de campos
        //this.#validateAtributes(body)

        //Buscamos le posición de producto en el array
        const index = products.findIndex(product => product.id === Number(pid))
    
        //Asignamos el id 
        body.id = Number(pid)

        //Devolvemos producto a la misma posición del array
        products[index] = body
        
        //Se evalúa que tenga el mismo id
        if (!body.id ===  Number(pid)){
            throw new Error("El producto tiene que tener el mismo id")
        } 
        const productsToUpdate = JSON.stringify(products, null, 2)
        await fs.writeFile(this.path, productsToUpdate) 
        console.log("Producto actualizado", body)
        return body
        
    }

    /**
     * Actualiza un producto
     * @param {number} a - un id
     * @throws {Error} - si no existe el producto
     * @returns {Object} - poducto actualizado
     */
    async deleteProduct(id){

        //Buscamos producto para ver si existe el id
        let productToDelete = await this.getProductById(id)

        const products = await this.getProducts()

        //Filtramos todos los productos excluyendo el id
        const productDeleted = products.filter(product => product.id !== id)
        
        //Guardamos el resto de los productos
        const productsUpdated = JSON.stringify(productDeleted, null, 2)
        await fs.writeFile(this.path, productsUpdated) 
        return productToDelete
    }

}
