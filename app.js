//app.js
App({
  onLaunch: function () {
  },
  globalData: {
    userInfo: null,
    user_info1:null,
    is_login:0,
    version: "1.0",
    shopName: "北邮校内一卡通查找平台",
    domain: "http://127.0.0.1:8000/bupadiu",
    host:'http://127.0.0.1:8000',
    // domain: "https://mutallip.cn/bupadiu",
    // host: 'https://mutallip.cn',

    share_path: '/pages/index/index',
    share_image:'/images/share.png',
    share_title:'走吧，找一卡通去~',
  },
  tip: function (params) {
    var that = this;
    var title = params.hasOwnProperty('title') ? params['title'] : '提示信息';
    var content = params.hasOwnProperty('content') ? params['content'] : '';
    wx.showModal({
      title: title,
      content: content,
      success: function (res) {

        if (res.confirm) {//点击确定
          if (params.hasOwnProperty('cb_confirm') && typeof (params.cb_confirm) == "function") {
            params.cb_confirm();
          }
        } else {//点击否
          if (params.hasOwnProperty('cb_cancel') && typeof (params.cb_cancel) == "function") {
            params.cb_cancel();
          }
        }
      }
    })
  },
  alert: function (params) {
    var title = params.hasOwnProperty('title') ? params['title'] : '提示信息';
    var content = params.hasOwnProperty('content') ? params['content'] : '';
    wx.showModal({
      title: title,
      content: content,
      showCancel: false,
      success: function (res) {
        if (res.confirm) {//用户点击确定
          if (params.hasOwnProperty('cb_confirm') && typeof (params.cb_confirm) == "function") {
            params.cb_confirm();
          }
        } else {
          if (params.hasOwnProperty('cb_cancel') && typeof (params.cb_cancel) == "function") {
            params.cb_cancel();
          }
        }
      }
    })
  },
  show: function (title, icon=1){
    if(icon==1){
      icon ='success'
    }else if(icon==2){
      icon ='loading'
    }else if(icon==0){
      icon ='none'
    }
    wx.showToast({
      title: title,
      icon: 'success',
      duration: 500
    })
  },
  console: function (msg) {
    console.log(msg);
  },
  getRequestHeader: function () {
    return {
      'content-type': 'application/x-www-form-urlencoded'
    }
  }
});