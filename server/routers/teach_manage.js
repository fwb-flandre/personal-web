var express = require('express')
var md5 = require('blueimp-md5')
var mysql = require('../models/teach')

var router = express.Router()
// 暴露接口
module.exports = router

router.post('/login', function (req, res, next) {
    var body = req.body
    var selectSql
    // 解密密码
    var password = md5(md5(body.password))
    if(body.radio == '1'){
      selectSql = 'select sno, password from student_login'
    }
    else{
      selectSql = 'select tno, password from teacher_login'
    }
    // 保存登录状态
    req.session.user = body.name
    req.session.islogin = true
    // 向用户端返回包含 name 属性的 json 对象
    mysql.query(selectSql, [], function (result, fields) {
      result = JSON.stringify(result)
      result = JSON.parse(result)
      for(let key in result){
        // 遍历数组
        // console.log(result[key])
        if(body.radio == '1'){
          if(body.name == result[key].sno && password == result[key].password){
            res.json({correct_code:1})
            // 终止当前方法
            return false
          }
        }
        else{
          if(body.name == result[key].tno && password == result[key].password){
            res.json({correct_code:1})
            // 终止当前方法
            return false
          }
        }
      }
      res.json({err_code:1})
    })
  })
  
router.post('/register', function (req, res, next) {
  var body = req.body
  var addSql,selectSql
  // 加密密码
  var password = md5(md5(body.password))
  if(body.radio == '1'){
    addSql = 'INSERT INTO student_login(sno,password) VALUES(?,?)'
    selectSql = 'select sno from student_login'
  }
  else{
    addSql = 'INSERT INTO teacher_login(tno,password) VALUES(?,?)'
    selectSql = 'select tno from teacher_login'
  }
  var addSqlParams = [body.name, password]
  mysql.query(selectSql, [], function (result, fields) {
    result = JSON.stringify(result)
    result = JSON.parse(result)
    for(let key in result){
      // 遍历数组
      // console.log(result[key])
      if(body.radio == '1'){
        if(body.name == result[key].sno){
          res.json({err_code:2})
          // 终止当前方法
          return false
        }
      }
      else{
        if(body.name == result[key].tno){
          res.json({err_code:2})
          // 终止当前方法
          return false
        }
      }
    }
    mysql.query(addSql, addSqlParams, function (result, fields) {
      res.json({correct_code:1})
      console.log('添加成功！')
    })
  })
})

router.post('/input1', function (req, res) {
  var body = req.body
  var Sql,addSqlParams
  if(body.ssex == ''){
    body.ssex = '男'
  }
  if(body.sbirthday == ''){
    body.sbirthday = '1970-01-01'
  }
  if(body.adm_score == ''){
    body.adm_score = 50
  }
  if(body.flag == true){
    Sql = 'INSERT INTO student(sno,sname,ssex,sbirthday,adm_score,dno) VALUES(?,?,?,?,?,?)'
    addSqlParams = [body.sno, body.sname, body.ssex, body.sbirthday, body.adm_score, body.dno]
  }
  else {
    Sql = 'update student set sname=' + "'" + body.sname + "',ssex=" + "'" + body.ssex + "',sbirthday=" + "'" + body.sbirthday + "',adm_score=" + "'" + body.adm_score + "',dno=" + "'" + body.dno + "'" + ' where sno like ' + "'" + body.sno + "'"
  }
  mysql.query('select sno from student', [], function (result, fields) {
    result = JSON.stringify(result)
    result = JSON.parse(result)
    for(let key in result){
      // 遍历数组
      // console.log(result[key])
      if(body.sno == result[key].sno && body.flag == true){
        res.json({err_code:2})
        // 终止当前方法
        return false
      }
    }
    mysql.query(Sql, addSqlParams, function (result, fields) {
      if(body.flag == true){
        res.json({correct_code:2})
      }
      else {
        res.json({correct_code:5})
      }
      console.log('添加成功！')
    })
  })
})

