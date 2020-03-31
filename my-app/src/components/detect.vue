<template>
  <div class="detect">
    <!-- 通过 ref 调用子组件中的方法 -->
    <!-- 通过绑定子组件的 props 中的属性向子组件传值  -->
    <!-- 通过绑定子组件的方法与父组件的属性接收子组件的值 -->
    <loginBox ref="loginBox" @getres="getres" @getName="getName" :loginApi="loginApi" :registerApi="registerApi"></loginBox>
    <el-container style="height: 937px; border: 1px solid #eee">
      <el-aside width="150px" style="background-color: rgb(238, 241, 246)">
        <el-menu :router=true :default-active="$route.name" class="el-menu-vertical-demo container">
          <el-submenu index="/detect/overview">
            <template slot="title">
              <span>总览</span>
            </template>
            <el-menu-item index="/detect/overview/manage">课堂管理</el-menu-item>
            <el-menu-item index="/detect/overview/personal">个人中心</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <span style="font-size: 20px">课堂纪律监控系统</span>
          <!-- float:right实现靠右 -->
          <span @click="()=>{this.$refs.loginBox.register()}" style="margin-right: 5%; float:right; font-size: 10px; cursor: pointer; color: blue" v-show=spanVisible>注册</span>
          <span @click="()=>{this.$refs.loginBox.loginFun()}" style="margin-right: 5%; float:right; font-size: 10px; cursor: pointer; color: blue" v-show=spanVisible>登陆</span>
          <span v-show="!spanVisible" v-popover:popover style="margin-right: 5%; float:right; cursor: pointer; color: blue">{{ name }}</span>
          <el-popover ref="popover" placement="bottom" :title="'姓名：' + name" width="100" trigger="click" :disabled="!personalVisible">
            <div style="text-align: center; margin: 0">
              <el-button type="primary" size="mini" onClick="window.open('/detect/overview/personal','_blank')">个人中心</el-button>
              <el-button type="text" size="mini" @click="userQuit()">退出</el-button>
            </div>
          </el-popover>
        </el-header>
        <el-main>
          <router-view style="width: 100%;height: 90%"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import loginBox from '@/components/common/loginBox'
// export default 只是为了导出，类似 new Vue()
export default {
  name: 'detect',
  components: {
    loginBox
  },
  data () {
    return {
      name: '111',
      spanVisible: true,
      personalVisible: true,
      loginApi: 'http://47.103.15.224:8080/api/detect/login',
      registerApi: 'http://47.103.15.224:8080/api/detect/register',
      errCode: '',
      correctCode: ''
    }
  },
  watch: {
    errCode (newName, oldName) {
      switch (this.errCode) {
        case 1:
          break
        case 2:
          break
      }
    },
    correctCode (newName, oldName) {
      switch (this.correctCode) {
        case 1:
          this.spanVisible = false
          this.load()
          this.correctCode = ''
          break
      }
    }
  },
  methods: {
    sendSms (phone) {
      this.axios.post('http://47.103.15.224:8080/api/detect/sms', {
        PhoneNumbers: phone
      })
        .then(res => {
          console.log(res)
        })
    },
    test () {
      // 不推荐使用
      this.$tools.sendSms('18402012536')
    },
    faceDetect () {
      let config = {
        headers: {'Content-Type': 'multipart/form-data'}
      }
      let domain = 'https://api-cn.faceplusplus.com/facepp/v3/detect'
      let formdata = this.$tools.faceFormdata('http://q5a530cvj.bkt.clouddn.com/fwb158219205900081.jpg')
      this.axios.post(domain, formdata, config).then(res => {
        console.log(res)
      })
        .catch(err => {
          console.log(err.res)
        })
    },
    userQuit () {
      this.spanVisible = true
      this.name = ''
      this.personalVisible = false
      this.$router.push({ path: '/detect' })
    },
    load () {
      if (location.href !== 'http://localhost:8080/#/detect/overview/personal') {
        this.$router.push({ path: '/detect/overview/manage' })
      }
    },
    getName (name) {
      this.name = name
      this.personalVisible = true
      // 改变 vuex 中保存的值
      this.$store.dispatch('modify', this.name)
    },
    getres (res) {
      this.errCode = res.data.errCode
      this.correctCode = res.data.correctCode
    }
  },
  // 页面完全渲染后执行该生命周期函数
  mounted () {
    // 隐藏滚动条
    document.body.parentNode.style.overflowY = 'hidden'
    // 实现记录登录状态，自动登录
    this.axios.get('http://47.103.15.224:8080/api/detect/checkLanding', {
    })
      .then(res => {
        this.name = res.data.name
        this.spanVisible = false
        this.$store.dispatch('modify', res.data.name)
      })
  }
}
</script>

<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
}
.el-aside {
  color: #333;
  /* 取消横向滚动条 */
  overflow-x: hidden;
}
</style>
