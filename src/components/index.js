// 该文件负责所有公共组件的全局注册
import pageTools from './pageTools'
import UploadExcel from './uploadExcel'
import uploadImg from './uploadImg/index.vue'
import print from 'vue-print-nb'
export default {
  install(Vue) {
    // 注册全局组件
    Vue.component('pageTools', pageTools)
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('uploadImg', uploadImg)
    Vue.use(print)
  }
}
