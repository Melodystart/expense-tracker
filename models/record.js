const mongoose = require('mongoose')
const Schema = mongoose.Schema
const recordSchema = new Schema({
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  amount: {
    type: Number,
    required: true
  },
  userId: {
    type: Number,
    required: true
  },
  categoryId: {
    type: Number,
    required: true
  },
  categoryUrl: {
    type: String,
    required: true
  },
})
module.exports = mongoose.model('Record', recordSchema)