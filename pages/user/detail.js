//index.js
//获取应用实例
var app = getApp();
var utils = require('../../utils/util.js')
var sad = '/images/sadd.jpg'
var card_icon = '/images/thankyou.jpg'
Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    loadingHidden: false, // loading
    swiperCurrent: 0,
    categories: [],
    activeCategoryId: 0,
    goods: [],
    scrollTop: "0",
    loadingMoreHidden: true,
    searchInput: '',
    result: '',
    pic_url: '/images/card1.jpg',
    remind: false,
    empty: 0,
    code: 0,
    user_phone: '',
    content: '',
    card_number: null,
    picture: null,
    data_time: null,
    send_msg:null,
    upload:null,

  },
  onLoad: function (e) {
    var t = this;
    
    if (t.data.searchInput){
   
    }else{
      app.console('detail')
      t.setData({
        searchInput: e.data
      })

      t.toSearch()
      app.console(e.data)
    }

  },
  toUpload:function(){
    wx.switchTab({
      url: '/pages/upload/card',
    });
  },
  sendMsg:function(){
    var t=this
    var user_phone=app.globalData.user_info1.phone
    var card_number=t.data.searchInput
    wx.showModal({
      title: '温馨提示',
      content: '我们会把你的手机号提供给失主，以便失主联络你~~~',
      cancelText: '不',
      cancelColor: '#FF0000',
      confirmText: '好的',
      confirmColor: '#32CD32',
      success: function (res) {
        if (res.confirm) {
          if (user_phone) {
            wx.showToast({
              title: '发送中。。',
              icon: 'loading',
              duration: 10000,
            })
            utils.requests('/sendmsg/', card_number,
              function (res) {
                if (res.code == 200) {
                  wx.switchTab({
                    url: '/pages/user/index',
                  });
                  app.show('发送成功')

                } else {
                  app.show('发送成功')
                }
                app.console('send_msg--' + res)
              }
            )
            wx.hideToast()
          }
        } else if (res.cancel) {
          
        }


      },
      fail: function (res) { },
      complete: function (res) { },
    })

  },
  click_image:function(e){
    app.console(e.currentTarget.dataset.url)
    var url = e.currentTarget.dataset.url
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: [url] // 需要预览的图片http链接列表
    })
  },
  onShow:function(e){
    // app.console(e)
  },
  listenerSearchInput: function (e) {
    this.setData({
      searchInput: e.detail.value
    });
  },

  toSearch: function (e) {
    var t = this
    if (app.globalData.is_login != 1) {
      utils.is_login()

    } else {
      if (t.data.searchInput && t.data.searchInpu != '') {
        wx.showToast({
          title: '搜索中。。',
          icon: 'loading',
          duration: 20000,
        })
        t.setData({
          card_number: t.data.searchInput,
        })
        utils.requests('/search/', t.data.searchInput,
          function (res) {
            app.console(res)
            if (res.code == 200) {
              //  200 是两种情况 1 是别人搜索失主的时候找到信息，2失主在找卡的时候别人上传 了卡。
              // 所以按照image判断要放默认照片还是
              app.console(res)
              if (res.image) {
                //  别人找到ta的卡上传了
                t.setData({
                  picture: app.globalData.host + res.image,
                  data_time: res.created_time,
                  user_phone: 'TEL：' + res.user_phone,
                  content: res.msg,
                  card_number: t.data.searchInput,
                  send_msg: 0,
                  upload: 0,
                });
                wx.hideToast()
              } else {
                //  别人在找失主,所以放默认的北邮的一卡通
                t.setData({
                  picture: card_icon,
                  user_phone: 'TEL：' + res.user_phone,
                  content: res.msg,
                  card_number: t.data.searchInput,
                  send_msg: 0,
                  upload: 0,
                });
              }
              wx.hideToast()
              //  app.console(res.image)
            } else if (res.code == 100){
              // 发送对方丢卡通知
              t.setData({
                picture: sad,
                content: res.msg,
                card_number: t.data.searchInput,
                user_phone: '',
                send_msg:1,
                upload:0,
              })
              wx.hideToast()
            } else if (res.code == 101) {
              // 发送对方丢卡通知,没开启丢卡按钮
              t.setData({
                picture: sad,
                content: res.msg,
                card_number: t.data.searchInput,
                user_phone: '',
                send_msg: 0,
                upload: 0,
              })
              wx.hideToast()
            }else {
              //  不是200,意思就是找不到了,所以用sad的照片
              t.setData({
                picture: sad,
                content: res.msg,
                card_number: t.data.searchInput,
                user_phone: '',
                send_msg: 0,
                upload: 1,
              })
              wx.hideToast()
            }
          }
        )
        
        // t.setData({
        //   result: t.data.searchInput
        // });
      } else { app.alert({ 'content': '搜索内容不能为空' }) }
    }
  },
  makephone: function () {
    var t = this;
    var user_phone = t.data.user_phone
    if (user_phone) {
      wx.makePhoneCall({
        phoneNumber: user_phone,
      })
    }
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
