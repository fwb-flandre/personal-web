<template>
  <div class="hello">
    <div v-for="articleItem in articleList" :key='articleItem.articleID'>
      <div class="manageDiv">
        <span style="margin-left: 20px">{{ articleItem.title }}</span>
        <div style="margin-left: auto; margin-right: 20px">
          <router-link :to="{path: '/backstage/edit' + articleItem.articleID}" style="text-decoration:none">
            <span style="margin-right: 20px" class="manageSpan">编辑</span>
          </router-link>
          <span class="manageSpan" @click="del(articleItem.articleID)">删除</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// export default 只是为了导出，类似 new Vue()
export default {
  name: 'hello',
  data () {
    return {
      articleList: [],
      correctCode: ''
    }
  },
  watch: {
    correctCode (newName, oldName) {
      switch (this.correctCode) {
        case 1:
          this.$message.success('删除成功')
          this.correctCode = ''
          break
      }
    }
  },
  methods: {
    del (ID) {
      this.axios.post('http://47.103.15.224:8080/api/backstage/delete', {
        articleID: ID
      })
        .then(res => {
          this.correctCode = res.data.correctCode
          this.update()
        })
    },
    update () {
      this.axios.get('http://47.103.15.224:8080/api/backstage/article', {})
        .then(res => {
          this.articleList = []
          for (let key in res.data.result) {
            res.data.result[key].tag = res.data.result[key].tag.split(',')
            res.data.result[key].date = res.data.result[key].date.slice(0, 10)
            // 必须要用 push 才能触发 vue 刷新机制
            this.articleList.push(res.data.result[key])
          }
        })
    }
  },
  // 页面完全渲染后执行该生命周期函数
  mounted () {
    this.update()
  }
}
</script>

<style scoped>
.manageDiv {
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
.manageSpan {
  cursor: pointer;
  color: blue;
}
</style>
