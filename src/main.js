// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
//elementui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';


// 引入状态管理
import store from './store/index';
// 引入icon
import './assets/icon/iconfont.css'

import request from "./utils/request";


import Echarts from 'vue-echarts'
import 'echarts/lib/chart/line'
Vue.component('v-chart',Echarts)
// 引入状态管理
Vue.use(ElementUI);
Vue.config.productionTip = false
Vue.prototype.$request = request //显式的绑定

/* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    store, //使用store vuex状态管理
    beforeCreate() {
      Vue.prototype.$bus = this //安装全局事件总线
    },
    render: h => h(App)
  })


/*new Vue({
  el: '#app',
  router,
  store, //使用store vuex状态管理
  components: {App},
  template: '<App/>',
  beforeCreate() {
    Vue.prototype.$bus = this //安装全局事件总线
  },
})*/
