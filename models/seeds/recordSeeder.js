const mongoose = require('mongoose')
const Record = require('../record') // 載入 record model
const recordList = require('../../record.json').results //引入json檔案
const Category = require('../category') // 載入 category model
const category = require('../category')
const categoryList = ['家居物業', '交通出行', '休閒娛樂', '餐飲食品', '其他']
let categoryList_Id = ""
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
  for (let i = 0; i < 5; i++) {
    Category.create({ name: categoryList[i] })
  }
  console.log('category done')

  for (let i = 0; i < recordList.length; i++) {

    const categoryName = recordList[i]['categoryName']

    Category.findOne({ name: categoryName })
      .lean()
      .then(category => Record.create({ ...recordList[i], categoryId: category._id }))
  }

  console.log('record done')
})