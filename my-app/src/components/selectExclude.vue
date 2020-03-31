<template>
  <div class="selectExclude">
    <loginBox ref="loginBox" @getres="getres" @getName="getName" :loginApi="loginApi" :registerApi="registerApi"></loginBox>
    <div class="head">
      <el-dropdown @command="selectCommand" style="margin-left: 15%">
        <el-button type="primary">
          {{ dropMsg }}<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="1">q q 搜索</el-dropdown-item>
          <el-dropdown-item command="2">微信搜索</el-dropdown-item>
          <el-dropdown-item command="3">奥比搜索</el-dropdown-item>
          <el-dropdown-item :disabled="spanVisible" command="3">q q 录入</el-dropdown-item>
          <el-dropdown-item :disabled="spanVisible" command="4">微信录入</el-dropdown-item>
          <el-dropdown-item :disabled="spanVisible" command="4">奥比录入</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-input placeholder="请输入信息" v-model="input" clearable @keyup.enter.native="postUrl" class="search"></el-input>
      <span @click="()=>{this.$refs.loginBox.loginFun()}" class="loginCss" v-show=spanVisible>登陆</span>
      <span v-show=!spanVisible v-popover:popover style="margin-left: 8%; font-size: 15px; cursor: pointer; color: blue">{{ name }}</span>
      <el-popover ref="popover" placement="bottom" :title="'姓名：' + name" width="100" trigger="click" :disabled=spanVisible>
        <div style="text-align: center; margin: 0">
          <el-button type="primary" size="mini" onClick="window.open('/detect/overview/personal','_blank')">个人中心</el-button>
          <el-button type="text" size="mini" @click="userQuit()">退出</el-button>
        </div>
      </el-popover>
    </div>
    <!-- 显示收藏核心元素 -->
    <el-scrollbar style="height:95%">
      <div v-for="item in selects" :key='item'>
        <div class="collectorDiv">
          <span style="margin-left: 2%;">{{ item }}</span>
          <el-button @click="edit(item)" style="margin-left: auto; margin-right: 2%" type="text" icon="el-icon-edit" v-show="!spanVisible"></el-button>
          <el-button @click="del(item)" style="margin-right: 2%" type="text" icon="el-icon-delete" v-show="!spanVisible"></el-button>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import loginBox from '@/components/common/loginBox'
// export default 只是为了导出，类似 new Vue()
export default {
  name: 'selectExclude',
  components: {
    loginBox
  },
  data () {
    return {
      name: '',
      selects: [],
      selectState: '',
      spanVisible: true,
      dropMsg: 'q q 搜索',
      input: '',
      loginApi: 'http://47.103.15.224:8080/api/selectExclude/login',
      registerApi: 'http://47.103.15.224:8080/api/selectExclude/register',
      errCode: '',
      correctCode: ''
    }
  },
  watch: {
    errCode (newName, oldName) {
      switch (this.errCode) {
        case 401:
          this.$message.error('搜索失败')
          this.errCode = ''
          break
        case 402:
          this.$message.error('编辑失败，数据库已有该数据')
          this.selects = []
          this.input = ''
          this.errCode = ''
          break
      }
    },
    correctCode (newName, oldName) {
      switch (this.correctCode) {
        case 101:
          this.$message.success('搜索成功')
          this.correctCode = ''
          break
        case 102:
          this.$message.success('输入成功')
          this.correctCode = ''
          break
        case 103:
          this.$message.success('删除成功')
          this.selects = []
          this.input = ''
          this.correctCode = ''
          break
        case 104:
          this.$message.success('编辑成功')
          this.selects = []
          this.input = ''
          this.correctCode = ''
          break
      }
    }
  },
  methods: {
    edit (item) {
      this.$prompt('修改信息', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.axios.post('http://47.103.15.224:8080/api/selectExclude/edit', {
          selectState: this.selectState,
          oldMessage: item,
          newMessage: value
        })
          .then(res => {
            this.errCode = res.data.errCode
            this.correctCode = res.data.correctCode
          })
      })
    },
    del (item) {
      this.axios.post('http://47.103.15.224:8080/api/selectExclude/delete', {
        message: item,
        selectState: this.selectState
      })
        .then(res => {
          this.errCode = res.data.errCode
          this.correctCode = res.data.correctCode
        })
    },
    // 记录选择了哪项
    selectCommand (command) {
      switch (command) {
        case '1':
          this.dropMsg = 'q q 搜索'
          break
        case '2':
          this.dropMsg = '微信搜索'
          break
        case '3':
          this.dropMsg = '奥比搜索'
          break
        case '4':
          this.dropMsg = 'q q 录入'
          break
        case '5':
          this.dropMsg = '微信录入'
          break
        case '6':
          this.dropMsg = '奥比录入'
          break
      }
    },
    postUrl () {
      switch (this.dropMsg) {
        case 'q q 搜索':
          this.axios.post('http://47.103.15.224:8080/api/selectExclude/qqSelect', {
            qID: this.input
          })
            .then(res => {
              this.selects = []
              this.errCode = res.data.errCode
              this.correctCode = res.data.correctCode
              for (let key in res.data.result) {
                // 必须要用 push 才能触发 vue 刷新机制
                this.selects.push(res.data.result[key].qID)
                this.selectState = 'qq'
              }
            })
          break
        case '微信搜索':
          this.axios.post('http://47.103.15.224:8080/api/selectExclude/weixinSelect', {
            wID: this.input
          })
            .then(res => {
              this.selects = []
              this.errCode = res.data.errCode
              this.correctCode = res.data.correctCode
              for (let key in res.data.result) {
                // 必须要用 push 才能触发 vue 刷新机制
                this.selects.push(res.data.result[key].wID)
                this.selectState = 'weixin'
              }
            })
          break
        case 'q q 输入':
          this.axios.post('http://47.103.15.224:8080/api/selectExclude/qqInput', {
            qID: this.input
          })
            .then(res => {
              this.errCode = res.data.errCode
              this.correctCode = res.data.correctCode
            })
          break
        case '微信输入':
          this.axios.post('http://47.103.15.224:8080/api/selectExclude/weixinInput', {
            wID: this.input
          })
            .then(res => {
              this.errCode = res.data.errCode
              this.correctCode = res.data.correctCode
            })
          break
      }
    },
    userQuit () {
      this.spanVisible = true
      this.name = ''
    },
    getName (name) {
      this.name = name
      this.spanVisible = false
    },
    getres (res) {
      // this.errCode = res.data.errCode
      // this.correctCode = res.data.correctCode
    }
  },
  // 页面完全渲染后执行该生命周期函数
  mounted () {
    // 隐藏滚动条
    document.body.parentNode.style.overflowX = 'hidden'
    document.body.parentNode.style.overflowY = 'hidden'
    // 实现记录登录状态，自动登录
    this.axios.get('http://47.103.15.224:8080/api/selectExclude/checkLanding', {
    })
      .then(res => {
        this.name = res.data.name
        this.spanVisible = false
      })
  }
}
</script>

<style scoped>
.collectorDiv {
  width: 95%;
  height: 50px;
  border-radius: 20px;
  margin: 20px;
  font-size: 20px;
  border: solid 1px #000;
  display: flex;
  align-items: center;
}
.selectExclude {
  width: 100%;
  height: 100%;
}
.head {
  width: 100%;
  height: 8%;
  font-size: 0px;
  display: flex;
  align-items: center;
}
.loginCss {
  margin-left: 8%;
  font-size: 10px;
  cursor: pointer;
  color: blue
}
.search{
  width: 60%;
}
</style>
