let centerMove = {}

// t 为当前时间, b 为开始状态， c 为结束状态, d 为持续时间
function move (t, b, c, d) {
  let store = 0
  if (b !== 0) {
    store = b
    c = c - b
    b = 0
  }
  return -c * (t /= d) * (t - 2) + b + store
}

// Vue.js 的插件应该暴露一个 install 方法。这个方法的第一个参数是 Vue 构造器。
centerMove.install = function (Vue) {
  // 自定义指令 v-center
  Vue.directive('center', {
    // 使用时要保证父元素所占的空间满足自身要求
    inserted: function (el, binding) {
      // 注册事件
      // 如果有多个元素同时注册事件，下列事件也只会注册多次，执行一次
      // 原因：函数存放位置为堆，传递时用的是指针，因此重复赋值时后者代替前者
      el.parentNode.onmousemove = function (e) {
        // 函数节流，1 帧内只触发一次
        if (this.time && Date.now() - this.time < 16) return
        this.time = Date.now()
        // 获取鼠标当前距离浏览器中央的坐标
        let mouseX = e.clientX - document.body.clientWidth / 2
        let mouseY = e.clientY - document.body.clientHeight / 2
        // 为绑定的函数赋值
        binding.value(mouseX, mouseY)
      }
      Object.assign(el.style, {
        // 水平垂直居中的样式
        position: 'fixed',
        margin: 'auto',
        left: '0px',
        right: '0px',
        top: '0px',
        bottom: '0px'
      })
    }
  })
  // 控制移动
  Vue.prototype.$moveCenter = function (x, y, style, {xZoom = 1, yZoom = 1, xOffset = 0, yOffset = 0, time = 0, durning = 1} = {}) {
    // 知识点：函数表达式，箭头函数，解构赋值，动画，函数节流，工具类的添加，图像居中，闭包
    // 数据预处理，因为原本的数据为 0px
    // slice() 方法内加负数会自动加上字符串的长度
    let [cx, cy] = [-x / xZoom + xOffset, y / yZoom + yOffset]
    let [bx, by] = [Number.parseInt(style.left.slice(0, -2)), Number.parseInt(style.bottom.slice(0, -2))]
    // 使用箭头函数
    let fn = () => {
      time++
      // 调用缓动函数
      let xValue = move(time, bx, cx, durning)
      let yValue = move(time, by, cy, durning)
      // 字符串拼接
      style.bottom = yValue + 'px'
      style.left = xValue + 'px'
      if (time <= durning) {
        requestAnimationFrame(fn)
      }
    }
    fn()
  }
}
export default centerMove
