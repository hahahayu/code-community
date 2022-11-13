// 定义全局自定义指令插件
import Vue from 'vue'
// 插件对象(必须有install方法, 才可以注入到Vue.use中)
export default {
  install () {
    Vue.directive('searchFocus', {
      // 指令所在标签，被插入真实DOM时才触发，如果用display:none隐藏再出现，不会触发inserted
      inserted (el) {
        // DOM.nodeName 可以拿到标签的名字， （都是大写字母）
        if (el.nodeName === 'TEXTAREA' || el.nodeName === 'INPUT') {
          el.focus() // 聚焦
        } else {
          // el 本身不是输入框， 尝试往里面获取
          const theInput = el.querySelector('input') // 指令在van-search组件身上, 获取的是组件根标签div, 而input在标签内
          const theTextarea = el.querySelector('textarea')
          // 如果找到了
          if (theInput) theInput.focus()
          if (theTextarea) theTextarea.focus()
        }
      },
      // 指令所在标签，被更新时触发
      update (el) {
        if (el.nodeName === 'TEXTAREA' || el.nodeName === 'INPUT') {
          el.focus() // 聚焦
        } else {
          // el 本身不是输入框， 尝试往里面获取
          const theInput = el.querySelector('input') // 指令在van-search组件身上, 获取的是组件根标签div, 而input在标签内
          const theTextarea = el.querySelector('textarea')
          // 如果找到了
          if (theInput) theInput.focus()
          if (theTextarea) theTextarea.focus()
        }
      }
    })
  }
}
