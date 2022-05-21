import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'
const state = {
  token: getToken() // 设置token为共享状态，初始化从缓存取值
}
const mutations = {
  setToken(state, token) {
    // 将数据设置给vuex
    state.token = token
    // 同步给缓存
    setToken(token)
  },
  removeToken(state) {
    // 将vuex 数据置空
    state.token = null
    // 同步到缓存
    removeToken()
  }
}
const actions = {
  async login(context, data) {
    const result = await login(data)

    // 提交mutations
    context.commit('setToken', result.data.data)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

