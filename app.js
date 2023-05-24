// 載入 express 並建構應用程式伺服器
const express = require('express')
const mongoose = require('mongoose') // 載入 mongoose
// 如果在 Heroku 環境則使用 process.env.PORT, 否則為本地環境，使用 3000 
const PORT = process.env.PORT || 3000
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser') // 引用 body-parser

const User = require('./models/user') // 載入 User model
const Handlebars = require('handlebars')
const hbshelpers = require('handlebars-helpers'); //引用handlebars-helpers
const multihelpers = hbshelpers();
const NumeralHelper = require("handlebars.numeral"); //千分位用途
const methodOverride = require('method-override')  // 載入 method-override
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
// 引用路由器
const routes = require('./routes')
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
//引用npm handlebars.numeral調整金額千分位格式
NumeralHelper.registerHelpers(Handlebars);

// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))

// 設定每一筆請求都會透過 methodOverride 進行前置處理
app.use(methodOverride('_method'))

// 將 request 導入路由器
app.use(routes)

// 設定 port
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})