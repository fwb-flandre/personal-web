<template>
  <div class="detectPersonal">
    <div class="personalMessage">
      <div class="header">
        <img v-bind:src="personalImg" style="height: 100%; margin-left: 10px">
        <span style="margin-left: 10px">个人信息</span>
        <!-- margin-left: auto 使 flex 布局中元素右对齐 -->
        <span @click="edit()" class="edit">{{ editMessage }}</span>
      </div>
      <hr style="width: 100%; margin-top: 10px">
      <div v-show ="mainVisible" style="height:80%">
        <div class="mainLeft">
          <span style="margin-left: 10px">用户昵称：{{ personalForm.nickname }}</span>
        </div>
        <div class="mainRight">
          <span style="margin-left: 10px">手机号码：{{ personalForm.phoneNumber }}</span>
        </div>
        <div class="mainLeft">
          <span style="margin-left: 10px">电子邮箱：{{ personalForm.mailBox }}</span>
        </div>
        <div class="mainRight">
          <span style="margin-left: 10px">个人姓名：{{ personalForm.name }}</span>
        </div>
      </div>
      <div v-show ="!mainVisible" style="height:80%">
        <div class="mainLeft">
          <span style="margin-left: 10px">用户昵称：{{ personalForm.nickname }}</span>
        </div>
        <div class="mainRight">
          <span style="margin-left: 10px">手机号码：</span>
          <el-input v-model="personalForm.phoneNumber" style="width: 30%" size="mini"></el-input>
        </div>
        <div class="mainLeft">
          <span style="margin-left: 10px">电子邮箱：</span>
          <el-input v-model="personalForm.mailBox" style="width: 30%" size="mini"></el-input>
        </div>
        <div class="mainRight">
          <span style="margin-left: 10px">个人姓名：</span>
          <el-input v-model="personalForm.name" style="width: 30%" size="mini"></el-input>
        </div>
      </div>
    </div>
    <div class="classMessage">
      <div class="header">
        <i class="el-icon-message" style="height: 100%; margin-left: 10px"></i>
        <span style="margin-left: 10px">个人信息</span>
      </div>
      <hr style="width: 100%; margin-top: 10px">
      <div class="mainer" style="background-color: orange" onClick="window.open('/#/detect/overview/manage','_blank')">
        <div class="number">
          <span style="margin-left: 10%; font-size: 250%">{{ classNumber }}</span>
        </div>
        <div>
          <span style="margin-left: 10%">课堂数目</span>
        </div>
      </div>
      <div class="mainer" style="background-color: gray" onClick="window.open('/#/detect/overview/manage','_blank')">
        <div class="number">
          <span style="margin-left: 10%; font-size: 250%">{{ studentNumber }}</span>
        </div>
        <div>
          <span style="margin-left: 10%">学生数目</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// export default 只是为了导出，类似 new Vue()
export default {
  name: 'detectPersonal',
  data () {
    return {
      mainVisible: true,
      editMessage: '编辑',
      personalImg: require('../../assets/login_complete.png'),
      personalForm: {
        nickname: '',
        phoneNumber: '',
        mailBox: '',
        name: ''
      },
      classNumber: '',
      studentNumber: ''
    }
  },
  watch: {
    // 防止用户进入页面再输入信息
    '$store.state.manage.name': function () {
      this.loadPersonal()
      // console.log(this.$store.state.manage.name)
    }
  },
  methods: {
    edit () {
      this.mainVisible = !this.mainVisible
      if (this.editMessage === '保存') {
        this.axios.post('http://47.103.15.224:8080/api/detect/edit', {
          nickname: this.$store.state.manage.name,
          name: this.personalForm.name,
          phoneNumber: this.personalForm.phoneNumber,
          mailBox: this.personalForm.mailBox
        })
          .then(res => {
            this.loadPersonal()
          })
      }
      // 切换状态
      this.mainVisible === false ? this.editMessage = '保存' : this.editMessage = '编辑'
    },
    loadPersonal () {
      this.axios.post('http://47.103.15.224:8080/api/detect/loadPersonal', {
        nickname: this.$store.state.manage.name
      })
        .then(res => {
          this.personalForm.nickname = this.$store.state.manage.name
          this.personalForm.name = res.data.result[0].name
          this.personalForm.phoneNumber = res.data.result[0].phoneNumber
          this.personalForm.mailBox = res.data.result[0].mailBox
          this.loadClass()
        })
    },
    loadClass () {
      // console.log(this.$store.state.manage.name)
      this.axios.post('http://47.103.15.224:8080/api/detect/loadClass', {
        nickname: this.$store.state.manage.name
      })
        .then(res => {
          this.classNumber = res.data.result[0].num
        })
      this.axios.post('http://47.103.15.224:8080/api/detect/loadStudent', {
        nickname: this.$store.state.manage.name
      })
        .then(res => {
          this.studentNumber = res.data.result[0].num
        })
    }
  },
  // 页面完全渲染后执行该生命周期函数
  mounted () {
    this.loadPersonal()
    // 隐藏滚动条
    document.body.parentNode.style.overflowY = 'hidden'
  }
}
</script>

<style>
.detectPersonal {
  width: 100%;
  height: 100%;
}
.edit {
  margin-left: auto;
  font-size: 12px;
  cursor: pointer;
  color: blue;
}
.mainLeft {
  height: 20%;
  margin-top: 3%;
  width: 50%;
  float: left;
  /* 垂直居中 */
  display: flex;
  align-items: center;
}
.mainRight {
  height: 20%;
  margin-top: 3%;
  width: 50%;
  float: right;
  /* 垂直居中 */
  display: flex;
  align-items: center;
}
.header {
  margin-top: 10px;
  height: 10%;
  /* width: 100%; */
  /* 垂直居中 */
  display: flex;
  align-items: center;
}
.personalMessage {
  width: 80%;
  height: 20%;
}
.classMessage {
  width: 80%;
  height: 30%;
  margin-top: 5%;
}
.mainer {
  cursor: pointer;
  height: 70%;
  width: 30%;
  margin: 3% 0 3% 3%;
  float: left;
  border-radius: 10px;
}
.number {
  width: 100%;
  height: 65%;
  /* 垂直居中 */
  display: flex;
  align-items: center;
}
</style>
