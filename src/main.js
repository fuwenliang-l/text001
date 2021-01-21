import Vue from 'vue'
import App from './App.vue'
// 导入路由
import router from './router'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import './static/iconfont/iconfont.css'
import 'swiper/css/swiper.css'
import VueVideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
import request from '@/utils/request'
import axios from 'axios'

// import Vuex from 'vuex'
import store from './store'


// Vue.use(Vuex)

import 'vant/lib/index.css';


// 发送请求
Vue.prototype.$request = request
axios.defaults.baseURL = "/api"


Vue.use(VueVideoPlayer)
Vue.use(VueAwesomeSwiper)
Vue.config.productionTip = false
new Vue({
  // 注册路由
  router,
  //注册vuex
  store,
  render: h => h(App),
}).$mount('#app')