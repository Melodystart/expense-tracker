// 載入 express 並建構應用程式伺服器
const express = require('express')
const mongoose = require('mongoose') // 載入 mongoose
// 如果在 Heroku 環境則使用 process.env.PORT, 否則為本地環境，使用 3000 
const PORT = process.env.PORT || 3000
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser') // 引用 body-parser
const Record = require('./models/record') // 載入 Record model
const Category = require('./models/category') // 載入 Category model
const User = require('./models/user') // 載入 User model
const Handlebars = require('handlebars')
const hbshelpers = require('handlebars-helpers'); //引用handlebars-helpers
const multihelpers = hbshelpers();
const categoryIcon = {                            //將類別名稱轉換為url
  家居物業: "https://fontawesome.com/icons/home?style=solid",
  交通出行: "https://fontawesome.com/icons/shuttle-van?style=solid",
  休閒娛樂: "https://fontawesome.com/icons/grin-beam?style=solid",
  餐飲食品: "https://fontawesome.com/icons/utensils?style=solid",
  其他: "https://fontawesome.com/icons/pen?style=solid"
}


// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
mongoose.connect(process.env.MONGODB_URI) // 設定連線到 mongoDB

// 取得資料庫連線狀態
const db = mongoose.connection

// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine('hbs', exphbs.engine({ helpers: multihelpers, defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

//引用npm handlebars-dateformat調整日期格式
Handlebars.registerHelper('dateFormat', require('handlebars-dateformat'));

//自定義 handlebars-helper調整icon格式
Handlebars.registerHelper('iconFormat', function (categoryName) {
  const url = categoryIcon[categoryName]      //將類別名稱轉換為url
  const iconShape = url.split('/').slice(4)[0].split('?')[0]
  const iconStyle = url.split('/').slice(4)[0].split('?')[1].split('=')[1]
  const fontAwesomeIcon = `<i class= "fa-${iconShape} fa-${iconStyle} h5"></i>`
  return fontAwesomeIcon
})

// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))

// 設定首頁路由
app.get('/', (req, res) => {
  Record.find() // 取出 Record model 裡的所有資料
    .populate('categoryId') // 與Category Model建立連結(兩表間的key值)
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .then(records =>
      res.render('index', { records }))
    .catch(error => console.error(error))
})

app.get('/records/new', (req, res) => {
  return res.render('new')
})

app.post('/records', (req, res) => {
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

app.get('/records/:id/edit', (req, res) => {
  const id = req.params.id
  Record.findById(id)
    .populate('categoryId') // 與Category Model建立連結(兩表間的key值)
    .lean()
    .then((record) => res.render('edit', { record }))
    .catch(error => console.log(error))
})

app.post('/records/:id/edit', (req, res) => {
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

app.post('/records/:id/delete', (req, res) => {
  const id = req.params.id
  Record.deleteOne({ '_id': id })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// 設定 port
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})