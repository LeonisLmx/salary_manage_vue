import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  //定义全局变量
  state: {
    user:{}
  },
  //改变state的值必须经过
  mutations: {
    changeState(state,user){
      state.user=user;
    },
    changeUserFace(state,imgUrl){
      state.user.userface=imgUrl;
    }
  },
  actions: {
  },
  modules: {
  }
})
