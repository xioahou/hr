import Cookies from 'js-cookie'

const TokenKey = 'hrsaas-ihrm-token' // 设置一个唯一个存放token cookie的key
const timeKey = 'hrsaas-timestamp-key' // 设置一个时间cookie的key
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
// 设置时间戳
export function setTimestamp() {
  return Cookies.set(timeKey, Date.now())
}
// 获取时间戳
export function getTimestamp() {
  return Cookies.get(timeKey)
}
