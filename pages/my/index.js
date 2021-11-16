//获取应用实例
var app = getApp();
var utils=require('../../utils/util.js')
Page({
  data: {
    user_info: null,
    user_info1: null,
  },
  onLoad() {
  },
  onShow() {
    var t = this;
      utils.is_login()
    t.setData({
      user_info: app.globalData.userInfo,
      user_info1: app.globalData.user_info1,
    })
    app.console('my_index')
    app.console(app.globalData.user_info1)
  },
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: app.globalData.share_title,
      path: app.globalData.share_path,
      imageUrl: app.globalData.share_image,
    }
  }
});