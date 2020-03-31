<template>
  <div class="blogClassifyArticle">
    <ul class="articleUl">
      <li v-for="articleItem in articleList" :key='articleItem.articleID' class="articleLi">
        <h2 style="margin-top: 2%">{{ articleItem.title }}</h2>
        <div class="attr">
          <i class="el-icon-date"></i>
          <span style="margin: 0 50px 0 5px">{{ articleItem.date }}</span>
          <img src="../../assets/tag.png" style="width: 16px">
          <router-link @click="load" class="articleTag" :to="{path: '/blog/classifyArticle/' + item}" v-for="item in articleItem.tag" :key='item'>
            <span @click="load">{{ item }}</span>
          </router-link>
        </div>
        <div style="margin-top: 4%">
          <span>前言：{{ articleItem.preface }}</span>
        </div>
        <router-link :to="{path: '/blog/article/' + articleItem.articleID}">
          <el-button style="margin-top: 4%">
            阅读全文
            <i class="el-icon-arrow-right"></i>
          </el-button>
        </router-link>
        <hr style="width: 100%; margin-top: 2%">
      </li>
    </ul>
  </div>
</template>

<script>
// export default 只是为了导出，类似 new Vue()
export default {
  name: 'blogClassifyArticle',
  inject: ['reload'],
  data () {
    return {
      articleList: []
    }
  },
  methods: {
    load () {
      this.axios.post('http://47.103.15.224:8080/api/backstage/classify', {
        tag: this.$route.params.classifyType
      })
        .then(res => {
          this.articleList = []
          // 通过 reverse() 将新写的博客放前面
          res.data.result = res.data.result.reverse()
          for (let key in res.data.result) {
            res.data.result[key].tag = res.data.result[key].tag.split(',')
            res.data.result[key].date = res.data.result[key].date.slice(0, 10)
            // 必须要用 push 才能触发 vue 刷新机制
            this.articleList.push(res.data.result[key])
          }
          // 接收到数据后页面重载
          this.reload()
        })
    }
  },
  // 页面完全渲染后执行该生命周期函数
  mounted () {
    this.axios.post('http://47.103.15.224:8080/api/backstage/classify', {
      tag: this.$route.params.classifyType
    })
      .then(res => {
        this.articleList = []
        // 通过 reverse() 将新写的博客放前面
        res.data.result = res.data.result.reverse()
        for (let key in res.data.result) {
          res.data.result[key].tag = res.data.result[key].tag.split(',')
          res.data.result[key].date = res.data.result[key].date.slice(0, 10)
          // 必须要用 push 才能触发 vue 刷新机制
          this.articleList.push(res.data.result[key])
        }
      })
  }
}
</script>

<style scoped>
.attr {
  margin-top: 2%;
  /* 水平垂直居中 */
  display: flex;
  align-items: center;
  justify-content: center;
}
.articleUl {
  margin-left: 10%;
  width: 80%;
  list-style-type: none;
  /* 文字水平居中 */
  text-align: center;
}
.articleLi {
  /* 文字水平居中 */
  text-align: center;
}
.articleTag {
  margin: 0 5px 0 5px;
  /* 设置椭圆背景 */
  width: 40px;
  height: 16px;
  border-radius: 10px;
  background-color: black;
  /* 设置字体 */
  color: white;
  font-size: 12px;
    /* 水平垂直居中 */
  display: flex;
  align-items: center;
  justify-content: center;
  /* 隐藏下划线 */
  text-decoration:none;
}
</style>
