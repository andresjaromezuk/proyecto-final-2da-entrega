import { Schema, model } from 'mongoose'

const cartSchema = new Schema({
  _id: { type: String, required: true },
  products: [{product:{type: String, ref: 'products', required: true }, quantity:{type: Number, required: true}}]
}, {
  strict: 'throw',
  versionKey: false,
  statics: {},
  methods: {}
})

export const dbCart = model('carts', cartSchema)