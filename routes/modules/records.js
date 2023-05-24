// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
const Record = require('../../models/record') // 引用 Record model
const Category = require('../../models/category') // 載入 Category model

// 設定路由：讀取新增record介面
router.get('/new', (req, res) => {
  return res.render('new')
})

// 設定路由：儲存新增record資料
router.post('/', (req, res) => {
  const { name, date, amount, categoryName } = req.body //從req.body拿出表單資料
  const userId = 1  //***userId待處理
  Category.findOne({ name: categoryName })
    .lean()
    .then(category =>
      Record.create({ name, date, amount, userId, categoryId: category._id }) // 存入資料庫
        .then(() => res.redirect('/')) // 新增完成後導回首頁
        .catch(error => console.log(error))
    )
})

// 設定路由：讀取修改record介面
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  Record.findById(id)
    .populate('categoryId') // 與Category Model建立連結(兩表間的key值)
    .lean()
    .then((record) => res.render('edit', { record }))
    .catch(error => console.log(error))
})

// 設定路由：儲存修改record資料
router.put('/:id', (req, res) => {
  const id = req.params.id
  const { name, date, amount, categoryName } = req.body //從req.body拿出表單資料
  Category.findOne({ name: categoryName })
    .then(category => {
      Record.findById(id)
        .then(record => {
          record.name = name
          record.date = date
          record.amount = amount
          record.categoryId = category.id
          record.userId = 1
          return record.save()
        })
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
    })
})
// 設定路由：刪除record資料
router.delete('/:id', (req, res) => {
  const id = req.params.id
  Record.deleteOne({ '_id': id })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// 匯出路由模組
module.exports = router