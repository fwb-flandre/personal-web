import Vue from 'vue'
import vuex from 'vuex'
import manageStore from './component/manageStore'
Vue.use(vuex)

export default new vuex.Store({
  modules: {
    manage: manageStore
  }
})
