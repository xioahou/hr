const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  // 建立token快捷访问
  token: state => state.user.token

}
export default getters
