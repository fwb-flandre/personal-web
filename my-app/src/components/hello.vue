<template>
  <div class="hello">
    <div class="news">
      <img src="news-pic.jpg" />
      <p>some text</p>
      <div class="clear"></div>
    </div>
  </div>
</template>

<script>
// export default 只是为了导出，类似 new Vue()
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome'
    }
  },
  // 页面完全渲染后执行该生命周期函数
  mounted () {
  }
}
</script>

<style scoped>
.news {
  background-color: gray;
  border: solid 1px black;
  }

.news img {
  float: left;
  }

.news p {
  float: right;
  }
.clear {
  clear: both;
  }
</style>
