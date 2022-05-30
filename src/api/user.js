import request from '@/utils/request'

//  登录请求接口
export function login(data) {
  return request({
    method: 'POST',
    url: '/sys/login',
    data
  })
}
// 获取用户资料
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}
// 获取用户头像
export function getUserImg(id) {
  return request({
    url: `/sys/user/${id}`
  })
}
export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
