const mongoose = require('mongoose')
const Record = require('../record') // 載入 record model
const recordList = require('../../record.json').results //引入json檔案
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI)
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb-record connected!')
  Record.create(recordList)
  console.log('record done')
})