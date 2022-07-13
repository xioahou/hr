import { constantRoutes, asyncRoutes } from '@/router'
const state = {
  routes: constantRoutes
}
const mutations = {
  setRoutes(state, newRoutes) {
  // 将开放路由和权限路由合并
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
  filterRouter(context, menus) {
    const routes = []
    menus.forEach(key => {
      routes.push(...asyncRoutes.filter(item =>
        item.name === key
      ))
    })
    context.commit('setRoutes', routes) // 提交mutations是为了给侧边栏
    console.log(routes)
    // 此处route是为了让addRouter调用
    return routes
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
