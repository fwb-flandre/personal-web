<template>
  <div class="detectManage">
    <el-dialog title="新建课堂" :visible.sync="formVisible" width="500px">
      <el-form ref="form" :model="newForm" label-width="80px" v-show="formVisible">
        <el-form-item label="学院名">
          <el-input v-model="newForm.collegeName"></el-input>
        </el-form-item>
        <el-form-item label="班级名">
          <el-input v-model="newForm.className"></el-input>
        </el-form-item>
        <el-form-item label="上课节数">
          <el-select v-model="newForm.pitchNumber" placeholder="请选择上课节数" style="width: 100%;">
            <el-option label="1,2节" value="1"></el-option>
            <el-option label="3,4节" value="3"></el-option>
            <el-option label="5节" value="5"></el-option>
            <el-option label="6,7节" value="6"></el-option>
            <el-option label="8,9节" value="8"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="添加时间">
          <el-date-picker type="date" placeholder="选择日期" v-model="newForm.time" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="课堂地点">
          <el-input v-model="newForm.place"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createClass">立即创建</el-button>
          <el-button @click="()=>{formVisible = false}">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <div v-show="createVisible">
      <div style="height: 25px">
        <span style="font-size: 15px">课堂管理</span>
        <div style="float:right; cursor: pointer; color: blue">
          <i class="el-icon-plus" style="margin-right: 10px"></i>
          <span @click="()=>{formVisible = true}" style="font-size: 10px; float:right">新建课堂</span>
        </div>
      </div>
      <hr style="width: 100%">
      <el-table
        :data="loadTable"
        style="width: 100%">
        <el-table-column label="课堂编号" prop="number" width="270px"></el-table-column>
        <el-table-column label="学院名" prop="collegeName" width="270px"></el-table-column>
        <el-table-column label="班级名" prop="className" width=270px></el-table-column>
        <el-table-column label="上课节数" prop="pitchNumber" width=270px></el-table-column>
        <el-table-column label="添加时间" prop="time" width=270px></el-table-column>
        <el-table-column label="课堂地点" prop="place" width=270px></el-table-column>
        <el-table-column fixed="right" label="操作" width=100px>
          <template slot-scope="scope">
            <el-button @click="examine(scope.row.number)" type="text" size="small">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="!createVisible">
      <div style="height: 25px">
        <span @click="()=>{createVisible = true}" style="cursor: pointer; color: blue">返回</span>
        <div @click="delectClass()" style="float:right; cursor: pointer; color: blue">
          <i class="el-icon-minus" style="margin-right: 10px"></i>
          <span style="font-size: 10px; float:right">删除课堂</span>
        </div>
      </div>
      <hr style="width: 100%">
      <el-table
        :data="examineTable"
        style="width: 100%">
        <el-table-column label="照片" width="325px">
          <!-- 通过 scope 获取表格内数据 -->
          <template slot-scope="scope">
            <viewer>
              <img :src="scope.row.img" class="head_pic" style="width: 325px"/>
            </viewer>
          </template>
        </el-table-column>
        <el-table-column label="学生姓名" prop="name" width="325px"></el-table-column>
        <el-table-column label="学号" prop="sno" width=325px></el-table-column>
        <el-table-column label="时间" prop="time" width=325px></el-table-column>
        <el-table-column label="手机号" prop="phoneNumber" width=325px></el-table-column>
        <el-table-column fixed="right" label="操作" width=100px>
          <!-- <template slot-scope="scope">
            <el-button @click="examine()" type="text" size="small">删除</el-button>
          </template> -->
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
// export default 只是为了导出，类似 new Vue()
export default {
  name: 'detectManage',
  data () {
    return {
      errCode: '',
      correctCode: '',
      createVisible: true,
      formVisible: false,
      number: '',
      newForm: {
        collegeName: '',
        className: '',
        pitchNumber: '',
        time: '',
        place: ''
      },
      loadTable: [],
      examineTable: []
    }
  },
  watch: {
    // 防止用户进入页面再输入信息
    '$store.state.manage.name': function () {
      this.load()
    },
    errCode (newName, oldName) {
      switch (this.errCode) {
        case 1:
          this.$message.error('用户名或密码不正确')
          this.errCode = ''
          break
        case 2:
          this.$message.error('用户名已存在')
          this.errCode = ''
          break
      }
    },
    correctCode (newName, oldName) {
      switch (this.correctCode) {
        case 1:
          this.$message.success('添加成功')
          this.load()
          this.correctCode = ''
          break
        case 2:
          this.$message.success('删除成功')
          this.createVisible = true
          this.load()
          this.correctCode = ''
          break
        case 3:
          this.$message.success('删除成功')
          this.createVisible = true
          this.load()
          this.correctCode = ''
          break
      }
    }
  },
  methods: {
    load () {
      this.axios.post('http://47.103.15.224:8080/api/detect/load', {
        name: this.$store.state.manage.name
      })
        .then(response => {
          this.loadTable = []
          for (let key in response.data.result) {
            // 处理数据库传来的属性
            let time = new Date(response.data.result[key].time)
            response.data.result[key].time = this.getTime(time)
            response.data.result[key].pitchNumber = this.transfromClass(response.data.result[key].pitchNumber)
            // 必须要用 push 才能触发 vue 刷新机制
            this.loadTable.push(response.data.result[key])
          }
        })
    },
    examine (number) {
      this.createVisible = false
      this.number = number
      this.axios.post('http://47.103.15.224:8080/api/detect/examine', {
        number: number
      })
        .then(response => {
          this.examineTable = []
          for (let key in response.data.result) {
            // 必须要用 push 才能触发 vue 刷新机制
            this.examineTable.push(response.data.result[key])
          }
        })
    },
    delectClass () {
      this.$confirm('此操作将永久删除该课堂, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.post('http://47.103.15.224:8080/api/detect/delect', {
          number: this.number
        })
          .then(response => {
            this.errCode = response.data.errCode
            this.correctCode = response.data.correctCode
          })
      })
    },
    createClass () {
      let number = this.$tools.getTimeRandom()
      let time = this.getTime(this.newForm.time)
      this.axios.post('http://47.103.15.224:8080/api/detect/create', {
        name: this.$store.state.manage.name,
        number: number,
        collegeName: this.newForm.collegeName,
        className: this.newForm.className,
        pitchNumber: this.newForm.pitchNumber,
        time: time,
        place: this.newForm.place
      })
        .then(response => {
          this.errCode = response.data.errCode
          this.correctCode = response.data.correctCode
        })
    },
    transfromClass (pitchNumber) {
      switch (pitchNumber) {
        case 1:
          return '1,2节'
        case 3:
          return '3,4节'
        case 5:
          return '5节'
        case 6:
          return '6,7节'
        case 8:
          return '8,9节'
      }
    },
    getTime (time) {
      let date = time.getFullYear() + '-' + this.$tools.addZero(time.getMonth() + 1) + '-' + this.$tools.addZero(time.getDate())
      return date
    }
  },
  // 页面完全渲染后执行该生命周期函数
  mounted () {
    this.load()
    // 隐藏滚动条
    document.body.parentNode.style.overflowY = 'hidden'
  }
}
</script>

<style>
</style>
