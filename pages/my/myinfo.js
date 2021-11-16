// pages/my/myinfo.js
var app=getApp();
var utils=require('../../utils/util.js');
var img_icon = '/images/camera.png'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ob: null,
    logo: img_icon,
    tem:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var t=this;
    app.console('myinfo')
    var data = app.globalData.user_info1
    app.console(app.globalData.user_info1)
    if(data){
    t.setData({
      ob:data
    })
    }
    // this.check_login()
  },
  saomiao:function(){
    let _this = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#f7982a",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            _this.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            _this.chooseWxImage('camera')
          }
        }
      }
    })
  },
  chooseWxImage: function (type) {
    let _this = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        app.console(res);
        _this.setData({
          logo: res.tempFilePaths[0],
        })
      }
    })
  },
  
  bindSave: function (e) {
    var t=this;
    var formId=e.detail.formId
    app.console(e.detail.value.switch)
    // var user_info1 = utils.getdata('user_info1')
    // app.console(e.detail.value)
    if (!e.detail.value.number) {
      app.alert({ 'content': '卡号不能为空' })
    } else if (!e.detail.value.phone) {
      app.alert({ 'content': '手机号不能为空' })
    } else {
      app.console('bindsave')
      app.console(e.detail.value)
      var data = e.detail.value
      // utils.setdata('user_info1', data)
      t.setData({
        tem: data
      })
      app.globalData.user_info1 = data
      data['formId'] = formId
      t.post_info(data)
      app.globalData.is_login=1;

    }

  },
  bindCancel:function(){
    wx.navigateBack({

    })
  },
  check_login: function () {
    var t=this
    if (!app.globalData.user_info1){
      var user_info1 = utils.getdata('user_info1')
      if (user_info1) {
        
        t.setData({
          ob: user_info1
        })
      } else { 
        // 本地拿不到信息
        // app.globalData.is_login=0
      }
    }
  },
  post_info:function(user_info1){
    var t=this
    var data=user_info1
    var token = utils.getdata('token')
    var user_info = app.globalData.userInfo
    if(user_info){
      // data['code'] = user_info.code;
      
    wx.login({
      success(res){
        
        app.console('myinfo_code')
        app.console(data.formId)
        if(res.code){
          data['code'] = res.code;
          data['nickName'] = user_info.nickName;
          data['avatarUrl'] = user_info.avatarUrl;
          data['gender'] = user_info.gender;
          data['province'] = user_info.province;
          data['city'] = user_info.city;
          data['country'] = user_info.country;
          if(token){
          data['token'] = token;
          }else{
            data['token'] ='';
          }
          wx.showToast({
            title: '保存中。。',
            icon:'loading',
            duration:10000

          });
          wx.request({
            url: app.globalData.domain + '/login/',
            method: 'POST',
            data: data,
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success(res) {
              if (res.data.code==200){
                if (res.data.token) {
                  var token = res.data.token
                  utils.setdata('token', token)
                  var ob=t.data.tem
                  utils.setdata('user_info1', ob)
                  t.setData({
                    ob: ob
                  })
                  wx.hideToast()
                  wx.navigateBack({})
                  app.show('保存成功')
                  }

                app.console(res.data.msg)
              }else{
                wx.hideToast()
                app.alert({ 'content': res.data.msg})
              }
            },
            fail(res){
              app.console(res)
              app.alert({ 'content':'网络情况不好~~~' })
            }
          })
          
        }else{app.console('code获取失败~~~~~')}
      }
    })

    }else{ 
      app.console('获取user_info失败了')
    }
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
})