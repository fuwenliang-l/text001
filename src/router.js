import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const router = new VueRouter({
  routes: [
    {
      path: "/",
      name: "allVideoList",
      component: resolve => require(['./components/index/AllVideoList.vue'],resolve),
      meta: {
        keepAlive: false,
      }
    },
    {
      path: "/videoList",
      name: 'videoList',
      component: resolve => require(['./components/index/VideoList.vue'],resolve),
      meta: {
        keepAlive: false
      }
    },
    
  ],
  // mode: 'history',
  // base: '/dist/'//项目名称 访问路由页面都需要加上这个,访问的根路径为http://ip:port/test
})
export default router