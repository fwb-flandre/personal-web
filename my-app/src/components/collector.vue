<template>
  <div class="collector">
    <div class="head">
      <el-button type="primary" @click="back_homepage()">返回首页</el-button>
      <!-- 下拉框 -->
      <el-dropdown @command="select_command">
        <el-button type="primary">
          {{ drop_msg }}<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="1">百度搜索</el-dropdown-item>
          <el-dropdown-item command="2">谷歌搜索</el-dropdown-item>
          <el-dropdown-item command="3">网站收藏</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- 提交信息 -->
      <el-input placeholder="请输入信息" v-model="input" clearable @keyup.enter.native="postUrl" class="search"></el-input>
      <el-button-group class="buttons" v-show="show_register">
        <el-button type="primary" @click="login" icon="el-icon-arrow-left">登陆</el-button>
        <el-button type="primary" @click="register">注册<i class="el-icon-arrow-right el-icon--right"></i></el-button>
      </el-button-group>
      <!-- 图片下拉框的实现 -->
      <img ref="user_img" v-bind:src="login_img" v-popover:popover2 v-bind:style="img_style">
      <el-popover
        ref="popover2"
        placement="bottom"
        v-bind:title="'姓名：' + form.name"
        width="100"
        trigger="click"
        :disabled="show_register">
        <div style="text-align: center; margin: 0">
          <el-button type="primary" size="mini" @click="personal_center()">个人中心</el-button>
          <el-button type="text" size="mini" @click="user_quit()">退出</el-button>
        </div>
      </el-popover>
    </div>
    <!-- 显示收藏核心元素 -->
    <el-scrollbar style="height:95%">
      <div v-for="(item,index) in urls" :key='item'>
        <div class="collector_div">
          <div class="collector_left">
            <img v-bind:src="handle_img(item)">
            <a v-bind:href="item" target="_blank">{{urls_name[index]}}</a>
          </div>
          <el-button-group class="collector_button">
            <el-button type="text" icon="el-icon-edit" @click="edit(item, index)"></el-button>
            <el-button type="text" icon="el-icon-share" @click="copy()" class="share" v-bind:data-clipboard-text="item"></el-button>
            <el-button type="text" icon="el-icon-delete" @click="del(item)"></el-button>
          </el-button-group>
        </div>
      </div>
    </el-scrollbar>
    <transition name = "fade">
      <div class="login_box" v-show ="show_login">
        <p class="login_text">{{ msg }}</p>
        <div class="line"></div>
        <el-form ref="form" :model="form" label-width="80px" v-bind:style="form_style">
          <el-form-item label="用户名:">
            <el-input v-model="form.name" placeholder="请输入用户名" clearable class="input"></el-input>
          </el-form-item>
          <el-form-item label="密码:">
            <el-input v-model="form.password" placeholder="请输入密码" clearable class="input" type="password"></el-input>
          </el-form-item>
          <el-form-item label="重输密码:" v-show="show_password">
            <el-input v-model="form.password_confirm" placeholder="请重新输入密码" clearable class="input" type="password"></el-input>
          </el-form-item>
          <el-button type="primary" size="medium" round @click="confirm" class="button">确认</el-button>
          <el-button style="margin-left: 25%" size="medium" round @click="quit" class="button">退出</el-button>
        </el-form>
      </div>
    </transition>
  </div>
</template>

