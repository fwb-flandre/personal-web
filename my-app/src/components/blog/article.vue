<template>
  <div class="blogArticle">
    <div class="markdown">
      <h2 style="margin: 6% 0 2% 0; font-size: 30px">{{ title }}</h2>
      <i class="el-icon-date" style="float: left"></i>
      <span style="margin-left: 5px; float: left">{{ date }}</span>
      <img src="../../assets/tag.png" style="width: 16px; margin-left: 50px; float: left">
      <router-link class="articleTag" :to="{path: '/blog/classifyArticle/' + item}" v-for="item in tag" :key='item'>
        <span>{{ item }}</span>
      </router-link>
      <!-- v-highlight 使代码高亮 -->
      <div v-html="htm" v-highlight class="mark"></div>
    </div>
  </div>
</template>

<script>
import showdown from 'showdown'
let converter = new showdown.Converter()
// 将表格显示出来
converter.setOption('tables', true)
// export default 只是为了导出，类似 new Vue()
export default {
  name: 'blogArticle',
  data () {
    return {
      htm: '',
      title: '',
      date: '',
      tag: []
    }
  },
  methods: {
    compile () {
      this.axios.post('http://47.103.15.224:8080/api/backstage/article', {
        articleID: this.$route.params.articleID
      })
        .then(res => {
          this.htm = converter.makeHtml(res.data.result[0].value)
          this.title = res.data.result[0].title
          this.date = res.data.result[0].date.slice(0, 10)
          this.tag = res.data.result[0].tag.split(',')
        })
    }
  },
  // 页面完全渲染后执行该生命周期函数
  mounted () {
    this.compile()
  }
}
</script>

<style scoped>
.blogArticle {
  width: 100%;
  height: 100%;
}
.markdown {
  margin: 0 20% 0 20%;
  width: 60%;
}
.mark {
  margin: 10% 0 0 0;
  line-height: 175%;
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
  float: left;
    /* 水平垂直居中 */
  display: flex;
  align-items: center;
  justify-content: center;
  /* 隐藏下划线 */
  text-decoration:none;
}
</style>
