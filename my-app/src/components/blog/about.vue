<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
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
