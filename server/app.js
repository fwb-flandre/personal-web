var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var session = require('express-session')
var cookieParser = require('cookie-parser')
var Store = require('express-mysql-session')
var router = require('./router')
var database = require('./models/mysql.config')// 引入数据库配置模块中的数据

var app = express()

//设置跨域访问
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

// 设置静态文件目录
app.use('/public/', express.static(path.join(__dirname, './public/')))
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))

// 使用模板引擎，当渲染以html后缀名的文件时,使用art-template模板引擎渲染
app.engine('html', require('express-art-template'))

// 用于修改渲染页面的路径，默认就是 ./views 目录
app.set('views', path.join(__dirname, './views/'))

// 配置解析表单 POST 请求体插件（注意：一定要在 app.use(router) 之前 ）
// parse application/x-www-form-urlencoded
// 设置 limit 是为了使 body 对象能装载更多的内容，默认为 100kb
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }))
// parse application/json
app.use(bodyParser.json({ limit: '50mb' }))
// 配置 Cookie-parser
app.use(cookieParser())

// 在 Express 这个框架中，默认不支持 Session 和 Cookie，需要引入 express-session
app.use(session({
  // 配置加密字符串，它会在原有加密基础之上和这个字符串拼起来去加密
  // 目的是为了增加安全性，防止客户端恶意伪造
  name: 'sid',
  secret: 'itcast',
  // 当用户session无变化的时候依然自动保存
  resave: false,
  // 默认为每一个用户一个 session_id
  saveUninitialized: true,
  store: new Store(database),
  cookie: {
    maxAge: 7*24*60*60*1000// 1周后过期
  },
  // 每次请求的时候覆写cookie，使过期时间延后
  rolling: true
}))

// 把路由挂载到 app 中
app.use(router)

// 配置一个处理 404 的中间件
// path参数为空，则默认为"/"
app.use(function (req, res) {
  res.render('404.html')
})

// 配置一个全局错误处理中间件
app.use(function (err, req, res, next) {
  res.status(500).json({
    err_code: 500,
    message: err.message
  })
})

app.listen(3000, function () {
  console.log('running...')
})
