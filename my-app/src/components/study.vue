<template>
  <div class="teach_manage">
    <div class="head">
      <el-button type="primary" @click="back_homepage()">返回首页</el-button>
      <span style="marginLeft:30%;fontSize:25px">{{title_msg}}</span>
      <el-button-group class="buttons" v-show="show_register" v-bind:style="buttons_style">
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
    <el-dropdown class="button1" @command="command1" v-show="button_visible10">
      <el-button type="primary">
        信息管理<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="a1">学生基本信息管理</el-dropdown-item>
        <el-dropdown-item command="a2">系的基本信息管理</el-dropdown-item>
        <el-dropdown-item command="a3">课程信息管理</el-dropdown-item>
        <el-dropdown-item command="a4">教职工信息管理</el-dropdown-item>
        <el-dropdown-item command="a5">选课及成绩管理</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dropdown class="button1"  @command="command2" v-show="button_visible1">
      <el-button type="primary">
        信息查询<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="b1">查询学生基本信息</el-dropdown-item>
        <el-dropdown-item command="b2">查询教职工基本信息</el-dropdown-item>
        <el-dropdown-item command="b3">查询系的基本信息</el-dropdown-item>
        <el-dropdown-item command="b4">查询课程基本信息</el-dropdown-item>
        <el-dropdown-item command="b5">查询学生成绩</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-button type="primary" class="button1" v-show="button_visible1" @click="print()">打印信息</el-button>
    <!-- 控制表单为输入还是修改 -->
    <el-button type="primary" style="marginLeft:12%;marginTop:2%" v-show="button_visible2" @click="input(true)">输入</el-button>
    <el-button type="primary" style="marginLeft:12%" v-show="button_visible2" @click="input(false)">修改</el-button>
    <el-button type="primary" style="marginLeft:12%" v-show="button_visible2" @click="delect()">删除</el-button>
    <el-button type="primary" style="marginLeft:12%;marginBottom:2%" @click="exit()">退出系统</el-button>
    <el-dialog
      title="请输入信息"
      :visible.sync="dialog_visible1"
      width="30%">
      <el-form ref="form1" :model="form1" label-width="80px">
        <el-form-item label="学号:">
          <el-input v-model="form1.sno" clearable></el-input>
        </el-form-item>
        <el-form-item label="学生姓名:">
          <el-input v-model="form1.sname" clearable></el-input>
        </el-form-item>
        <el-form-item label="性别:">
          <el-input v-model="form1.ssex" clearable></el-input>
        </el-form-item>
        <el-form-item label="生日:">
          <el-input v-model="form1.sbirthday" clearable></el-input>
        </el-form-item>
        <el-form-item label="入学成绩:">
          <el-input v-model="form1.adm_score" clearable></el-input>
        </el-form-item>
        <el-form-item label="系号:">
          <el-input v-model="form1.dno" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog_visible1 = false">取 消</el-button>
        <el-button type="primary" @click="confirm1()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="请输入信息"
      :visible.sync="dialog_visible2"
      width="30%">
      <el-form ref="form2" :model="form2" label-width="80px">
        <el-form-item label="系号:">
          <el-input v-model="form2.dno" clearable></el-input>
        </el-form-item>
        <el-form-item label="系名:">
          <el-input v-model="form2.dname" clearable></el-input>
        </el-form-item>
        <el-form-item label="简介:">
          <el-input v-model="form2.synopsis" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog_visible2 = false">取 消</el-button>
        <el-button type="primary" @click="confirm2()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="请输入信息"
      :visible.sync="dialog_visible3"
      width="30%">
      <el-form ref="form3" :model="form3" label-width="80px">
        <el-form-item label="课程号:">
          <el-input v-model="form3.cno" clearable></el-input>
        </el-form-item>
        <el-form-item label="课程名称:">
          <el-input v-model="form3.cname" clearable></el-input>
        </el-form-item>
        <el-form-item label="教师号:">
          <el-input v-model="form3.tno" clearable></el-input>
        </el-form-item>
        <el-form-item label="学时:">
          <el-input v-model="form3.period" clearable></el-input>
        </el-form-item>
        <el-form-item label="学分:">
          <el-input v-model="form3.credit" clearable></el-input>
        </el-form-item>
        <el-form-item label="上课时间:">
          <el-input v-model="form3.ctime" clearable></el-input>
        </el-form-item>
        <el-form-item label="上课地点:">
          <el-input v-model="form3.cplace" clearable></el-input>
        </el-form-item>
        <el-form-item label="考试时间:">
          <el-input v-model="form3.exam_time" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog_visible3 = false">取 消</el-button>
        <el-button type="primary" @click="confirm3()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="请输入信息"
      :visible.sync="dialog_visible4"
      width="30%">
      <el-form ref="form4" :model="form4" label-width="80px">
        <el-form-item label="教职工号:">
          <el-input v-model="form4.tno" clearable></el-input>
        </el-form-item>
        <el-form-item label="姓名:">
          <el-input v-model="form4.tname" clearable></el-input>
        </el-form-item>
        <el-form-item label="性别:">
          <el-input v-model="form4.tsex" clearable></el-input>
        </el-form-item>
        <el-form-item label="生日:">
          <el-input v-model="form4.tbirthday" clearable></el-input>
        </el-form-item>
        <el-form-item label="系号:">
          <el-input v-model="form4.dno" clearable></el-input>
        </el-form-item>
        <el-form-item label="职称:">
          <el-input v-model="form4.title" clearable></el-input>
        </el-form-item>
        <el-form-item label="专业:">
          <el-input v-model="form4.major" clearable></el-input>
        </el-form-item>
        <el-form-item label="方向:">
          <el-input v-model="form4.direction" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog_visible4 = false">取 消</el-button>
        <el-button type="primary" @click="confirm4()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="请输入信息"
      :visible.sync="dialog_visible6"
      width="30%">
      <el-form ref="form6" :model="form6" label-width="80px">
        <el-form-item label="学号:">
          <el-input v-model="form6.sno" clearable></el-input>
        </el-form-item>
        <el-form-item label="课程号:">
          <el-input v-model="form6.cno" clearable></el-input>
        </el-form-item>
        <el-form-item label="平时成绩:">
          <el-input v-model="form6.daily_grade" clearable></el-input>
        </el-form-item>
        <el-form-item label="考试成绩:">
          <el-input v-model="form6.test_score" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog_visible6 = false">取 消</el-button>
        <el-button type="primary" @click="confirm6()">确 定</el-button>
      </span>
    </el-dialog>
    <el-table
      :data="information"
      stripe
      style="width: 100%"
      v-show="table_visible">
      <el-table-column
        prop="cno"
        label="课程号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="cname"
        label="课程名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="sno"
        label="学号">
      </el-table-column>
      <el-table-column
        prop="sname"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="tno"
        label="任课教师号">
      </el-table-column>
      <el-table-column
        prop="period"
        label="学时">
      </el-table-column>
      <el-table-column
        prop="credit"
        label="学分">
      </el-table-column>
      <el-table-column
        prop="daily_grade"
        label="平时成绩">
      </el-table-column>
      <el-table-column
        prop="test_score"
        label="考试成绩">
      </el-table-column>
      <el-table-column
        prop="total_mark"
        label="总评成绩">
      </el-table-column>
    </el-table>
    <el-table
      :data="information1"
      stripe
      style="width: 100%"
      v-show="table_visible1">
      <el-table-column
        prop="sno"
        label="学号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="sname"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="ssex"
        label="性别">
      </el-table-column>
      <el-table-column
        prop="ssex"
        label="性别">
      </el-table-column>
      <el-table-column
        prop="sbirthday"
        label="出生日期">
      </el-table-column>
      <el-table-column
        prop="dno"
        label="系号">
      </el-table-column>
    </el-table>
    <el-table
      :data="information2"
      stripe
      style="width: 100%"
      v-show="table_visible2">
      <el-table-column
        prop="tno"
        label="教职工号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="tname"
        label="性名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="tsex"
        label="性别"
        width="180">
      </el-table-column>
      <el-table-column
        prop="tbirthday"
        label="出生日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="dno"
        label="系名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="title"
        label="职称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="major"
        label="专业"
        width="180">
      </el-table-column>
      <el-table-column
        prop="direction"
        label="方向">
      </el-table-column>
    </el-table>
    <el-table
      :data="information3"
      stripe
      style="width: 100%"
      v-show="table_visible3">
      <el-table-column
        prop="dno"
        label="系号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="dname"
        label="系名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="synopsis"
        label="简介">
      </el-table-column>
    </el-table>
    <el-table
      :data="information4"
      stripe
      style="width: 100%"
      v-show="table_visible4">
      <el-table-column
        prop="cno"
        label="课程号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="cname"
        label="课程名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="tno"
        label="教职工号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="period"
        label="学时"
        width="180">
      </el-table-column>
      <el-table-column
        prop="credit"
        label="学分"
        width="180">
      </el-table-column>
      <el-table-column
        prop="ctime"
        label="上课时间"
        width="180">
      </el-table-column>
      <el-table-column
        prop="cplace"
        label="上课地点"
        width="180">
      </el-table-column>
      <el-table-column
        prop="exam_time"
        label="考试时间">
      </el-table-column>
    </el-table>
    <el-table
      :data="information5"
      stripe
      style="width: 100%"
      v-show="table_visible5">
      <el-table-column
        prop="sno"
        label="学号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="dno"
        label="系号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="cno"
        label="课程号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="tno"
        label="教职工号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="daily_grade"
        label="平时成绩"
        width="180">
      </el-table-column>
      <el-table-column
        prop="test_score"
        label="考试成绩"
        width="180">
      </el-table-column>
      <el-table-column
        prop="total_mark"
        label="总评成绩">
      </el-table-column>
    </el-table>
    <!-- 过渡动画 -->
    <transition name = "fade">
      <div class="login_box" v-show ="show_login">
        <p class="login_text">{{ msg }}</p>
        <div class="line"></div>
        <el-form ref="form" :model="form" label-width="80px" v-bind:style="form_style">
          <!-- 权限限制 -->
          <el-radio v-model="radio" label="1">学生</el-radio>
          <el-radio v-model="radio" label="2">教职工</el-radio>
          <el-form-item v-bind:label="name_msg">
            <el-input v-model="form.name" placeholder="请输入用户名" clearable class="input"></el-input>
          </el-form-item>
          <el-form-item label="密码:">
            <el-input v-model="form.password" placeholder="请输入密码" clearable class="input" type="password"></el-input>
          </el-form-item>
          <el-form-item label="重输密码:" v-show="show_password">
            <el-input v-model="form.password_confirm" placeholder="请重新输入密码" clearable class="input" type="password"></el-input>
          </el-form-item>
          <el-button type="primary" size="medium" round @click="confirm" class="button">确认</el-button>
          <el-button size="medium" round @click="quit" class="button" style="marginLeft:25%">退出</el-button>
        </el-form>
      </div>
    </transition>
  </div>
