// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
// 引入 home、records、users 模組程式碼
const home = require('./modules/home')
const records = require('./modules/records')
const users = require('./modules/users')
const { authenticator } = require('../middleware/auth')

// 加入驗證程序
// 將網址結構符合 /、/records、/users 字串的request導向 home、records、users 模組 
router.use('/records', authenticator, records)
router.use('/users', users)
router.use('/', authenticator, home)

// 匯出路由器
module.exports = router