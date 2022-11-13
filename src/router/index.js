import Vue from 'vue'
import VueRouter from 'vue-router'
import { getToken } from '@/utils/token.js'
// import Login from '@/views/Login/index.vue'
// import Layout from '@/views/Layout/index.vue'
// import Home from '@/views/Home/index.vue'
// import User from '@/views/User/index.vue'
// import Search from '@/views/Search/index.vue'
// import SearchResult from '@/views/Search/SearchResult.vue'
// import ArticleDetail from '@/views/ArticleDetail/index.vue'
// import UserEdit from '@/views/User/UserEdit.vue'
// import Chat from '@/views/Chat/index.vue'

// 路由懒加载 - 为了让第一个页面加载的app.js小一点，打开网页快一点
// 思路：把组件对应的js，分成若干个.js，路由切换到哪个页面，才去加载对应的.js文件
// 原因：webpack分析入口时，发现router里直接import所有页面，所有直接打包进app.js - 文件过大
// 解决：当路由路径匹配规则时，才去引入对应的组件js文件
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/layout/home' // 默认首页
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "Login" */ '@/views/Login/index.vue')
  },
  {
    path: '/search',
    component: () => import(/* webpackChunkName: "Search" */ '@/views/Search/index.vue')
  },
  { // 搜索结果页面
    path: '/search_result/:kw',
    component: () => import(/* webpackChunkName: "SearchResult" */ '@/views/Search/SearchResult.vue')
  },
  { // 文章详情页
    path: '/detail',
    component: () => import(/* webpackChunkName: "ArticleDetail" */ '@/views/ArticleDetail/index.vue')
  },
  { // 用户编辑页面
    path: '/user_edit',
    component: () => import(/* webpackChunkName: "UserEdit" */ '@/views/User/UserEdit.vue')
  },
  {
    path: '/chat',
    component: () => import(/* webpackChunkName: "Chat" */ '@/views/Chat/index.vue')
  },
  {
    path: '/layout',
    component: () => import(/* webpackChunkName: "Layout" */ '@/views/Layout/index.vue'),
    children: [
      {
        path: 'home',
        component: () => import(/* webpackChunkName: "Home" */ '@/views/Home/index.vue'),
        meta: {
          scrollT: 0 // 保存首页时，滚动条位置
        }
      },
      {
        path: 'user',
        component: () => import(/* webpackChunkName: "User" */ '@/views/User/index.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 方法1：全局前置守卫
router.beforeEach((to, from, next) => {
  // 已经登录，不能进入登录页面
  if (getToken()?.length > 0 && to.path === '/login') {
    // next(false) // 阻止跳转原地呆着
    next('/layout/home') // 返回首页
    // 手机APP里没有地址栏，不能破坏跳转过程
  } else {
    next()
  }
})
// 方法2：路由独享守卫 ...
export default router
