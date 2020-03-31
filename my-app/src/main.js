// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Clipboard from 'clipboard'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import store from './store/index'
import * as tools from './tools.js'
import highlight from 'highlight.js'
import 'highlight.js/styles/default.css'
// markdown 编辑器
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
// 自定义插件
import centerMove from './components/tools/index.js'

Vue.config.productionTip = false

// 使用axios
Vue.use(VueAxios, axios)
// 使用ElementUI
Vue.use(ElementUI)
// 将axios全局挂载到VUE原型上
Vue.prototype.$axios = axios
// 实现复制功能
Vue.prototype.Clipboard = Clipboard

// markdown 编辑器
Vue.use(mavonEditor)

// 引入自定义插件
Vue.use(centerMove)

// 定义自定义指令 highlight 代码高亮
Vue.directive('highlight', function (el) {
  let blocks = el.querySelectorAll('pre code')
  blocks.forEach((block) => {
    highlight.highlightBlock(block)
  })
})

// 导入自制工具类
Vue.prototype.$tools = tools

// 加载 viewer 以及配置(加工具栏后可翻转、缩放、上下切换、键盘操作)
Vue.use(Viewer)
Viewer.setDefaults({
  'button': false, // 右上角按钮
  'navbar': false, // 底部缩略图
  'title': false, // 当前图片标题
  'toolbar': false // 底部工具栏
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  // 挂载 store
  store,
  components: { App },
  template: '<App/>'
})
