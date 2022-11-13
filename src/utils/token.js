// 此文件用于封装3个操作token的方法
const key = 'code-community'
// 存储
export const setToken = (token) => {
  localStorage.setItem(key, token)
}
// 获取
export const getToken = () => {
  return localStorage.getItem(key)
}
// 删除
export const removeToken = () => {
  localStorage.removeItem(key)
}
