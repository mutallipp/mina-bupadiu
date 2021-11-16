//index.js
//获取应用实例
var app = getApp();
var utils=require('../../utils/util.js')
var sad='/images/sadd.jpg'
var card_icon='/images/thankyou.jpg'
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
    result:'',
    pic_url:'/images/card1.jpg',
    remind:false,
    empty:0,
    code:0,
    user_phone:'',
    content:'',
    card_number:null,
    picture:null,
    data_time:null,

  },
  onLoad: function () {
    var that = this;
    that.check_login()
    var user_info=app.globalData.userInfo
    app.console(app.globalData.userInfo)
    app.console('userIndex')
    app.console(app.globalData.userInfo)
    wx.setNavigationBarTitle({
      title: app.globalData.shopName
    });
    
      loadingMoreHidden: false
      
    // that.toSearch()
  },
  check_login:function(){
    // 检查本地学号信息存在不，存在就赋值给globalData
    var user_info1 = utils.getdata('user_info1')
    if (!user_info1){
      wx.login({
        success(res){
          
          if (res.code) {
            app.console(res.code)
            wx.request({
              url: app.globalData.domain + '/loginchek/',
              method: 'POST',
              data: { 
                'code': res.code
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
              },
              success(res) {
                app.console(res.data)
                if (res.data.code==200){
                  utils.setdata('user_info1', res.data.data)
                  utils.setdata('token', res.data.token)
                  app.globalData.user_info1 = res.data.data
                  app.globalData.is_login = 1
                }else{ 

                  app.globalData.is_login=0
                  // 意思就是服务器上找不到这个用户，重新填写手机号信息is_login
                  // wx.navigateTo({
                  //   url: '/pages/my/myinfo',
                  // })
                }
              },
              fail(res) {
                app.console(res)
              }
            })
        }else{}
        }
      })
    
    }else{
      //本地存在
      app.globalData.is_login=1   
      app.globalData.user_info1 = user_info1
     }
  },
  scroll: function (e) {
    var that = this, scrollTop = that.data.scrollTop;
    that.setData({
      scrollTop: e.detail.scrollTop
    });
  },
  //事件处理函数
  listenerSearchInput: function (e) {
    this.setData({
      searchInput: e.detail.value
    });
  },
  search :function(e){
    var t = this
    if (app.globalData.is_login != 1) {
      utils.is_login()
    } else { 
      wx.navigateTo({
        url: '/pages/user/detail?data=' + t.data.searchInput,
      })
    }
  },
  toSearch: function (e) {
    var t=this
    if (app.globalData.is_login != 1) {
      utils.is_login()
    } else { 
      if (t.data.searchInput && t.data.searchInpu!=''){
      wx.showToast({
        title: '搜索中。。',
        icon:'loading',
        duration:10000,
      })
      t.setData({
        card_number: t.data.searchInput,
      })
    utils.requests('/search/', t.data.searchInput,
     function(res){
       app.console(res)
       if(res.code==200){
        //  200 是两种情况 1 是别人搜索失主的时候找到信息，2失主在找卡的时候别人上传 了卡。
        // 所以按照image判断要放默认照片还是
         app.console(res)
         if (res.image){
          //  别人找到ta的卡上传了
           t.setData({
             picture: app.globalData.host+res.image,
             data_time: res.created_time,
             user_phone: 'TEL：' + res.user_phone,
             content: res.msg,
             card_number:t.data.searchInput,
           });
         }else{
          //  别人在找失主,所以放默认的北邮的一卡通
           t.setData({
             picture: card_icon,
             user_phone: 'TEL：' + res.user_phone,
             content: res.msg,
             card_number: t.data.searchInput,
           });
         }

      //  app.console(res.image)
       }else{
        //  不是200,意思就是找不到了,所以用sad的照片
         t.setData({
           picture: sad,
           content: res.msg,
           card_number: t.data.searchInput,
           user_phone:'',
         })
       }
     }
     )
     wx.hideToast()
    // t.setData({
    //   result: t.data.searchInput
    // });
    }else{app.alert({'content':'搜索内容不能为空'})}
    }
  },
  makephone:function(){
    var t=this;
    var user_phone = t.data.user_phone
    if (user_phone){
      wx.makePhoneCall({
        phoneNumber: user_phone,
      })
    }
  },
  tapBanner: function (e) {
    if (e.currentTarget.dataset.id != 0) {
      wx.navigateTo({
        url: "/pages/food/info?id=" + e.currentTarget.dataset.id
      });
    }
    
  },
  toDetailsTap: function (e) {
    wx.navigateTo({
      url: "/pages/food/info?id=" + e.currentTarget.dataset.id
    });
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
