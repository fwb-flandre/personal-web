<template>
  <div class="blogClassify">
    <h2 style="margin: 3% 0 3% 15%; font-size: 30px;">分类</h2>
    <ul class="classifyUl">
      <li v-for="(item, index) in originalTag" :key='item'>
        <router-link :to="{path: '/blog/classifyArticle/' + item}">
          <el-button style="margin-right: 20px">
            <img src="../../assets/tag.png" style="width: 16px">
            <span style="margin-left: 10px">{{ item }}</span>
            <span style="margin-left: 10px">{{ tag[index] }}</span>
          </el-button>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
// export default 只是为了导出，类似 new Vue()
export default {
  name: 'blogClassify',
  data () {
    return {
      originalTag: ['前端', '后台', '其他'],
      tag: ['', '', '']
    }
  },
  methods: {
    loadTag () {
      for (let key in this.originalTag) {
        this.getTag(this.originalTag[key], key)
      }
    },
    getTag (tag, index) {
      this.axios.post('http://47.103.15.224:8080/api/backstage/tag', {
        tag: tag
      })
        .then(res => {
          this.$set(this.tag, index, res.data.result[0].tag)
        })
    }
  },
  // 页面完全渲染后执行该生命周期函数
  mounted () {
    this.loadTag()
  }
}
</script>

<style scoped>
.blogClassify {
  width: 100%;
  height: 100%;
}
.classifyUl {
  margin: 0 15% 0 15%;
  width: 70%;
  height: 100%;
  list-style-type: none;
}
.classifyUl li {
  /* 实现列表横排 */
  float: left;
}
</style>
