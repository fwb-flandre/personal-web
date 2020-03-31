export default {
  state: {
    name: '123'
  },
  // 用于改变保存的值，里面的操作必须同步
  mutations: {
    modifyName (state, n) {
      state.name = n
    }
  },
  // 类似 vue 中的 method，用于执行多个 mutations
  actions: {
    // context 与 $store 相同
    modify (context, n) {
      context.commit('modifyName', n)
    }
  }
}
