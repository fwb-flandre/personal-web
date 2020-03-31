var express = require('express')
var md5 = require('blueimp-md5')
var mysql = require('./models/web')

// 子路由引入
var collector = require('./routers/collector')
var album = require('./routers/album')
var teach_manage = require('./routers/teach_manage')
var detect = require('./routers/detect')
var backstage = require('./routers/backstage')
var selectExclude = require('./routers/selectExclude')

var router = express.Router()

// 子路由设置
router.use('/collector',collector)
router.use('/album',album)
router.use('/teach_manage',teach_manage)
router.use('/detect',detect)
router.use('/backstage',backstage)
router.use('/selectExclude',selectExclude)

router.get('/', function (req, res) {
  // req 要在 res 之前设置
  console.log('查询结果：')
  res.render('index.html', {
    user: req.session.user
  })
  console.log('查询结果：')
})

router.get('/login', function (req, res) {
  // 在 session 里的 cookie 存储 abc 属性 3
  req.session.abc = '3'
  // 在浏览器的 cookie 里存储，非加密
  res.cookie('abc', 3, { maxAge: 1800000 })
  mysql.query('select * from user_information', [], function (result, fields) {
  // 把result对象转为字符串，去掉获取 MySQL 数据产生的 RowDataPacket
    result = JSON.stringify(result)
    // 把result字符串转为json对象
    result = JSON.parse(result)
    console.log('查询结果：')
    // 取出某一数据
    console.log(result[0])
  })
})

// 暴露接口
module.exports = router
