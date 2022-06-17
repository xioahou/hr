import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'
import { getTimestamp } from '@/utils/auth'
// 创建一个表单实例
const service = axios.create({
  // 当执行npm run dev=》.evn.development=>/api=>跨域代理
  // 当执行npm run dev=>/api     当执行npm run build=》/prod-api
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000 // 定义五秒超时
})
// 定义token存放时间变量z
const timeout = 3600
// 请求拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    if (isCheckTimeout()) {
      store.dispatch('user/logout')
      router.push('/login')
      return Promise.reject(new Error('token超时了'))
    }
    // 注入token
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
    console.log(store.getters.token)
  }
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(response => {
  // 响应成功

  const { success, message, data } = response.data
  console.log('响应拦截器success')
  console.log(success)
  // 判断success
  if (success) {
    return data
  } else {
    // 业务已经错误还能进then?不能 应该进catch
    Message.error(message) // 错误提示信息
    return Promise.reject(new Error(message))
  }
}, error => {
// 响应失败
  console.log(error)
  if (error.response && error.response.data && error.response.data.code === 10002) {
    // 当等于10002时表示后端后端返回token超时
    store.dispatch('user/logout')
    router.push('/login')
  } else {
    Message.error(error.message) // 提示错误信息
  }

  return Promise.reject(error) // 返回执行错误，让当前的执行连跳出，直接进入catch
})
// 判断token是否过期
function isCheckTimeout() {
  // 当前时间
  const currentTime = Date.now()
  const timeStamp = getTimestamp()
  return (currentTime - timeStamp) / 1000 > timeout
}
// 导出axios实例default
export default service
