const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Record = require('../record')
const Category = require('../category')
const User = require('../user')
const recordList = require('../../record.json').results //引入json檔案
const db = require('../../config/mongoose')

const SEED_USER = [{
  name: '廣志',
  email: 'user1@example.com',
  password: '12345678',
  recordNumber: [0, 1, 2, 4]
},
{
  name: '小新',
  email: 'user2@example.com',
  password: '12345678',
  recordNumber: [3]
}]

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {

  return Promise.all(Array.from(
    { length: 2 },  // 2個測試user
    (_, i) =>

      bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(SEED_USER[i].password, salt))
        .then(hash => User.create({
          name: SEED_USER[i].name,
          email: SEED_USER[i].email,
          password: hash
        }))
        .then(user => {
          const userId = user._id
          return Promise.all(Array.from(
            { length: SEED_USER[i].recordNumber.length }, //測試user各自records
            (_, j) => {

              const seederNumber = SEED_USER[i].recordNumber[j]
              const categoryName = recordList[seederNumber]['categoryName']

              return Category.findOne({ name: categoryName })
                .lean()
                .then(category =>
                  Record.create({
                    ...recordList[seederNumber], userId, categoryId: category._id
                  })
                )
            }))
        })
  ))
    .then(() => {
      console.log('Record done.')
      process.exit()
    })
})