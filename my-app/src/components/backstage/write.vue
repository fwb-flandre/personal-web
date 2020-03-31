<template>
  <div class="write">
    <el-form ref="form" :model="form" label-width="80px"  style="font-size:20px">
      <el-form-item label="标题：" class="test">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="标签：">
        <el-checkbox-group v-model="form.tag">
          <el-checkbox label="前端" name="type"></el-checkbox>
          <el-checkbox label="后台" name="type"></el-checkbox>
          <el-checkbox label="其他" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="前言：">
        <el-input v-model="form.preface"></el-input>
      </el-form-item>
    </el-form>
    <mavon-editor v-model="form.value" style="height: 60%"></mavon-editor>
    <el-button @click="submit" type="primary" style="margin: 5% 0 0 25%">提交</el-button>
    <el-button @click="reset" style="float:right; margin: 5% 25% 0 0">重置</el-button>
  </div>
</template>

<script>
// export default 只是为了导出，类似 new Vue()
export default {
  name: 'write',
  data () {
    return {
      form: {
        title: '',
        tag: [],
        preface: '',
        value: '',
        date: ''
      },
      correctCode: ''
    }
  },
  watch: {
    correctCode (newName, oldName) {
      switch (this.correctCode) {
        case 1:
          this.$message.success('添加成功')
          this.reset()
          this.correctCode = ''
          break
      }
    }
  },
  methods: {
    // 提交
    submit () {
      // 通过 toString() 将数组自动以 "," 分割形成字符串，而不用手工分割
      let tag = this.form.tag.join()
      // 获取当前时间
      let date = new Date()
      this.form.date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      this.axios.post('http://47.103.15.224:8080/api/backstage/submit', {
        title: this.form.title,
        tag: tag,
        preface: this.form.preface,
        value: this.form.value,
        date: this.form.date
      })
        .then(res => {
          this.correctCode = res.data.correctCode
        })
    },
    // 重置
    reset () {
      this.form.title = ''
      this.form.tag = []
      this.form.preface = ''
      this.form.value = ''
    }
  },
  // 页面完全渲染后执行该生命周期函数
  mounted () {
  }
}
</script>

<style>
/* 个性化 element 组件时需要取消 style 中的 scoped */
.el-form-item__label{
  font-size: 20px;
}
.write {
  width: 100%;
  height: 100%;
}
</style>
