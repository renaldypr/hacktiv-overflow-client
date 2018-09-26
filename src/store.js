import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLogin: '',
    errMessage: ''
  },
  mutations: {
    changeLoginStatus (state) {
      state.isLogin = true
    },
    logout (state) {
      state.isLogin = false
    },
    setErrMessage (state, message) {
      state.errMessage = message
      setTimeout(() => {
        state.errMessage = ''
      }, 3000)
    }
  },
  actions: {
    changeLoginStatus (context) {
      context.commit('changeLoginStatus')
    },
    logout (context) {
      context.commit('logout')
    },
    sendErrMessage (context, message) {
      context.commit('setErrMessage', message)
    }
  }
})
