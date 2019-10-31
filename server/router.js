var express = require('express')
var md5 = require('blueimp-md5')
var mysql = require('./models/mysql')

var router = express.Router()

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

router.post('/login', function (req, res, next) {
  var body = req.body
  // 解密密码
  var password = md5(md5(body.password))
  // 保存登录状态
  req.session.user = body.name
  req.session.islogin = true
  // 向用户端返回包含 name 属性的 json 对象
  mysql.query('select name, password from user_information', [], function (result, fields) {
    result = JSON.stringify(result)
    result = JSON.parse(result)
    for(let key in result){
      // 遍历数组
      // console.log(result[key])
      if(body.name == result[key].name && password == result[key].password){
        res.json({correct_code:1})
        // 终止当前方法
        return false
      }
    }
    res.json({err_code:1})
  })
})

router.post('/register', function (req, res, next) {
  var body = req.body
  // 加密密码
  var password = md5(md5(body.password))
  var addSql = 'INSERT INTO user_information(name,password) VALUES(?,?)'
  var addSqlParams = [body.name, password]
  mysql.query('select name from user_information', [], function (result, fields) {
    result = JSON.stringify(result)
    result = JSON.parse(result)
    for(let key in result){
      // 遍历数组
      // console.log(result[key])
      if(body.name == result[key].name){
        res.json({err_code:2})
        // 终止当前方法
        return false
      }
    }
    mysql.query(addSql, addSqlParams, function (result, fields) {
      res.json({correct_code:1})
      console.log('添加成功！')
    })
  })
})

router.post('/url', function (req, res) {
  var body = req.body
  // 检查用户是否登陆
  if (body.name == '') {
    res.json({err_code:4})
    return false
  }
  var addSql = 'INSERT INTO user_collector(name, url) VALUES(?,?)'
  var addSqlParams = [body.name, body.url]
  // 范围查询
  var selectSql = 'select url, url_name from user_collector where name like ' + "'" + body.name + "'"
  mysql.query (selectSql, [], function (result, fields) {
    result = JSON.stringify(result)
    result = JSON.parse(result)
    for (let key in result) {
      // 遍历数组
      if (body.url == result[key].url) {
        res.json({err_code:3})
        // 终止当前方法
        return false
      }
    }
    mysql.query (addSql, addSqlParams, function (result, fields) {
      res.json({correct_code:2})
    })
  })
})

router.post('/updata', function (req, res) {
  var body = req.body
  if (body.name == '') {
    res.json({err_code:4})
    return false
  }
  var selectSql = 'select url, url_name from user_collector where name like ' + "'" + body.name + "'"
  mysql.query (selectSql, [], function (result, fields) {
    result = JSON.stringify(result)
    result = JSON.parse(result)
    res.json(result)
  })
})

router.post('/delete_collector', function (req, res) {
  var body = req.body
  var deleteSql = 'delete from user_collector where name like ' + "'" + body.name + "'" + 'and url like ' + "'" + body.url + "'"
  mysql.query (deleteSql, [], function (result, fields) {
    res.json({correct_code:3})
  })
})

router.post('/update_name', function (req, res) {
  var body = req.body
  var updateSql = 'update user_collector set url_name=' + "'" + body.url_name + "'" +' where name like ' + "'" + body.name + "'" + ' and url like ' + "'" + body.url + "'"
  mysql.query (updateSql, [], function (result, fields) {
    res.json({correct_code:4})
  })
})

router.get('/update', function (req, res) {
  if(req.session.user){
    var name = req.session.user
    res.json({correct_code:1,name:name})
  }
})

router.post('/album', function (req, res) {
  var body = req.body
  var addSql = 'INSERT INTO album(photo, name) VALUES(?,?)'
  var addSqlParams = [body.photo, body.name]
  mysql.query ('select photo from album', [], function (result, fields) {
    result = JSON.stringify(result)
    result = JSON.parse(result)
    for(let key in result){
      // 遍历数组
      // console.log(result[key])
      if(body.photo == result[key].photo){
        res.json({err_code:1})
        // 终止当前方法
        return false
      }
    }
    mysql.query(addSql, addSqlParams, function (result, fields) {
      res.json({correct_code:1})
      console.log('添加成功！')
    })
  })
})
  
router.post('/album/update', function (req, res) {
  mysql.query ('select photo, name from album', [], function (result, fields) {
      result = JSON.stringify(result)
      result = JSON.parse(result)
      res.json({correct_code:3,result:result})
  })
})

router.post('/album/update_name', function (req, res) {
  var body = req.body
  var updateSql = 'update album set name=' + "'" + body.name + "'" +' where photo like ' + "'" + body.photo + "'"
  mysql.query (updateSql, [], function (result, fields) {
    console.log(body.name)
    res.json({correct_code:4})
  })
})
  
router.post('/album/delete', function (req, res) {
  var body = req.body
  var deleteSql = 'delete from album where photo like ' + "'" + body.photo + "'"
  mysql.query (deleteSql, [], function (result, fields) {
    res.json({correct_code:2})
  })
})

// 暴露接口
module.exports = router
