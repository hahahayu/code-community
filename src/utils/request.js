// 基于 axios 封装网络请求
import Axios from 'axios'
import router from '@/router'
import Notify from '@/ui/Notify.js'
import { getToken, setToken } from '@/utils/token.js'
import { refreshTokenAPI } from '@/api'

const axios = Axios.create({
  // baseURL: 'http://geek.itheima.net',
  baseURL: 'https://toutiao.itheima.net',
  timeout: 20000
})

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 判断本地是否有token，再统一携带
  // ?. 可选链操作符， 如果前面的对象没有length，返回undefined
  if (getToken()?.length && config.headers.Authorization === undefined) {
    config.headers.Authorization = `Bearer ${getToken()}`
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器 -- 本质是一个函数
axios.interceptors.response.use(function (response) {
  // 当状态码为2xx/3xx开头进这里
  // 对响应数据做点什么
  return response
}, async function (error) {
  // 响应状态码4xx/5xx进这里
  // 对响应错误做点什么
  // console.dir(error)
  if (error.response.status === 401) { // 身份过期
    // token续签方式1:  去登录页重新登录, token无用, 清掉-确保路由守卫if进不去
    // 不能用 this.$router, 这里的this不是Vue组件对象
    // Notify({ type: 'warning', message: '身份已过期，请重新登录' })

    // 方法1：清除 token，让路由守卫判断失效，放行到登录页面
    // removeToken()
    // router.replace('/login')

    // 方法2：使用refresh_token换回新的token再继续使用，js代码实现，用户无感知（效果好）
    const res = await refreshTokenAPI()
    console.log(res)
    // 1. 更新token在本地
    setToken(res.data.data.token)
    // 2. 更新新的token在请求头里
    error.config.headers.Authorization = `Bearer ${res.data.data.token}`
    // 3. 未完成的请求，再一次发起
    // error.config 就是上一次请求的配置对象
    // 结果要return回原本逻辑页面调用的地方，是一个Promise对象
    return axios(error.config)
  } else if (error.response.status === 500 && error.config.url === '/v1_0/authorizations' && error.config.method === 'put') {
    // 刷新的 refresh_token 也过期了
    Notify({ type: 'warning', message: '身份已过期，请重新登录' })
    localStorage.clear() // 清除localStorage里所有值
    router.replace('/login')
  }
  return Promise.reject(error)
})

export default ({ url, method = 'GET', params = {}, data = {}, headers = {} }) => {
  return axios({
    url,
    method,
    params,
    data,
    headers
  })
}