router.post('/input2', function (req, res) {
  var body = req.body
  var Sql,addSqlParams
  if(body.flag == true){
    Sql = 'INSERT INTO department(dno,dname,synopsis) VALUES(?,?,?)'
    addSqlParams = [body.dno, body.dname, body.synopsis]
  }
  else {
    Sql = 'update department set dname=' + "'" + body.dname + "',synopsis=" + "'" + body.synopsis + "'" + ' where dno like ' + "'" + body.dno + "'"
  }
  mysql.query('select dno from department', [], function (result, fields) {
    result = JSON.stringify(result)
    result = JSON.parse(result)
    for(let key in result){
      // 遍历数组
      // console.log(result[key])
      if(body.dno == result[key].dno && body.flag == true){
        res.json({err_code:2})
        // 终止当前方法
        return false
      }
    }
    mysql.query(Sql, addSqlParams, function (result, fields) {
      if(body.flag == true){
        res.json({correct_code:2})
      }
      else {
        res.json({correct_code:5})
      }
      console.log('添加成功！')
    })
  })
})

router.post('/input3', function (req, res) {
  var body = req.body
  var Sql,addSqlParams
  if(body.period == ''){
    body.period = 0
  }
  if(body.credit == ''){
    body.credit = 0
  }
  if(body.ctime == ''){
    body.ctime = '1970-01-01'
  }
  if(body.exam_time == ''){
    body.exam_time = '1970-01-01'
  }
  if(body.flag == true){
    Sql = 'INSERT INTO course(cno,cname,tno,period,credit,ctime,cplace,exam_time) VALUES(?,?,?,?,?,?,?,?)'
    addSqlParams = [body.cno, body.cname, body.tno, body.period, body.credit, body.ctime, body.cplace, body.exam_time]
  }
  else {
    Sql = 'update course set cname=' + "'" + body.cname + "',tno=" + "'" + body.tno + "',period=" + "'" + body.period + "',credit=" + "'" + body.credit + "',ctime=" + "'" + body.ctime + "',cplace=" +  "'" + body.cplace + "',exam_time=" + "'" + body.exam_time + "'" + ' where cno like ' + "'" + body.cno + "'"
  }
  mysql.query('select cno from course', [], function (result, fields) {
    result = JSON.stringify(result)
    result = JSON.parse(result)
    for(let key in result){
      // 遍历数组
      // console.log(result[key])
      if(body.cno == result[key].cno && body.flag == true){
        res.json({err_code:2})
        // 终止当前方法
        return false
      }
    }
    mysql.query(Sql, addSqlParams, function (result, fields) {
      if(body.flag == true){
        res.json({correct_code:2})
      }
      else {
        res.json({correct_code:5})
      }
      console.log('添加成功！')
    })
  })
})

router.post('/input4', function (req, res) {
  var body = req.body
  var Sql,addSqlParams
  if(body.tsex == ''){
    body.tsex = '男'
  }
  if(body.tbirthday == ''){
    body.tbirthday = '1970-01-01'
  }
  if(body.flag == true){
    Sql = 'INSERT INTO teacher(tno,tname,tsex,tbirthday,dno,title,major,direction) VALUES(?,?,?,?,?,?,?,?)'
    addSqlParams = [body.tno, body.tname, body.tsex, body.tbirthday, body.dno, body.title, body.major, body.direction]
  }
  else {
    Sql = 'update teacher set tname=' + "'" + body.tname + "',tsex=" + "'" + body.tsex + "',tbirthday=" + "'" + body.tbirthday + "',dno=" + "'" + body.dno + "',title=" + "'" + body.title + "',major=" +  "'" + body.major + "',direction=" + "'" + body.direction + "'" + ' where tno like ' + "'" + body.tno + "'"
  }
  mysql.query('select tno from teacher', [], function (result, fields) {
    result = JSON.stringify(result)
    result = JSON.parse(result)
    for(let key in result){
      // 遍历数组
      // console.log(result[key])
      if(body.tno == result[key].tno && body.flag == true){
        res.json({err_code:2})
        // 终止当前方法
        return false
      }
    }
    mysql.query(Sql, addSqlParams, function (result, fields) {
      if(body.flag == true){
        res.json({correct_code:2})
      }
      else {
        res.json({correct_code:5})
      }
      console.log('添加成功！')
    })
  })
})

