let express = require('express')
let md5 = require('blueimp-md5')
let mysql = require('../models/selectExclude')

let router = express.Router()

// loginBox.vue
router.post('/login', function (req, res, next) {
  let body = req.body
  // 解密密码
  let password = md5(md5(body.password))
  // 保存登录状态
  req.session.user = body.name
  req.session.islogin = true
  // 向用户端返回包含 name 属性的 json 对象
  mysql.query('select name, password from userInformation', [], function (result, fields) {
    result = JSON.stringify(result)
    result = JSON.parse(result)
    for(let key in result){
      // 遍历数组
      // console.log(result[key])
      if(body.name == result[key].name && password == result[key].password){
        res.json({correctCode:1})
        // 终止当前方法
        return false
      }
    }
    res.json({errCode:1})
  })
})
  
// loginBox.vue
router.post('/register', function (req, res, next) {
  let body = req.body
  // 加密密码
  let password = md5(md5(body.password))
  let addSql = 'INSERT INTO userInformation(name,password) VALUES(?,?)'
  let addSqlParams = [body.name, password]
  mysql.query('select name from userInformation', [], function (result, fields) {
    result = JSON.stringify(result)
    result = JSON.parse(result)
    for(let key in result){
      // 遍历数组
      // console.log(result[key])
      if(body.name == result[key].name){
        res.json({errCode:2})
        // 终止当前方法
        return false
      }
    }
    mysql.query(addSql, addSqlParams, function (result, fields) {
      res.json({correctCode:1})
      console.log('添加成功！')
    })
  })
})

// selectExclude.vue
router.post('/qqInput', function (req, res, next) {
  let body = req.body
  // 加密密码
  let addSql = 'INSERT INTO qqInformation(qID) VALUES(?)'
  let addSqlParams = [body.qID]
  mysql.query('select qID from qqInformation', [], function (result, fields) {
    result = JSON.stringify(result)
    result = JSON.parse(result)
    for(let key in result){
      // 遍历数组
      // console.log(result[key])
      if(body.qID == result[key].qID){
        res.json({errCode:2})
        // 终止当前方法
        return false
      }
    }
    mysql.query(addSql, addSqlParams, function (result, fields) {
      res.json({correctCode: 102})
      console.log('添加成功！')
    })
  })
})

// selectExclude.vue
router.post('/qqSelect', function (req, res, next) {
  let body = req.body
  // 加密密码
  let selectSql = 'select * from qqInformation where qID like' + "'%" + body.qID + "%'"
  mysql.query(selectSql, [], function (result, fields) {
    result = JSON.stringify(result)
    result = JSON.parse(result)
    // 检测是否为空数组
    if (result.length === 0) {
      res.json({errCode: 401})
      return false
    }
    res.json({result: result, correctCode: 101})
  })
})

// selectExclude.vue
router.post('/weixinInput', function (req, res, next) {
  let body = req.body
  // 加密密码
  let addSql = 'INSERT INTO weixinInformation(wID) VALUES(?)'
  let addSqlParams = [body.wID]
  mysql.query('select wID from weixinInformation', [], function (result, fields) {
    result = JSON.stringify(result)
    result = JSON.parse(result)
    for(let key in result){
      // 遍历数组
      // console.log(result[key])
      if(body.wID == result[key].wID){
        res.json({errCode:2})
        // 终止当前方法
        return false
      }
    }
    mysql.query(addSql, addSqlParams, function (result, fields) {
      res.json({correctCode: 102})
      console.log('添加成功！')
    })
  })
})

// selectExclude.vue
router.post('/weixinSelect', function (req, res, next) {
  let body = req.body
  // 加密密码
  let selectSql = 'select * from weixinInformation where wID like' + "'%" + body.wID + "%'"
  mysql.query(selectSql, [], function (result, fields) {
    result = JSON.stringify(result)
    result = JSON.parse(result)
    // 检测是否为空数组
    if (result.length === 0) {
      res.json({errCode: 401})
      return false
    }
    res.json({result: result, correctCode: 101})
  })
})

// selectExclude.vue
router.post('/delete', function (req, res) {
  let body = req.body
  let deleteSql
  if (body.selectState === 'qq') {
    deleteSql = 'delete from qqInformation where qID like ' + "'" + body.message + "'"
  } else {
    deleteSql = 'delete from weixinInformation where wID like ' + "'" + body.message + "'"
  }
  mysql.query (deleteSql, [], function (result, fields) {
    res.json({correctCode: 103})
  })
})

// selectExclude.vue
router.post('/edit', function (req, res) {
  let body = req.body
  let updateSql
  let selectSql
  if (body.selectState === 'qq') {
    updateSql = 'update qqInformation set qID=' + "'" + body.newMessage + "'" + 'where qID like' + "'" + body.oldMessage + "'"
    selectSql = 'select * from qqInformation where qID like' + "'%" + body.newMessage + "%'"
  } else {
    updateSql = 'update weixinInformation set wID=' + "'" + body.newMessage + "'" + 'where wID like' + "'" + body.oldMessage + "'"
    selectSql = 'select * from weixinInformation where wID like' + "'%" + body.newMessage + "%'"
  }
  mysql.query (selectSql, [], function (result, fields) {
    result = JSON.stringify(result)
    result = JSON.parse(result)
    for(let key in result){
      // 遍历数组
      if (body.selectState === 'qq') {
        if(body.newMessage == result[key].qID){
          res.json({errCode: 402})
          // 终止当前方法
          return false
        }
      } else {
        if(body.newMessage == result[key].wID){
          res.json({errCode: 402})
          // 终止当前方法
          return false
        }
      }
    }
    mysql.query (updateSql, [], function (result, fields) {
      res.json({correctCode: 104})
    })
  })
})

// selectExclude.vue
// 自动登录模块
router.get('/checkLanding', function (req, res) {
  if(req.session.user){
    let name = req.session.user
    res.json({name: name})
  }
})

// 暴露接口
module.exports = router
