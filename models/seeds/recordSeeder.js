const mongoose = require('mongoose')
const Record = require('../record') // 載入 record model
const recordList = require('../../record.json').results //引入json檔案
const Category = require('../category') // 載入 category model
const categoryList = ['家居物業', '交通出行', '休閒娛樂', '餐飲食品', '其他']
const categoryIcon = {
  家居物業: "https://fontawesome.com/icons/home?style=solid",
  交通出行: "https://fontawesome.com/icons/shuttle-van?style=solid",
  休閒娛樂: "https://fontawesome.com/icons/grin-beam?style=solid",
  餐飲食品: "https://fontawesome.com/icons/utensils?style=solid",
  其他: "https://fontawesome.com/icons/pen?style=solid"
}

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

  for (let i = 1; i < 6; i++) {
    Category.create({ id: i, name: categoryList[i - 1], icon: categoryIcon[categoryList[i - 1]] })
  }
  console.log('category done')

  Record.create(recordList)
  console.log('record done')
})