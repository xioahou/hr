import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import checkPermission from '@/mixin/checkPermission'

import '@/icons' // icon
import '@/permission' // permission control
// 引入全局指令
import * as directives from '@/directives'
import * as filters from '@/filters'
console.log(directives)

// 将对象化为数组
console.log(Object.keys(directives))
Object.keys(directives).forEach(item => {
  // console.log(directives)
  // console.log(directives[item])
  Vue.directive(item, directives[item])
})
Object.keys(filters).forEach(item => {
  Vue.filter(item, filters[item])
})
// 引入全局语言包
import i18n from '@/lang'
// set ElementUI lang to EN
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key)
})
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false
// 引入全局组件
import component from '@/components'
Vue.use(component)
// 注册全局Mixin
Vue.mixin(checkPermission)
// 书局可视化

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
