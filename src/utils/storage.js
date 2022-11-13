// 封装本地存储的方式
// 统一管理 localStorage, sessionStorage, cookie

export const setStorage = (key, value) => {
  localStorage.setItem(key, value)
}

export const getStorage = (key) => {
  return localStorage.getItem(key)
}

export const removeStorage = (key) => {
  localStorage.removeItem(key)
}
