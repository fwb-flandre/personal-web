<template>
  <div class="hello">
    <transition name = "fade">
      <div class="mask" v-show ="loginVisible">
        <div class="loginBox" v-show ="loginVisible">
          <p class="loginText">{{ loginText }}</p>
          <div class="line"></div>
          <el-form ref="form" :model="form" label-width="80px" v-bind:style="formStyle">
            <el-form-item label="用户名:" >
              <el-input v-model="form.name" placeholder="请输入用户名" clearable style="width: 90%"></el-input>
            </el-form-item>
            <el-form-item label="密码:">
              <el-input v-model="form.password" placeholder="请输入密码" clearable style="width: 90%" type="password"></el-input>
            </el-form-item>
            <el-form-item label="重输密码:" v-show="passwordVisible">
              <el-input v-model="form.passwordConfirm" placeholder="请重新输入密码" clearable style="width: 90%" type="password"></el-input>
            </el-form-item>
            <el-button type="primary" size="medium" round @click="confirm" style="margin-left:23%">确认</el-button>
            <el-button style="margin-left: 25%" size="medium" round @click="quit" class="button">退出</el-button>
          </el-form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
// export default 只是为了导出，类似 new Vue()
export default {
  name: 'loginBox',
  // 通过 props 接受父组件中传入的数据
  props: {
    loginApi: {
      type: String
    },
    registerApi: {
      type: String
    }
  },
  data () {
    return {
      loginVisible: false,
      passwordVisible: false,
      loginText: '登陆',
      formStyle: {
        margin: ''
      },
      form: {
        name: '',
        password: '',
        passwordConfirm: ''
      },
      errCode: '',
      correctCode: ''
    }
  },
  watch: {
    errCode (newName, oldName) {
      switch (this.errCode) {
        case 1:
          this.$message.error('用户名或密码不正确')
          this.errCode = ''
          break
        case 2:
          this.$message.error('用户名已存在')
          this.clearForm()
          this.errCode = ''
          break
      }
    },
    correctCode (newName, oldName) {
      switch (this.correctCode) {
        case 1:
          this.$emit('getName', this.form.name)
          this.$message.success('欢迎登陆,' + this.form.name)
          this.loginVisible = false
          this.registerVisible = false
          this.correctCode = ''
          break
      }
    }
  },
  methods: {
    clearForm () {
      this.form.name = ''
      this.form.password = ''
      this.form.passwordConfirm = ''
    },
    // 登陆与注册切换模块
    loginFun () {
      this.clearForm()
      this.loginVisible = true
      this.loginText = '登陆'
      this.passwordVisible = false
      this.formStyle.margin = '10%'
    },
    register () {
      this.clearForm()
      this.loginVisible = true
      this.loginText = '注册'
      this.passwordVisible = true
      this.formStyle.margin = '5%'
    },
    quit () {
      this.loginVisible = false
    },
    // 提交登陆信息模块
    confirm (loginApi, registerApi) {
      if (this.loginText === '注册') {
        if (this.form.password === '' || this.form.name === '') {
          this.$message.error('用户名或密码为空')
          return false
        }
        if (this.form.passwordConfirm === '') {
          this.$message.error('请再次输入密码')
          return false
        }
        if (this.form.password !== this.form.passwordConfirm) {
          this.$message.error('两次输入的密码不相同')
          this.clearForm()
          return false
        }
        this.axios.post(this.registerApi, {
          name: this.form.name,
          password: this.form.password
        })
          .then(res => {
            // this.$emit(arg1,arg2) arg1:方法名字，arg2:要传出的值
            this.$emit('getres', res)
            this.errCode = res.data.errCode
            this.correctCode = res.data.correctCode
          })
      }
      if (this.loginText === '登陆') {
        if (this.form.password === '' || this.form.name === '') {
          this.$message.error('用户名或密码为空')
          return false
        }
        this.axios.post(this.loginApi, {
          name: this.form.name,
          password: this.form.password
        })
          .then(res => {
            this.$emit('getres', res)
            this.errCode = res.data.errCode
            this.correctCode = res.data.correctCode
          })
      }
    }
  },
  // 页面完全渲染后执行该生命周期函数，挂载完成
  mounted () {
    // 在 document 中 this 指的是整个 html 而不是 vue
    let lett = this
    document.onkeydown = function (e) {
      if (lett.loginVisible === true) {
        var key = window.event.keyCode
        if (key === 13) {
          // 此方法是当按下enter键后要做的动作。
          lett.confirm()
        }
      }
    }
  },
  // 完成了 data 数据的初始化，el没有，dom 还未生成
  created () {
    // document.onkeydown = function (e) {
    //   console.log(this.loginVisible)
    //   if (this.loginVisible === true) {
    //     var key = window.event.keyCode
    //     if (key === 13) {
    //       //此方法是当按下enter键后要做的动作。
    //       console.log(111)
    //     }
    //   }
    // }
  }
}
</script>

<style>
/* 过渡 */
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.8s
}
.fade-enter, .fade-leave-to {
    opacity: 0
}
.mask {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  /* 使元素置顶 */
  z-index: 999;
}
.loginBox {
  width: 500px;
  height: 400px;
  background-color: SkyBlue;
  border-radius: 20px;
  /* 水平垂直居中 */
  margin: auto;
  position: absolute;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
}
.loginText {
  text-align: center;
  margin: 40px;
  font-size: 40px;
}
.line {
  width: 100%;
  height: 1px;
  margin: 0px auto;
  padding: 0px;
  background-color: #D5D5D5;
  overflow: hidden;
}
/* .el-button+.el-button {
  margin-left: 25%;
} */
</style>
