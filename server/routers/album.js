var express = require('express')
var md5 = require('blueimp-md5')
var mysql = require('../models/web')
const qnconfig = require('../models/qiniu_config.js')

var router = express.Router()

router.post('/', function (req, res) {
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
          res.json({err_code: 1})
          // 终止当前方法
          return false
        }
      }
      mysql.query(addSql, addSqlParams, function (result, fields) {
        res.json({correct_code: 1})
        console.log('添加成功！')
      })
    })
  })

router.post('/update', function (req, res) {
  var body = req.body
  var selectSql = `select photo, name from album limit ${body.count},1`
  mysql.query (selectSql, [], function (result, fields) {
    result = JSON.stringify(result)
    result = JSON.parse(result)
    if (result.length === 0) {
      res.json({err_code: 2})
      return false
    }
    res.json({result: result})
  })
})

router.post('/update_name', function (req, res) {
  var body = req.body
  var updateSql = 'update album set name=' + "'" + body.name + "'" +' where photo like ' + "'" + body.photo + "'"
  mysql.query (updateSql, [], function (result, fields) {
    res.json({correct_code: 4})
  })
})
  
router.post('/delete', function (req, res) {
  var body = req.body
  var deleteSql = 'delete from album where photo like ' + "'" + body.photo + "'"
  mysql.query (deleteSql, [], function (result, fields) {
    res.json({correct_code: 2})
  })
})

// 返回上传凭证
router.get('/upload', function (req, res) {
  var token = qnconfig.uploadToken
  res.json({correct_code: 5,upToken: token})
})

// 暴露接口
module.exports = router
