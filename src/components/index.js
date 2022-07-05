// 该文件负责所有公共组件的全局注册
import pageTools from './pageTools'
import UploadExcel from './uploadExcel'
export default {
  install(Vue) {
    // 注册全局组件
    Vue.component('pageTools', pageTools)
    Vue.component('UploadExcel', UploadExcel)
  }
}
