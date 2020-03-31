<template>
  <div class="list">
    <ul class="articleUl">
      <li v-for="articleItem in articleList" :key='articleItem.articleID' class="articleLi">
        <h2 style="margin-top: 2%">{{ articleItem.title }}</h2>
        <div class="attr">
          <i class="el-icon-date"></i>
          <span style="margin: 0 50px 0 5px">{{ articleItem.date }}</span>
          <img src="../../assets/tag.png" style="width: 16px">
          <router-link class="articleTag" :to="{path: '/blog/classifyArticle/' + item}" v-for="item in articleItem.tag" :key='item'>
            <span>{{ item }}</span>
          </router-link>
        </div>
        <div style="margin-top: 4%">
          <span>前言：{{ articleItem.preface }}</span>
        </div>
        <router-link :to="{path: 'article/' + articleItem.articleID}">
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
  name: 'list',
  data () {
    return {
      articleList: []
    }
  },
  // 页面完全渲染后执行该生命周期函数
  mounted () {
    this.axios.get('http://47.103.15.224:8080/api/backstage/article', {})
      .then(res => {
        // 通过 reverse() 将新写的博客放前面
        res.data.result = res.data.result.reverse()
        for (let elem of res.data.result.values()) {
          elem.tag = elem.tag.split(',')
          elem.date = elem.date.slice(0, 10)
          // 必须要用 push 才能触发 vue 刷新机制
          this.articleList.push(elem)
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
