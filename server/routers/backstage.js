var express = require('express')
var md5 = require('blueimp-md5')
var mysql = require('../models/backstage')

var router = express.Router()

// baskstage/write.vue
router.post('/submit', function (req, res) {
  var body = req.body
  var addSql = 'INSERT INTO article(title, tag, preface, value, date) VALUES(?,?,?,?,?)'
  var addSqlParams = [body.title, body.tag, body.preface, body.value, body.date]
  mysql.query(addSql, addSqlParams, function (result, fields) {
    res.json({correctCode:1})
    console.log('添加成功！')
  })
})

// blog/list.vue
router.get('/article', function (req, res) {
  var selectSql = 'select * from article'
  mysql.query(selectSql, [], function (result, fields) {
    result = JSON.stringify(result)
    result = JSON.parse(result)
    res.json({result})
  })
})

// blog/article.vue
router.post('/article', function (req, res) {
  var body = req.body
  var selectSql = `select * from article where articleID like ${body.articleID}`
  mysql.query(selectSql, [], function (result, fields) {
    result = JSON.stringify(result)
    result = JSON.parse(result)
    res.json({result})
  })
})

// blog/classify.vue
router.post('/tag', function (req, res) {
  var body = req.body
  console.log()
  // 模糊查询
  var selectSql = `select count(*) as tag from article where tag like '%${body.tag}%'`
  mysql.query(selectSql, [], function (result, fields) {
    result = JSON.stringify(result)
    result = JSON.parse(result)
    res.json({result})
  })
})

// blog/classifyArticle.vue
router.post('/classify', function (req, res) {
  var body = req.body
  // 模糊查询
  var selectSql = `select * from article where tag like '%${body.tag}%'`
  mysql.query(selectSql, [], function (result, fields) {
    result = JSON.stringify(result)
    result = JSON.parse(result)
    res.json({result})
  })
})

// baskstage/manage.vue
router.post('/delete', function (req, res) {
  var body = req.body
  // 模糊查询
  var deleteSql = 'delete from article where articleID like ' + "'" + body.articleID + "'"
  mysql.query(deleteSql, [], function (result, fields) {
    result = JSON.stringify(result)
    result = JSON.parse(result)
    res.json({correctCode: 1})
  })
})

// baskstage/edit.vue
router.post('/preserve', function (req, res) {
  var body = req.body
  // 模糊查询
  var updateSql = `update article set title= ${body.title}, preface= ${body.preface} where articleID like ${body.articleID}`
  mysql.query(updateSql, [], function (result, fields) {
    result = JSON.stringify(result)
    result = JSON.parse(result)
    res.json({correctCode: 1})
  })
})

// 暴露接口
module.exports = router
