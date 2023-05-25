const Category = require('../category') // 載入 category model
const db = require('../../config/mongoose')
const categoryList = ['家居物業', '交通出行', '休閒娛樂', '餐飲食品', '其他']

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb-category connected!')
  for (let i = 1; i < 6; i++) {
    Category.create({ name: categoryList[i - 1] })
  }
  console.log('Ok!')
})