<script>
// export default 只是为了导出，类似 new Vue()
export default {
  name: 'collector',
  data () {
    return {
      msg: '',
      login_msg: '',
      input: '',
      drop_msg: '百度搜索',
      show_login: false,
      visible2: true,
      show_password: false,
      show_register: true,
      err_code: '',
      urls: [],
      urls_name: [],
      correct_code: '',
      // 解决动态绑定 src 路径问题
      login_img: require('../assets/login_complete.png'),
      form: {
        name: '',
        password: '',
        password_confirm: ''
      },
      form_style: {
        margin: ''
      },
      img_style: {
        display: 'none'
      }
    }
  },
  watch: {
    err_code (newName, oldName) {
      switch (this.err_code) {
        case 1:
          this.$message.error('用户名或密码不正确')
          this.err_code = ''
          break
        case 2:
          this.$message.error('用户名已存在')
          this.clear_form()
          this.err_code = ''
          break
        case 3:
          this.$message.error('收藏已存在')
          this.input = ''
          this.err_code = ''
          break
        case 4:
          this.$message.error('登陆后才可进行操作哦')
          this.input = ''
          this.err_code = ''
          break
      }
    },
    correct_code (newName, oldName) {
      switch (this.correct_code) {
        case 1:
          this.$message.success('欢迎登陆,' + this.form.name)
          this.img_style.display = 'block'
          this.img_style.marginLeft = '88%'
          this.show_login = false
          this.show_register = false
          this.correct_code = ''
          this.img_style.cursor = 'pointer'
          this.updata()
          break
        case 2:
          this.$message.success('收藏已添加')
          this.input = ''
          this.correct_code = ''
          break
        case 3:
          this.$message.success('删除成功')
          this.correct_code = ''
          break
        case 4:
          this.$message.success('修改成功')
          this.correct_code = ''
          break
      }
    }
  },
  methods: {
    clear_form () {
      this.form.name = ''
      this.form.password = ''
      this.form.password_confirm = ''
    },
    // 返回首页
    back_homepage () {
      window.location.href = 'http://47.103.15.224:8080/'
    },
    // 记录选择了哪项
    select_command (command) {
      switch (command) {
        case '1':
          this.drop_msg = '百度搜索'
          break
        case '2':
          this.drop_msg = '谷歌搜索'
          break
        case '3':
          this.drop_msg = '网站收藏'
          break
      }
    },
    // 更新模块
    updata () {
      this.axios.post('http://47.103.15.224:8080/api/collector/update', {
        name: this.form.name
      })
        .then(response => {
          this.err_code = response.data.err_code
          this.correct_code = response.data.correct_code
          this.urls = []
          for (let key in response.data) {
            // 必须要用 push 才能触发 vue 刷新机制
            this.urls.push(response.data[key].url)
            // 没有数据时要赋为 null 而不是 ''
            if (response.data[key].url_name === null) {
              this.urls_name[key] = this.urls[key]
            } else {
              this.urls_name[key] = response.data[key].url_name
            }
          }
        })
    },
    // 处理 url 后获得收藏夹图标
    handle_img (item) {
      let i = item.indexOf('/') + 2
      let middleware = item.substring(i)
      let j = middleware.indexOf('/')
      return 'http://statics.dnspod.cn/proxy_favicon/_/favicon?domain=' + item.substring(i, i + j)
    },
    // 用户退出
    user_quit () {
      this.urls = []
      this.show_register = true
      this.img_style.display = 'none'
      this.img_style.marginLeft = '93%'
      this.form.name = ''
      this.img_style.cursor = 'default'
      this.$message.success('退出成功')
    },
    // 用户中心
    personal_center () {
    },
    // 删除模块
    del (item) {
      this.$confirm('此操作将永久删除该收藏, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.post('http://47.103.15.224:8080/api/collector/delete', {
          name: this.form.name,
          url: item
        })
          .then(response => {
            this.err_code = response.data.err_code
            this.correct_code = response.data.correct_code
            this.updata()
          })
      }).catch(() => {
        // 取消后进行的操作
      })
    },
    // 复制模块
    copy () {
      var clipboard = new this.Clipboard('.share')
      clipboard.on('success', e => {
        this.$message.success('复制成功')
        // 释放内存
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        // 浏览器不支持复制
        this.$message.error('复制失败')
        // 释放内存
        clipboard.destroy()
      })
    },
    // 编辑模块
    edit (item, index) {
      this.$prompt('修改书签', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.axios.post('http://47.103.15.224:8080/api/collector/update_name', {
          name: this.form.name,
          url: item,
          url_name: value
        })
          .then(response => {
            this.err_code = response.data.err_code
            this.correct_code = response.data.correct_code
            this.updata()
          })
      }).catch(() => {
        // 取消后进行的操作
      })
    },
    // 提交信息模块
    postUrl () {
      switch (this.drop_msg) {
        case '网站收藏':
          if (this.input === '') {
            this.$message.error('请输入所要收藏的网址')
            return false
          }
          this.axios.post('http://47.103.15.224:8080/api/collector/url', {
            name: this.form.name,
            url: this.input
          })
            .then(response => {
              this.err_code = response.data.err_code
              this.correct_code = response.data.correct_code
              this.updata()
            })
          break
        case '百度搜索':
          window.open('https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd=' + this.input, '_blank')
          break
        case '谷歌搜索':
          window.open('https://www.google.com.hk/search?safe=strict&hl=zh-CN&ei=XWW8XZrFFqKGr7wP9qKSmAk&q=' + this.input, '_blank')
          break
      }
    },
    // 登陆与注册切换模块
    login () {
      this.clear_form()
      this.show_login = true
      this.msg = '登陆'
      this.show_password = false
      this.form_style.margin = '10%'
    },
    register () {
      this.clear_form()
      this.show_login = true
      this.msg = '注册'
      this.show_password = true
      this.form_style.margin = '5%'
    },
    // 提交登陆信息模块
    confirm () {
      if (this.msg === '注册') {
        if (this.form.password === '' || this.form.name === '') {
          this.$message.error('用户名或密码为空')
          return false
        }
        if (this.form.password_confirm === '') {
          this.$message.error('请再次输入密码')
          return false
        }
        if (this.form.password !== this.form.password_confirm) {
          this.$message.error('两次输入的密码不相同')
          this.clear_form()
          return false
        }
        this.axios.post('http://47.103.15.224:8080/api/collector/register', {
          name: this.form.name,
          password: this.form.password
        })
          .then(response => {
            this.err_code = response.data.err_code
            this.correct_code = response.data.correct_code
          })
      }
      if (this.msg === '登陆') {
        if (this.form.password === '' || this.form.name === '') {
          this.$message.error('用户名或密码为空')
          return false
        }
        this.axios.post('http://47.103.15.224:8080/api/collector/login', {
          name: this.form.name,
          password: this.form.password
        })
          .then(response => {
            this.err_code = response.data.err_code
            this.correct_code = response.data.correct_code
          })
      }
    },
    quit () {
      this.show_login = false
    }
  },
  // 页面完全渲染后执行该生命周期函数
  mounted () {
    // 背景置为白色
    document.body.parentNode.style.background = 'white'
    // 实现记录登录状态，自动登录
    this.axios.get('http://47.103.15.224:8080/api/collector/check_landing', {
    })
      .then(response => {
        this.err_code = response.data.err_code
        this.correct_code = response.data.correct_code
        this.form.name = response.data.name
      })
  }
}
</script>

