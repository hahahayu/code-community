// 基于vant进行二次封装

// Notify函数
// import { Notify } from 'vant'
import { Toast } from 'vant'
export default (type, message) => {
  if (type === 'warning') {
    type = 'fail' // Toast 失败图标是 fail
  }
  Toast({
    type,
    message
  })
}
