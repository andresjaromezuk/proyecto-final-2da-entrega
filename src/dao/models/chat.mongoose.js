import { Schema, model } from 'mongoose'

const chatSchema = new Schema({
  _id: { type: String, required: true },
  user:{ type: String, required: true},
  message:{ type: String, required: true}
}, {
  strict: 'throw',
  versionKey: false,
  statics: {},
  methods: {}
})

export const dbChat = model('messages', chatSchema)