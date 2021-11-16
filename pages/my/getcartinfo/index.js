// pages/my/getcartinfo/index.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picture:null,
    card_number:null,
    pic_url: '/images/card1.jpg',
    user_phone:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    var t = this;
    if (e.image) {
      t.setData({
        picture: app.globalData.host+e.image,
        card_number:e.card_number,
      })
    } else {
      var pic_url = t.data.pic_url
      var card_number = e.card_number
      var user_phone = e.user_phone
      t.setData({
        picture: pic_url,
        user_phone: 'TEL：' + user_phone,
        // content: res.msg,
        card_number: card_number,
      });
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