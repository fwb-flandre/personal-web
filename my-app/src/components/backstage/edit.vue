<template>
  <div class="hello">
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
    <el-button @click="preserve" type="primary" style="margin: 5% 0 0 25%">保存</el-button>
    <el-button @click="reset" style="float:right; margin: 5% 25% 0 0">重置</el-button>
  </div>
</template>

<script>
// export default 只是为了导出，类似 new Vue()
export default {
  name: 'hello',
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
          this.$message.success('编辑成功')
          this.correctCode = ''
          this.$router.push({ path: '/backstage/manage' })
          break
      }
    }
  },
  methods: {
    preserve () {
      let tag = ''
      for (let key in this.form.tag) {
        tag = tag + this.form.tag[key] + ','
      }
      this.axios.post('http://47.103.15.224:8080/api/backstage/preserve', {
        articleID: this.$route.params.articleID,
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
    this.axios.post('http://47.103.15.224:8080/api/backstage/article', {
      articleID: this.$route.params.articleID
    })
      .then(res => {
        this.$set(this.form, 'title', res.data.result[0].title)
        this.$set(this.form, 'tag', res.data.result[0].tag.split(','))
        this.$set(this.form, 'preface', res.data.result[0].preface)
        this.$set(this.form, 'value', res.data.result[0].value)
      })
  }
}
</script>