router.post('/input6', function (req, res) {
  var body = req.body
  var Sql,addSqlParams
  if(body.flag == true){
    Sql = 'INSERT INTO score(sno,cno,daily_grade,test_score,total_mark) VALUES(?,?,?,?,?)'
    addSqlParams = [body.sno, body.cno, body.daily_grade, body.test_score, body.total_mark]
  }
  else {
    Sql = 'update score set daily_grade=' + "'" + body.daily_grade + "',test_score=" + "'" + body.test_score + "',total_mark=" + "'" + body.total_mark + "'" + ' where sno like ' + "'" + body.sno + "'and cno like" + "'" + body.cno + "'"
  }
  mysql.query('select sno,cno from score', [], function (result, fields) {
    result = JSON.stringify(result)
    result = JSON.parse(result)
    for(let key in result){
      // 遍历数组
      // console.log(result[key])
      if(body.sno == result[key].sno && body.cno == result[key].cno && body.flag == true){
        res.json({err_code:2})
        // 终止当前方法
        return false
      }
    }
    mysql.query(Sql, addSqlParams, function (result, fields) {
      if(body.flag == true){
        res.json({correct_code:2})
      }
      else {
        res.json({correct_code:5})
      }
      console.log('添加成功！')
    })
  })
})

router.post('/delete', function (req, res) {
  var body = req.body
  var deleteSql,insertSql
  switch (body.title) {
    case '学生基本信息管理':
      deleteSql = 'delete from student where sno like ' + "'" + body.no + "'"
      insertSql = 'insert into transfer select * from student where sno like' + "'" + body.no + "'"
      mysql.query (insertSql, [], function (result, fields) {
        console.log('退出成功')
      })
      break
    case '系的基本信息管理':
      deleteSql = 'delete from department where dno like ' + "'" + body.no + "'"
      break
    case '课程信息管理':
      deleteSql = 'delete from course where cno like ' + "'" + body.no + "'"
      break
    case '教职工信息管理':
      deleteSql = 'delete from teacher where tno like ' + "'" + body.no + "'"
      break
    case '选课及成绩管理':
      deleteSql = 'delete from score where sno like ' + "'" + body.no + "'"
      break
  }
  mysql.query (deleteSql, [], function (result, fields) {
    res.json({correct_code:3})
  })
})

router.post('/query', function (req, res) {
  var body = req.body
  var selectSql
  switch (body.query) {
    case 'b1':
      selectSql = 'select * from student where sno like ' + "'" + body.no + "'" + 'or dno like' + "'" + body.no + "'" + 'or sname like' + "'" + body.no + "'"
      break
    case 'b2':
      selectSql = 'select * from teacher where tno like ' + "'" + body.no + "'" + 'or dno like' + "'" + body.no + "'" + 'or tname like' + "'" + body.no + "'"
      break
    case 'b3':
      selectSql = 'select * from department where dno like ' + "'" + body.no + "'" + 'or dname like' + "'"
      break  
    case 'b4':
      selectSql = 'select * from course where cno like ' + "'" + body.no + "'" + 'or tno like' + "'" + body.no + "'" + 'or cname like' + "'" + body.no + "'"
      break  
    case 'b5':
      selectSql = 'select student.sno,dno,course.cno,tno,daily_grade,test_score,total_mark from student,course,score where score.cno = course.cno and student.sno = score.sno and student.sno like ' + "'" + body.no + "'" + "order by total_mark,course.cno desc"
      break
  }
  mysql.query (selectSql, [], function (result, fields) {
    result = JSON.stringify(result)
    result = JSON.parse(result)
    res.json({correct_code:4,result:result})
  })
})

router.post('/print', function (req, res) {
  var body = req.body
  var selectSql = 'select course.cno,cname,tno,dno,period,credit,student.sno,sname,daily_grade,test_score,total_mark from course,student,score where course.cno = score.cno and student.sno = score.sno and dno like' + "'" + body.dno + "'" + 'order by course.cno'
  mysql.query (selectSql, [], function (result, fields) {
    result = JSON.stringify(result)
    result = JSON.parse(result)
    res.json({correct_code:4,result:result})
  })
})