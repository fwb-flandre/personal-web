<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <!-- 路由嵌套，用于不想跳转到新页面，只想在当前页面切换显示 -->
    <!-- 路由匹配到的组件将显示在这里 -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}
*{
    margin: 0px;
    padding: 0px;
}
html,body{
    height: 100%;
}
#app{
  height: 100%;
}
</style>
