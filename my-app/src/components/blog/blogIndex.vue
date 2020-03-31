<template>
  <div class="blogIndex" >
    <img src="../../assets/back.jpg" style="width: 115%" ref="img" v-center="move">
  </div>
</template>

<script>
// export default 只是为了导出，类似 new Vue()
export default {
  name: 'blogIndex',
  data () {
    return {
    }
  },
  methods: {
    // 鼠标移动时触发该方法
    move (x, y) {
      this.$moveCenter(x, y, this.$refs.img.style, {
        xZoom: 12,
        yZoom: 5,
        xOffset: -100,
        durning: 30
      })
    }
  }
}
</script>

<style scoped>
.blogIndex {
  height: 100%;
}
</style>
