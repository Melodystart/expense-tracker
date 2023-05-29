const Category = require('../category')
const db = require('../../config/mongoose')
const categoryList = ["家居物業", "交通出行", "休閒娛樂", "餐飲食品", "其他"]

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  return Promise.all(Array.from(
    { length: 5 },        //5個category類別
    (_, i) =>
      Category.create({ name: categoryList[i] })
  ))
    .then(() => {
      console.log('Category done.')
      process.exit()
    })
})