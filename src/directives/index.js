// 管理所有自定义指令
// 导出到全局
export const imagerror = { inserted(dom, options) {
  // 当图片出现异常会将默认图片设置
  dom.src = dom.src || options.value // 判断dom.src有没有值，如果没有则使用options.value
  dom.onerror = function() {
    dom.src = options.value
  }
},
// 该钩子函数会在当前指令作用的组件，更新数据完毕之后，执行
componentUpdated(dom, options) {
  dom.src = dom.src || options.value
}
}