<style scoped>
/* 过渡 */
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.8s
}
.fade-enter, .fade-leave-to {
    opacity: 0
}
.parent {
  height: 70px;
  width: 100%;
}
.login_box {
  width: 500px;
  height: 400px;
  background-color: grey;
  border-radius: 20px;
  /* 水平垂直居中 */
  margin: auto;
  position: absolute;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
}
.login_text {
  text-align: center;
  margin: 40px;
  font-size: 40px;
}
.head {
  /* 取消元素间间隔 */
  font-size: 0px;
}
.head img {
  position: absolute;
  top: 10px;
  width: 40px;
  margin-left: 93%;
  /* 鼠标变手型 */
  cursor: pointer;
}
.collector_div img {
  width: 20px;
  margin-left: 10%;
}
.line {
  width: 100%;
  height: 1px;
  margin: 0px auto;
  padding: 0px;
  background-color: #D5D5D5;
  overflow: hidden;
}
.collector_div {
  width: 95%;
  height: 50px;
  border-radius: 20px;
  margin: 20px;
  font-size: 20px;
  border: solid 1px #000;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.collector_div a {
  /* 去除下划线 */
  text-decoration:none;
  color:#000000;
  margin-left: 5px;
}
.collector_left {
  height: 30px;
  width: 200px;
  /* 收藏夹图片居中 */
  display: flex;
  align-items: center;
}
.collector {
  height: 100%;
}
.head {
  display: flex;
  justify-content: flex-start;
  width: 100%;
  height: 5%;
}

.collector_div .el-button-group>.el-button:not(:last-child) {
  margin-right: 30px;
}
.buttons {
  margin-left: 5%;
  margin-top: 1%;
}
.button {
  margin-left: 25%;
}
.el-dropdown {
  margin-top: 10px;
  margin-left: 7%;
}
.search{
  width: 60%;
  margin-top: 10px;
}
.collector_button {
  margin-right: 2%;
}
.el-popover__title {
  display: flex;
  justify-content:center;
}
/* 取消横向滚动条 */
.el-scrollbar__wrap {
  overflow-x: hidden;
  margin-top: 20px;
}
</style>
