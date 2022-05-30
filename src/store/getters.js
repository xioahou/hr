const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  // 建立token快捷访问
  token: state => state.user.token,
  // 建立用户资料用户名
  userInfo: state => state.user.userInfo.username,
  // 建立映射用id
  userId: state => state.user.userInfo.userId,
  // 建立用户头像快捷访问
  staffPhoto: state => state.user.userInfo.staffPhoto
}
export default getters
