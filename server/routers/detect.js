var express = require('express')
var md5 = require('blueimp-md5')
var mysql = require('../models/detect')
var SMSClient = require('@alicloud/sms-sdk')

var router = express.Router()
// 暴露接口
module.exports = router

// 补充 0
function getTime (time) {
  function addZero (date) {
    return (date < 10 ? "0" + date : date)
  }
  let date = time.getFullYear() + '-' + addZero(time.getMonth() + 1) + '-' + addZero(time.getDate())
  return date
}

// 获取随机数
function getRandom(){
  let str = "";
  for(let i = 0; i < 4; i++){
      str += parseInt(Math.random() * 10);
  }
  return str;
}

// loginBox.vue
router.post('/login', function (req, res, next) {
  let body = req.body
  // 解密密码
  let password = md5(md5(body.password))
  // 保存登录状态
  req.session.user = body.name
  req.session.islogin = true
  // 向用户端返回包含 name 属性的 json 对象
  mysql.query('select name, password from information', [], function (result, fields) {
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
  let addSql = 'INSERT INTO information(name,password) VALUES(?,?)'
  let addSqlParams = [body.name, password]
  mysql.query('select name from information', [], function (result, fields) {
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

// manage.vue
router.post('/load', function (req, res) {
  let body = req.body
  let selectSql = `select * from class where name like ${body.name}`
  mysql.query(selectSql, [], function (result, fields) {
    result = JSON.stringify(result)
    result = JSON.parse(result)
    res.json({correctCode: 1,result: result})
  })
})

// manage.vue
router.post('/examine', function (req, res) {
  let body = req.body
  let selectSql = `select * from student where number like ${body.number}`
  mysql.query(selectSql, [], function (result, fields) {
    result = JSON.stringify(result)
    result = JSON.parse(result)
    res.json({correctCode: 1,result: result})
  })
})

// manage.vue
router.post('/delect', function (req, res) {
  let body = req.body
  let deleteSql = `delete from class where number like ${body.number}`
  mysql.query(deleteSql, [], function (result, fields) {
    result = JSON.stringify(result)
    result = JSON.parse(result)
    res.json({correctCode: 3})
  })
})

// manage.vue
router.post('/create', function (req, res) {
  let body = req.body
  let addSql = 'INSERT INTO class(name,number,collegeName,className,pitchNumber,time,place) VALUES(?,?,?,?,?,?,?)'
  let addSqlParams = [body.name, body.number, body.collegeName, body.className, body.pitchNumber, body.time, body.place]
  mysql.query('select pitchNumber,time from class', [], function (result, fields) {
    result = JSON.stringify(result)
    result = JSON.parse(result)
    // 遍历数组
    for(let key in result){
      // 将数据库中的数据转化为 date 类型
      let time = new Date(result[key].time)
      if(body.pitchNumber == result[key].pitchNumber && body.time == getTime(time)){
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

// personal.vue
router.post('/loadPersonal', function (req, res) {
  let body = req.body
  let selectSql = `select * from personalMessage where nickname like ${body.nickname}`
  mysql.query(selectSql, [], function (result, fields) {
    result = JSON.stringify(result)
    result = JSON.parse(result)
    res.json({result: result})
  })
})

// personal.vue
router.post('/loadClass', function (req, res) {
  let body = req.body
  let selectSql = `select count(number) as num from class where name like ${body.nickname}`
  mysql.query(selectSql, [], function (result, fields) {
    result = JSON.stringify(result)
    result = JSON.parse(result)
    res.json({result: result})
  })
})

// personal.vue
router.post('/loadStudent', function (req, res) {
  let body = req.body
  let selectSql = `select count(*) as num from student where number in (select number from class where name like ${body.nickname})`
  mysql.query(selectSql, [], function (result, fields) {
    result = JSON.stringify(result)
    result = JSON.parse(result)
    res.json({result: result})
  })
})

// personal.vue
router.post('/edit', function (req, res) {
  let body = req.body
  let updateSql = `update personalMessage set name= ${body.name}, phoneNumber = ${body.phoneNumber}, mailBox = ${body.mailBox} where nickname like ${body.nickname}`
  mysql.query(updateSql, [], function (result, fields) {
    result = JSON.stringify(result)
    result = JSON.parse(result)
  })
})

// detect.vue
// 自动登录模块
router.get('/checkLanding', function (req, res) {
  if(req.session.user){
    let name = req.session.user
    res.json({name: name})
  }
})

// detect.vue
// 发验证码短信
router.post('/sms', function (req, res) {
  let body = req.body
  let str = getRandom()
  const accessKeyId = '';
  const secretAccessKey = '';
  // 初始化sms_client
  let smsClient = new SMSClient({accessKeyId, secretAccessKey});
      // 发送短信
      smsClient.sendSMS({
        PhoneNumbers: body.PhoneNumbers,//必填:待发送手机号。支持以逗号分隔的形式进行批量调用，批量上限为1000个手机号码,批量调用相对于单条调用及时性稍有延迟,验证码类型的短信推荐使用单条调用的方式；发送国际/港澳台消息时，接收号码格式为：国际区号+号码，如“85200000000”
        //以下短信签名和模板填入自己申请的即可
        SignName: '',//必填:短信签名-可在短信控制台中找到
        TemplateCode: '',//必填:短信模板-可在短信控制台中找到，发送国际/港澳台消息时，请使用国际/港澳台短信模版
        TemplateParam: `{"code":'${str}'}`//可选:模板中的变量替换JSON串,如模板内容为"亲爱的${name},您的验证码为${code}"时。
    })
      .then(function (res) {
        console.log(res);
        if (res.Code === 'OK') {
            //这里返回的数据自行确定
            let obj = {
                msg : "ok",
                code : str  //str是自行产生的手机验证码，返回到前端以做验证
            }
            res.json(obj);
            //调试阶段打印出来便于调试
            console.log(res);
        }
    },function(err) {
        let obj = {
            msg:"fail"
        }
        res.json(obj);
        console.log(err.data.Code);
    })
})
