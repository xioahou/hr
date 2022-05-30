// 管理所有自定义指令
// 导出到全局
export const imagerror = { inserted(dom, options) {
  dom.onerror = function() {
    dom.src = options.value
  }
}
}
