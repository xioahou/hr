// 路由拦截
import router from '@/router'
import store from '@/store'
// import { mapGetters } from 'vuex'
// import NProgress from 'nprogress' // 引入一份进度条插件
// import 'nprogress/nprogress.css' // 引入进度条样式
// 定义白名单列表
const whiteList = ['/login', '/404']
// 路由前置守卫
// next(false)跳转终止
router.beforeEach(async(to, from, next) => {
//   NProgress.start() // 开启进度条
  // 判断是否有token
  if (store.getters.token) {
    if (to.path === '/login') {
      next('/') // 跳到主页
    } else {
      if (!store.getters.userId) {
        const { roles } = await store.dispatch('user/getUserInfo')
        console.log(roles)
        console.log(roles.menus)
        // async返回的函数直接用await就可以
        const res = await store.dispatch('permission/filterRouter', roles.menus)
        // res就是筛选出来的动态路由
        // addRoutes是router的实例
        router.addRoutes([...res, { path: '*', redirect: '/404', hidden: true }])
        // 这块有个缺陷，使用addRouters必须使用next(to.path)重新跳转一下
        next(to.path)
      }
      next() // 直接放行
    }
  } else {
    // 如果没有token就跳转白名单
    if (whiteList.indexOf(to.path) > -1) { next() } else {
      next('/login')
    }
  }
//   NProgress.done() // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题
})
// 后置守卫
router.afterEach(() => {
//   NProgress.done() // 关闭进度条
})
