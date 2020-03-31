var express = require('express')
var md5 = require('blueimp-md5')
var mysql = require('../models/web')

var router = express.Router()
// 暴露接口
module.exports = router

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

router.post('/update', function (req, res) {
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

router.post('/delete', function (req, res) {
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

router.get('/check_landing', function (req, res) {
  if(req.session.user){
    var name = req.session.user
    res.json({correct_code:1,name:name})
  }
})
