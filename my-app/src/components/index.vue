<template>
<!-- vue 在 template 内写 html 内容 -->
  <div class="index">
    <img src="../assets/background.jpg">
    <img src="../assets/headImg.jpg" class="circle" ref="circle" v-center="move" @click="touchclick">
    <transition name = "fade">
      <div class="sidebar" ref="sidebar" v-center="move" v-show = "show">
        <div class="navigation">
          <router-link :to="{name:'collector'}" tag="div" class="navi">
            网络收藏夹
          </router-link>
        </div>
        <div class="navigation">
          <router-link :to="{name:'album'}" tag="div" class="navi">
            相册
          </router-link>
        </div>
        <div class="navigation">
          <router-link :to="{name:'detect'}" tag="div" class="navi">
            大创项目
          </router-link>
        </div>
        <div class="navigation">
          <router-link :to="{name:'blogIndex'}" tag="div" class="navi">
            个人博客
          </router-link>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
// export default 只是为了导出，类似 new Vue()
export default {
  name: 'index',
  data () {
    return {
      show: false,
      offset: 0
      // 内联样式绑定，使用方法（v-bind:style = "[baseStyles]"）
    }
  },
  // 页面完全渲染后执行该生命周期函数
  mounted () {
    // 隐藏滚动条
    document.body.parentNode.style.overflowY = 'hidden'
    // 背景置为白色
    document.body.parentNode.style.background = 'white'
  },
  methods: {
    // 鼠标移动时触发该方法
    move (x, y) {
      this.$moveCenter(x, y, this.$refs.circle.style, {
        xZoom: 10,
        yZoom: 5,
        xOffset: -this.offset,
        durning: 30
      })
      this.$moveCenter(x, y, this.$refs.sidebar.style, {
        xZoom: 10,
        yZoom: 5,
        xOffset: 150,
        durning: 30
      })
    },
    // 点击圆心使圆心向左移动
    touchclick () {
      let fn = () => {
        this.offset += 20
        this.$refs.circle.style.left = -this.offset + 'px'
        if (this.offset < document.body.clientWidth / 3) {
          requestAnimationFrame(fn)
        }
      }
      fn()
      this.show = true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* 过渡 */
.fade-enter-active{
    transition: opacity 1s
}
.fade-enter{
    opacity: 0
}
.index{
  height: 100%;
  width: 100%;
}
.ground{
  height: 100%;
  width: 100%;
}
.circle{
  width: 600px;
  height: 600px;
  border-radius: 600px;
  z-index: 999;
}
.sidebar {
  width: 550px;
  height: 500px;
}
.navigation {
  width: 100%;
  height: 20%;
  margin-bottom: 25px;
  background-color: SkyBlue;
}
.navi {
  /* 使该 div 靠右 */
  margin-left: auto;
  height: 100%;
  width: 75%;
  font-family: cursive;
  font-size: 50px;
  cursor: pointer;
  /* 水平垂直居中 */
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
