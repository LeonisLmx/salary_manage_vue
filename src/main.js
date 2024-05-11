import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import websocket from "./store/websocket";
import './plugins/element.js'
//导入全局样式表
import './assets/css/global.css'
//导入nprogress
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import axios from 'axios'
import {postRequest} from "./util/api";
import {postKeyValueRequest} from "./util/api";
import {putRequest} from "./util/api";
import {deleteRequest} from "./util/api";
import {getRequest} from "./util/api";
import echarts from "echarts";
import Print from 'vue-print-nb'
//import 'font-awesome/css/font-awesome.min.css'
Vue.use(Print)
//自定义全局组件
Vue.prototype.postRequest = postRequest;
Vue.prototype.postKeyValueRequest = postKeyValueRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.$http=axios;
Vue.prototype.$websocket=websocket;
Vue.config.productionTip = false;
Vue.prototype.$echarts = echarts;
//通过axios请求拦截器添加token保证，拥有获取数据的权限
//在request拦截器中展示nprogress
axios.interceptors.request.use(config=>{
  NProgress.start();
  // console.log(config)
  //为请求头添加Token验证Authorization字段
  config.headers.Authorization=window.sessionStorage.getItem("token");
  //最后必须有
  return config
})
axios.interceptors.response.use(config=>{
  NProgress.done();
  return config;
})
new Vue({
  router,
  store,

  render: h => h(App)
}).$mount('#app')
