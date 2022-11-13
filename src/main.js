import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible' // 设置根标签字体大小， 移动端适配
// import hljs from 'highlight.js' // hljs对象
import 'highlight.js/styles/default.css' // 代码高亮的样式
import './VueComponents.js' // vant 组件

import directiveObj from '@/utils/directives'
Vue.use(directiveObj)

Vue.config.productionTip = false

// Vue.directive('highlight', function (el) { // 自定义一个代码高亮指令
//   const highlight = el.querySelectorAll('pre, code') // 获取里面所有pre或者code标签
//   highlight.forEach((block) => {
//     hljs.highlightElement(block) // 突出显示这些标签(以及内部代码, 会自动识别语言)
//   })
// })

// 环境变量文件中，定义变量名NODE_ENV(固定)，自定义变量名VUE_APP_开头（规定）
// yarn serve启动项目， .env.development 内变量挂载到 process.env 属性上
// yarn build 打包项目，.env.production 内变量挂载到 process.env 属性上
if (process.env.NODE_ENV !== 'development') { // process是Node环境全部变量, 运行时根据敲击的命令不同, 脚手架会取环境变量给env添加属性和值
  console.log = function () {}
  console.error = function () {}
  console.dir = function () {}
  console.warning = function () {}
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
