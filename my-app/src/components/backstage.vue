<template>
  <div class="backstage">
    <el-container style="height: 937px; border: 1px solid #eee">
      <el-aside width="150px" style="background-color: rgb(238, 241, 246)">
        <el-menu :router=true :default-active="$route.name" class="el-menu-vertical-demo container">
          <el-menu-item index="/backstage/write">编写文章</el-menu-item>
          <el-menu-item index="/backstage/manage">管理文章</el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <span style="font-size: 20px">博客后台系统</span>
          <!-- <span>{{ msg }}</span> -->
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// export default 只是为了导出，类似 new Vue()
export default {
  name: 'backstage',
  data () {
    return {
      msg: 'Wome'
    }
  },
  // 页面完全渲染后执行该生命周期函数
  mounted () {
  }
}
</script>

<style scoped>
.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
}
</style>
