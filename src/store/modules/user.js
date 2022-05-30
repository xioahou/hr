import { getToken, setToken, removeToken, setTimestamp } from '@/utils/auth'
import { login, getUserInfo, getUserImg } from '@/api/user'

// 状态
const state = {
  // 初始化 vuex 缓存中读取
  token: getToken(), // 设置token为共享状态
  userInfo: {} // 用户资料

}

const mutations = {
  // 设置token的  修改 state的数据
  setToken(state, token) {
    state.token = token // 将数据传给 vuex
    setToken(token) // 同步缓存
  },
  //  删除缓存
  removeToken(state) {
    state.token = null
    removeToken() // 同步了
  },
  // 设置userInfo
  setuserInfo(state, result) {
    state.userInfo = result
  },
  // 移除userInfo
  removeuserInfo(state) {
    state.userInfo = {}
  }

}
// 异步操作
const actions = {
  async  login(context, data) {
    // 调用登录接口
    const result = await login(data) // 拿到 token
    // 设置token过期时间戳
    setTimestamp()
    context.commit('setToken', result)
  },
  // 调用用户资料接口
  async getUserInfo(context) {
    const result = await getUserInfo()
    // 获取基本信息中头像
    const resultphoto = await getUserImg(result.userId)
    // 合并接口数据
    const merge = { ...result, ...resultphoto }
    console.log(result)
    context.commit('setuserInfo', merge)
  },
  // 退出登录
  logout(context) {
    context.commit('removeToken')
    context.commit('removeuserInfo')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

