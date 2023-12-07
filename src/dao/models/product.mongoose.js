import { Schema, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const productSchema = new Schema({
  _id: { type: String, required: true },
  title : { type: String, required: true }, 
  description : { type: String, required: true },
  price : { type: Number, required: true },
  thumbnail : [{ type: String, required: true }],
  code : { type: String, unique: true, required: true },
  stock : { type: Number, required: true },
  status : { type: Boolean, required: true },
  category : { type: String, required: true }
}, {
  strict: 'throw',
  versionKey: false,
  statics: {},
  methods: {}
})

productSchema.plugin(mongoosePaginate)

export const dbProduct = model('products', productSchema)