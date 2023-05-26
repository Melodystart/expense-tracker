const express = require('express')
const session = require('express-session')
// 如果在 Heroku 環境則使用 process.env.PORT, 否則為本地環境，使用 3000 
const PORT = process.env.PORT || 3000
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const User = require('./models/user')
const Handlebars = require('handlebars')
const hbshelpers = require('handlebars-helpers');
const multihelpers = hbshelpers();
const NumeralHelper = require("handlebars.numeral"); //引用將金額以千分位格式呈現
const methodOverride = require('method-override')
const categoryIcon = {                              //對照表：將類別名稱轉換為url
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

const routes = require('./routes')
// 載入設定檔，要寫在 express-session 以後
const usePassport = require('./config/passport')
require('./config/mongoose')

const app = express()
app.engine('hbs', exphbs.engine({ helpers: multihelpers, defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))
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

// 呼叫 Passport 函式並傳入 app，這條要寫在路由之前
usePassport(app)

// 把 req 裡的登入狀態交接給 res
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  next()
})

// 將 request 導入路由器
app.use(routes)

// 設定 port
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})