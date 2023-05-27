// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
// 引用 Record、Category model
const Record = require('../../models/record')
const Category = require('../../models/category')
const User = require('../../models/user')

const sortList = {
  最新: { date: 'desc' },
  金額最大: { amount: 'desc' },
  金額最小: { amount: 'asc' },
}

// 設定路由：首頁
router.get('/', (req, res) => {
  const userId = req.user._id
  let totalAmount = 0
  Record.find({ userId })
    .populate('categoryId') // 與Category Model建立連結(兩表間的key值)
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .sort({ date: 'desc' })
    .then(records => {
      records.forEach(record => totalAmount += record.amount),
        res.render('index', { records, totalAmount })
    })
    .catch(error => console.error(error))
})

// 設定路由：篩選及排序
router.get('/search', (req, res) => {
  const userId = req.user._id
  const categoryName = req.query.categoryName
  let sort = req.query.sort
  let totalAmount = 0

  if (!sort) { sort = "最新" }   //預設by最新日期排序

  if (categoryName) {           //篩選具有該分類id的records
    Category.findOne({ name: categoryName })
      .then(category =>

        Record.find({ categoryId: category._id, userId })
          .populate('categoryId')  //與Category Model建立連結
          .lean()
          .sort(sortList[sort])
          .then(records => {
            records.forEach(record => totalAmount += record.amount),
              res.render('index', { records, sort, categoryName, totalAmount })
          })
          .catch(error => console.error(error))
      )
  } else {
    Record.find({ userId })   //沒篩選分類，取出user全部records
      .populate('categoryId') // 與Category Model建立連結
      .lean() // 把 Mongoose的Model物件轉換成JavaScript資料陣列
      .sort(sortList[sort])
      .then(records => {
        records.forEach(record => totalAmount += record.amount),
          res.render('index', { records, sort, totalAmount })
      })
      .catch(error => console.error(error))
  }
})

// 匯出路由模組
module.exports = router