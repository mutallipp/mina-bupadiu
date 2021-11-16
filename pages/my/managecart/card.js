var app = getApp();
var utils = require('../../../utils/util.js')
var sad = '/images/sadd.jpg'
var card_icon = '/images/thankyou.jpg'
Page({

  data: {
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    var t=this;
    if (e.user_phone) {
    var pic_url = t.data.pic_url
    var card_number = e.card_number
    var user_phone = e.user_phone
      t.setData({
        picture: pic_url,
        user_phone: 'TEL：' + user_phone,
        // content: res.msg,
        card_number: card_number,
      });
    } else {
      t.check_login()
    }
  },

  toSearch: function () {
    var t = this
    var card_number = t.data.card_number

        wx.showToast({
          title: '搜索中。。',
          icon: 'loading',
          duration: 10000,
        })

      utils.requests('/search/', card_number,
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
                  card_number: card_number,
                });
              } else {
                //  别人在找失主,所以放默认的北邮的一卡通
                t.setData({
                  picture: card_icon,
                  user_phone: 'TEL：' + res.user_phone,
                  content: res.msg,
                  card_number: card_number,
                });
              }

              //  app.console(res.image)
            } else {
              //  不是200,意思就是找不到了,所以用sad的照片
              t.setData({
                picture: sad,
                content: res.msg,
                card_number: card_number,
                user_phone: '',
              })
            }
          }
        )
        wx.hideToast()

  },
  check_login:function(e){
    var t=this;
    
    app.console('manage_card login check')

      if (!app.globalData.user_info1) {
        var user_info1 = wx.getStorageSync('user_info1')
        if (!user_info1) {
          utils.requests('loginchek', '',
            function (res) {
              if (res.code == 200) {
                wx.setStorage({
                  key: 'user_info1',
                  data: res.data,
                })
                app.globalData.user_info1 = res.data
                utils.setdata('token', res.token)
                t.setData({
                  card_number: card_number
                })
                t.toSearch(card_number)
              }
            }
          )
        } else {
          app.globalData.user_info1 = user_info1
          t.setData({
            card_number: user_info1.number
          })
          t.toSearch(user_info1.number)
        }
      }else{
        var user_info1 = app.globalData.user_info1
        t.setData({
          card_number: user_info1.number
        })
        t.toSearch(user_info1.number)
      }
      

  },

  click_image: function (e) {
    app.console(e.currentTarget.dataset.url)
    var url = e.currentTarget.dataset.url
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: [url] // 需要预览的图片http链接列表
    })
  },
  onShow: function (e) {
    // app.console(e)
  },
  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
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
})