</template>

<script>
// export default 只是为了导出，类似 new Vue()
export default {
  name: 'teach_manage',
  data () {
    return {
      title_msg: '',
      msg: '',
      name_msg: '学生号',
      login_msg: '',
      show_login: false,
      button_visible10: true,
      button_visible1: true,
      button_visible2: false,
      dialog_visible: false,
      dialog_visible1: false,
      dialog_visible2: false,
      dialog_visible3: false,
      dialog_visible4: false,
      dialog_visible5: false,
      dialog_visible6: false,
      query: '',
      input_flag: false,
      information: [],
      information1: [],
      information2: [],
      information3: [],
      information4: [],
      information5: [],
      table_visible: false,
      table_visible1: false,
      table_visible2: false,
      table_visible3: false,
      table_visible4: false,
      table_visible5: false,
      show_password: false,
      show_register: true,
      err_code: '',
      correct_code: '',
      radio: '2',
      // 解决动态绑定 src 路径问题
      login_img: require('../assets/login_complete.png'),
      form: {
        name: '',
        password: '',
        password_confirm: ''
      },
      form1: {
        sno: '',
        sname: '',
        ssex: '',
        sbirthday: '',
        adm_score: '',
        dno: ''
      },
      form2: {
        dno: '',
        dname: '',
        synopsis: ''
      },
      form3: {
        cno: '',
        cname: '',
        tno: '',
        period: '',
        credit: '',
        ctime: '',
        cplace: '',
        exam_time: ''
      },
      form4: {
        tno: '',
        tname: '',
        tsex: '',
        tbirthday: '',
        dno: '',
        title: '',
        major: '',
        direction: ''
      },
      form6: {
        sno: '',
        cno: '',
        daily_grade: '',
        test_score: ''
      },
      form_style: {
        margin: ''
      },
      img_style: {
        display: 'none'
      },
      buttons_style: {
        marginLeft: ''
      }
    }
  },
  // 页面完全渲染后执行该生命周期函数
  mounted () {
    // 实现记录登录状态，自动登录
    this.axios.get('http://47.103.15.224:8080/api/collector/check_landing', {
    })
      .then(response => {
        this.err_code = response.data.err_code
        this.correct_code = response.data.correct_code
        this.form.name = response.data.name
      })
  },
  watch: {
    err_code (newName, oldName) {
      switch (this.err_code) {
        case 1:
          this.$message.error('用户名或密码不正确')
          this.err_code = ''
          break
        case 2:
          this.$message.error('已存在')
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
          console.log(this.radio)
          if (this.radio === '2') {
            this.button_visible10 = true
          }
          if (this.radio === '1') {
            this.button_visible10 = false
          }
          break
        case 2:
          this.$message.success('添加成功')
          this.correct_code = ''
          break
        case 3:
          this.$message.success('删除成功')
          this.correct_code = ''
          break
        case 4:
          this.$message.success('查询成功')
          this.correct_code = ''
          break
        case 5:
          this.$message.success('修改成功')
          this.correct_code = ''
          break
      }
    },
    radio (newName, oldName) {
      switch (this.radio) {
        case '1':
          this.name_msg = '学生号'
          break
        case '2':
          this.name_msg = '教职工号'
          break
      }
    }
  },
  methods: {
    print () {
      this.$prompt('请输入系号', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.axios.post('http://47.103.15.224:8080/api/teach_manage/print', {
          dno: value
        })
          .then(response => {
            this.title_msg = '成绩登记表'
            this.err_code = response.data.err_code
            this.correct_code = response.data.correct_code
            this.information = []
            for (let key in response.data.result) {
              // 必须要用 push 才能触发 vue 刷新机制
              this.information.push(response.data.result[key])
            }
            console.log(this.information)
            this.table_visible = true
          })
      }).catch(() => {
        // 取消后进行的操作
      })
    },
    // 显示查询窗口
    querys () {
      this.table_visible = false
      this.table_visible1 = false
      this.table_visible2 = false
      this.table_visible3 = false
      this.table_visible4 = false
      this.table_visible5 = false
      this.$prompt('请输入预查询的号码对应的信息', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.axios.post('http://47.103.15.224:8080/api/teach_manage/query', {
          no: value,
          query: this.query
        })
          .then(response => {
            this.err_code = response.data.err_code
            this.correct_code = response.data.correct_code
            switch (this.query) {
              case 'b1':
                this.title_msg = '查询学生基本信息'
                this.information1 = []
                for (let key in response.data.result) {
                  // 必须要用 push 才能触发 vue 刷新机制
                  this.information1.push(response.data.result[key])
                }
                this.table_visible1 = true
                break
              case 'b2':
                this.title_msg = '查询教职工基本信息'
                this.information2 = []
                for (let key in response.data.result) {
                  // 必须要用 push 才能触发 vue 刷新机制
                  this.information2.push(response.data.result[key])
                }
                this.table_visible2 = true
                break
              case 'b3':
                this.title_msg = '查询系基本信息'
                this.information3 = []
                for (let key in response.data.result) {
                  // 必须要用 push 才能触发 vue 刷新机制
                  this.information3.push(response.data.result[key])
                }
                this.table_visible3 = true
                break
              case 'b4':
                this.title_msg = '查询课程基本信息'
                this.information4 = []
                for (let key in response.data.result) {
                  // 必须要用 push 才能触发 vue 刷新机制
                  this.information4.push(response.data.result[key])
                }
                this.table_visible4 = true
                break
              case 'b5':
                this.title_msg = '查询学生成绩'
                this.information5 = []
                for (let key in response.data.result) {
                  // 必须要用 push 才能触发 vue 刷新机制
                  this.information5.push(response.data.result[key])
                }
                this.table_visible5 = true
                break
            }
          })
      }).catch(() => {
        // 取消后进行的操作
      })
    },
    // 退出页面
    exit () {
      window.open('about:blank', '_self').close()
    },
    // 删除页面
    delect () {
      this.$prompt('请输入预删除的号码对应的信息', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.axios.post('http://47.103.15.224:8080/api/teach_manage/delete', {
          no: value,
          title: this.title_msg
        })
          .then(response => {
            this.err_code = response.data.err_code
            this.correct_code = response.data.correct_code
          })
      }).catch(() => {
        // 取消后进行的操作
      })
    },
    input (flag) {
      if (flag === true) {
        this.input_flag = true
      } else {
        this.input_flag = false
      }
      switch (this.title_msg) {
        case '学生基本信息管理':
          this.dialog_visible1 = true
          break
        case '系的基本信息管理':
          this.dialog_visible2 = true
          break
        case '课程信息管理':
          this.dialog_visible3 = true
          break
        case '教职工信息管理':
          this.dialog_visible4 = true
          break
        case '选课及成绩管理':
          this.dialog_visible6 = true
          break
      }
    },
    confirm1 () {
      // this.dialog_visible1 = false
      if (this.form1.sno === '') {
        this.$message.error('学号为空')
        return false
      } else if (this.form1.sname === '') {
        this.$message.error('姓名为空')
        return false
      } else if (this.form1.dno === '') {
        this.$message.error('系号为空')
        return false
      }
      this.axios.post('http://47.103.15.224:8080/api/teach_manage/input1', {
        sno: this.form1.sno,
        sname: this.form1.sname,
        ssex: this.form1.ssex,
        sbirthday: this.form1.sbirthday,
        adm_score: this.form1.adm_score,
        dno: this.form1.dno,
        flag: this.input_flag
      })
        .then(response => {
          this.err_code = response.data.err_code
          this.correct_code = response.data.correct_code
          this.sno = ''
          this.sname = ''
          this.dno = ''
        })
    },
    confirm2 () {
      // this.dialog_visible1 = false
      if (this.form2.dno === '') {
        this.$message.error('系号为空')
        return false
      } else if (this.form2.dname === '') {
        this.$message.error('系名为空')
        return false
      }
      this.axios.post('http://47.103.15.224:8080/api/teach_manage/input2', {
        dno: this.form2.dno,
        dname: this.form2.dname,
        synopsis: this.form2.synopsis,
        flag: this.input_flag
      })
        .then(response => {
          this.err_code = response.data.err_code
          this.correct_code = response.data.correct_code
        })
    },
    confirm3 () {
      // this.dialog_visible1 = false
      if (this.form3.cno === '') {
        this.$message.error('课程号为空')
        return false
      } else if (this.form3.cname === '') {
        this.$message.error('课程名为空')
        return false
      } else if (this.form3.tno === '') {
        this.$message.error('教师号为空')
        return false
      }
      this.axios.post('http://47.103.15.224:8080/api/teach_manage/input3', {
        cno: this.form3.cno,
        cname: this.form3.cname,
        tno: this.form3.tno,
        period: this.form3.period,
        credit: this.form3.credit,
        ctime: this.form3.ctime,
        cplace: this.form3.cplace,
        exam_time: this.form3.exam_time,
        flag: this.input_flag
      })
        .then(response => {
          this.err_code = response.data.err_code
          this.correct_code = response.data.correct_code
          this.cno = ''
          this.cname = ''
          this.tno = ''
        })
    },
    confirm4 () {
      // this.dialog_visible1 = false
      if (this.form4.tno === '') {
        this.$message.error('教职工号为空')
        return false
      } else if (this.form4.tname === '') {
        this.$message.error('姓名为空')
        return false
      } else if (this.form4.dno === '') {
        this.$message.error('系号为空')
        return false
      }
      this.axios.post('http://47.103.15.224:8080/api/teach_manage/input4', {
        tno: this.form4.tno,
        tname: this.form4.tname,
        tsex: this.form4.tsex,
        tbirthday: this.form4.tbirthday,
        dno: this.form4.dno,
        title: this.form4.title,
        major: this.form4.major,
        direction: this.form4.direction,
        flag: this.input_flag
      })
        .then(response => {
          this.err_code = response.data.err_code
          this.correct_code = response.data.correct_code
          this.tno = ''
          this.tname = ''
          this.dno = ''
        })
    },
    confirm6 () {
      // this.dialog_visible1 = false
      if (this.form6.sno === '') {
        this.$message.error('学号为空')
        return false
      } else if (this.form6.cno === '') {
        this.$message.error('课程号为空')
        return false
      }
      this.form6.total_mark = 0.3 * this.form6.daily_grade + 0.7 * this.form6.test_score
      this.axios.post('http://47.103.15.224:8080/api/teach_manage/input6', {
        sno: this.form6.sno,
        cno: this.form6.cno,
        daily_grade: this.form6.daily_grade,
        test_score: this.form6.test_score,
        total_mark: this.form6.total_mark,
        flag: this.input_flag
      })
        .then(response => {
          this.err_code = response.data.err_code
          this.correct_code = response.data.correct_code
          this.sno = ''
          this.cno = ''
        })
    },
    back_homepage () {
      this.button_visible1 = true
      if (this.radio === '2') {
        this.button_visible10 = true
      }
      this.button_visible2 = false
      this.title_msg = ''
      this.table_visible = false
      this.table_visible1 = false
      this.table_visible2 = false
      this.table_visible3 = false
      this.table_visible4 = false
      this.table_visible5 = false
    },
    manage (command) {
      this.buttons_style.marginLeft = '30%'
      this.button_visible1 = false
      this.button_visible10 = false
      this.button_visible2 = true
      this.table_visible = false
      this.table_visible1 = false
      this.table_visible2 = false
      this.table_visible3 = false
      this.table_visible4 = false
      this.table_visible5 = false
    },
    command1 (command) {
      this.manage(command)
      switch (command) {
        case 'a1':
          this.title_msg = '学生基本信息管理'
          break
        case 'a2':
          this.title_msg = '系的基本信息管理'
          break
        case 'a3':
          this.title_msg = '课程信息管理'
          break
        case 'a4':
          this.title_msg = '教职工信息管理'
          break
        case 'a5':
          this.title_msg = '选课及成绩管理'
          break
      }
    },
    command2 (command) {
      this.query = command
      this.querys()
    },
    clear_form () {
      this.form.name = ''
      this.form.password = ''
      this.form.password_confirm = ''
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
        this.axios.post('http://47.103.15.224:8080/api/teach_manage/register', {
          name: this.form.name,
          password: this.form.password,
          radio: this.radio
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
        this.axios.post('http://47.103.15.224:8080/api/teach_manage/login', {
          name: this.form.name,
          password: this.form.password,
          radio: this.radio
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
  }
}
</script>

<style>
/* elemen-ui 元素需另开 style 进行编辑 */
/* 用于编辑栏扩大间隔 */
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
  height: 450px;
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
  /* 取消元素间间隔 */
  font-size: 0px;
  display: flex;
  justify-content: flex-start;
  width: 100%;
  height: 5%;
}
.buttons {
  margin-left: 47%;
  margin-top: 0%;
}
.button {
  margin-left: 25%;
}
/* .el-button+.el-button {
  margin-left: 25%;
} */
.el-radio {
  margin-left: 25%;
  margin-bottom: 5%;
}
.button1 {
  margin-top: 2%;
  margin-left: 10%;
}
</style>
