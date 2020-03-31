<template>
  <div class="blog" style="width: 100%; height: 100%">
    <el-container style="height: 100%">
      <el-aside width="100px" class="aside" v-bind:style="asideStyle">
        <div class="hide" @click="hide">
          <img src="../assets/list.png" style="width:100%">
        </div>
        <div class="headPortraitDiv">
          <img src="../assets/headImg.jpg" class="headPortrait">
        </div>
        <el-menu
        style="width: 100%"
        :router=true
        :default-active="$route.name"
        class="el-menu-vertical-demo container"
        background-color="#545c64"
        text-color="white">
          <el-menu-item index="/blog/blogIndex" class="nav">主页</el-menu-item>
          <el-menu-item index="/blog/list" class="nav">文章</el-menu-item>
          <el-menu-item index="/blog/classify" class="nav">分类</el-menu-item>
          <el-menu-item index="/blog/about" class="nav">关于</el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main style="padding: 0px">
          <router-view v-if="isRouterAlive"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// export default 只是为了导出，类似 new Vue()
export default {
  name: 'blog',
  data () {
    return {
      isRouterAlive: true,
      asideVisible: true,
      asideStyle: {
        marginLeft: '0px'
      }
    }
  },
  provide () {
    return {
      reload: this.reload
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    },
    hide () {
      let lett = this
      let store
      if (this.asideVisible === true) {
        hideFun()
        this.asideVisible = false
      } else {
        showFun()
        this.asideVisible = true
      }
      function hideFun () {
        store = parseInt(lett.asideStyle.marginLeft.slice(0, lett.asideStyle.marginLeft.length - 2))
        store = store - 5
        lett.asideStyle.marginLeft = store + 'px'
        if (store > -100) {
          requestAnimationFrame(hideFun)
        }
      }
      function showFun () {
        store = parseInt(lett.asideStyle.marginLeft.slice(0, lett.asideStyle.marginLeft.length - 2))
        store = store + 5
        lett.asideStyle.marginLeft = store + 'px'
        if (store < 0) {
          requestAnimationFrame(showFun)
        }
      }
    }
  },
  // 页面完全渲染后执行该生命周期函数
  mounted () {
    // 隐藏滚动条
    document.body.parentNode.style.overflowX = 'hidden'
    document.body.parentNode.style.overflowY = 'hidden'
  }
}
</script>

<style scoped>
.hide {
  position: absolute;
  margin-left: 150px;
  margin-top: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50px;
  z-index: 999;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  /* 变化持续时间 */
  transition-duration: 0.4s;
}
/* 鼠标悬停效果 */
.hide:hover {
  background-color: rgba(0, 0, 0, 0.5);
}
.aside {
  background-color: #545c64;
  overflow-x: hidden;
  height: 100%;
  z-index: 999;
}
.headPortraitDiv {
  width: 100%;
  height: 15%;
  /* 水平垂直居中 */
  display: flex;
  align-items: center;
  justify-content: center;
}
.headPortrait {
  width: 70px;
  height: 70px;
  border-radius: 70px;
}
.nav {
  /* 水平垂直居中 */
  display: flex;
  align-items: center;
  justify-content: center;
}
.navLink {
  color: white;
  text-decoration: none;
}
</style>
