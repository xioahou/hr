import axios from 'axios'
import { Message } from 'element-ui'
// 创建一个表单实例
const service = axios.create({
  // 当执行npm run dev=》.evn.development=>/api=>跨域代理
  // 当执行npm run dev=>/api     当执行npm run build=》/prod-api
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000 // 定义五秒超时
})
// 请求拦截器
service.interceptors.request.use()
// 响应拦截器
service.interceptors.response.use(response => {
  // 响应成功
  const { success, message, data } = response.data
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
  Message.error(error.message) // 提示错误信息
  return Promise.reject(error) // 返回执行错误，让当前的执行连跳出，直接进入catch
})
// 导出axios实例default
export default service
