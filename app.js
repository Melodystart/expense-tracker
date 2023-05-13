// 載入 express 並建構應用程式伺服器
const express = require('express')
const mongoose = require('mongoose') // 載入 mongoose
// 如果在 Heroku 環境則使用 process.env.PORT, 否則為本地環境，使用 3000 
const PORT = process.env.PORT || 3000
const exphbs = require('express-handlebars');
const Record = require('./models/record') // 載入 Record model
const Category = require('./models/category') // 載入 Category model
const User = require('./models/user') // 載入 User model
const bodyParser = require('body-parser')  // 引用 body-parser
const Handlebars = require('handlebars') //
const hbshelpers = require('handlebars-helpers'); //引用handlebars-helpers
const multihelpers = hbshelpers();

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
Handlebars.registerHelper('iconFormat', function (url) {
  const iconShape = url.split('/').slice(4)[0].split('?')[0]
  const iconStyle = url.split('/').slice(4)[0].split('?')[1].split('=')[1]
  const fontAwesomeIcon = `<i class= "fa-${iconShape} fa-${iconStyle} h5"></i>`
  return fontAwesomeIcon
})

app.use(bodyParser.urlencoded({ extended: true }))


// 設定首頁路由
app.get('/', (req, res) => {
  Record.find() // 取出 Record model 裡的所有資料
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .then(records =>
      res.render('index', { records })) // 將資料傳給 index 樣板
    .catch(error => console.error(error)) // 錯誤處理
})

app.get('/records/new', (req, res) => {
  return res.render('new')
})

app.post('/records', (req, res) => {
  const name = req.body.name       // 從 req.body 拿出表單裡的 name 資料
  return Record.create({ name })     // 存入資料庫
    .then(() => res.redirect('/')) // 新增完成後導回首頁
    .catch(error => console.log(error))
})

// 設定 port
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})