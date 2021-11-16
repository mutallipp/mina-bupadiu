//login.js
//获取应用实例
var util=require('../../utils/util.js')
var app = getApp();
Page({
  data: {
    remind: '加载中',
    angle: 0,
    userInfo: {},
    regFlag:true,
    is_auth:0
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: app.globalData.shopName
    })

    this.check_auth();

  },
  check_auth:function(){
    var t = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          t.setData({
            is_auth: 0
          })
          // wx.authorize({
          //   scope: 'scope.userInfo',
          //   success() {
          //     // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
          //     // wx.startRecord()
          //     app.console('授权成功')

          //   }
          // })
        } else {
           t.getUsertinfo()
          t.setData({
            is_auth: 1
          });
          wx.getUserInfo({
            success: function (resq) {
              app.globalData.userInfo = resq.userInfo
              // app.console(resq.userInfo)
            }
          })
          t.goToIndex()
          if (!util.getdata('is_auth')){
            util.setdata('is_auth',1)
          }else{}
           }
      }
    })
  },

  check_login:function(){
    var t = this;
    t.getUsertinfo()
    // var data = util.getUsertinfo()
    // app.console(data)
    var is_auth = util.getdata('is_auth')
    
    if (!is_auth){
      t.setData({
        is_auth:0
      })

    }else{
      var user_info1 = util.getdata('user_info1')
      if (user_info1){
      app.globalData.user_info1 = user_info1
      t.setData({
        is_auth: 1
      })
        t.goToIndex()
      }else{
        t.goToIndex()
      }
    }
  },
  setuserinfo:function(e){
    var t=this;
    app.console('setuserinfo')
    if (e.detail.userInfo){
      util.setdata('card',0)
      app.console('已授权')
      t.getUsertinfo()
              t.setData({
                is_auth: 1
              });
              t.goToIndex()
      if (!util.getdata('is_auth')) {
        util.setdata('is_auth', 1)
              } else { }

    }else{
      app.console('授权失败')
    }

  },
  goToIndex: function () {
    wx.switchTab({
      url: '/pages/user/index',
    });
  },

  onShow: function () {

  },
  onReady: function () {
    var that = this;
    setTimeout(function () {
      that.setData({
        remind: ''
      });
    }, 1000);
  },
  getUsertinfo:function(){
    var t=this
    wx.login({
      success(res) {

        if (res.code) {
          //发起网络请求
          var userInfo = ''
          app.console(res)
          // getauth()
          wx.getUserInfo({
            success: function (resq) {
              // app.console('get')
              userInfo = resq.userInfo
              var nickName = userInfo.nickName
              var avatarUrl = userInfo.avatarUrl
              var gender = userInfo.gender //性别 0：未知、1：男、2：女
              var province = userInfo.province
              var city = userInfo.city
              var country = userInfo.country
              var data = {
                nickName: nickName,
                avatarUrl: avatarUrl,
                gender: gender,
                province: province,
                city: city,
                country: country,
                code: res.code
              }
              // app.console(data)
              app.globalData.userInfo=data
              app.console('index_index')
              app.console(app.globalData.userInfo)
              util.setdata('userinfo', data)
            },
            fail: function (e) {
              app.console(e)
            }
          })


        } else {
          console.log('获取信息失败失败！' + res.errMsg)
        }
      }
    })
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