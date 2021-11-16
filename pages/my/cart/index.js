// pages/my/history.js
var app=getApp();
var utils=require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: '',
    host: app.globalData.host,
    // order_list:[],
    statusType: ["还没还给失主", "已经还给失主了"],
    status: [ "1", "0"],
    currentType: 0,
    tabClass: ["", "", "", "", "", ""],
    is_status:null,
    no_status:null,
    card:null,
  },
  statusTap: function (e) {
    var curType = e.currentTarget.dataset.index;
    this.data.currentType = curType;
    this.setData({
      currentType: curType
    });
    this.onShow();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.check_card();
  },

  check_card:function(){
    var t=this;
    var card = wx.getStorageSync('card')
    app.console(card)
    if(card==0|!card){
      app.console('card==0')
      // 本地不存在卡了就从服务器上拿
      t.get_card()
    }else{
      app.console('card!=0')
      // 本地存在就放内存上
      var data = utils.getdata('card')
      // app.console(data.length)
      t.setData({
        card: data
      })
    }
    t.onShow()
  },

  get_card:function(){
    var t=this
        wx.showToast({
          title: '加载中。。。',
          icon:'loading',
          duration:10000,
        })
          utils.requests('/getcard/', '',
          function(res){
            if (res.code == 200){
              app.console(res.data)
              var is_status=[];
              var no_status=[];
              var data = res.data;
              t.setData({
                card:data
              })
              wx.setStorage({
                key: 'card',
                data: data ,
              })

            }else{
              app.console('get_card函数失败')
            }
          }
          )
      wx.hideToast()
  },

  give:function(e){
    var t=this;
    // app.console(e.currentTarget.dataset.id)
    // app.console(e.currentTarget.dataset.index)
    wx.showModal({
      title: '温馨提示',
      content: '你已经把卡还给了失主？',
      confirmText:'是的',
      // confirmColor: '	#32CD32',
      cancelText:'还没',
      // cancelColor:'	#FF0000',
      success(res){
        if (res.confirm) {
          // console.log('用户点击确定')
          var data = e.currentTarget.dataset
          var card = t.data.card;
          app.console(data.id)
          var id=data.id
          for(var i=0;i<card.length;i++){
            if(card[i].id==id){
              card[i].status = false;
            }
          }
          
          t.setData({
            card:card
          })
          wx.setStorage({
            key: 'card',
            data: card,
          })
          t.onShow()
          utils.requests('/cardgive/', data.id,
            function (res) {
            })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })


  },
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var t = this;
    // t.data.order_list = []
    // let data_list = t.data.order_list
    var data=t.data.card
    if (t.data.currentType==0){
        var m=[];
       for (var i = 0; i < data.length;i++) {
                if (data[i].status) {
                  m.push({
                    'id': data[i].id,
                    'status_desc': "还没还给失主",
                    'date': data[i].created_time,
                    'total_price': data[i].card_number,
                    'pic_url': app.globalData.host + data[i].image,
                  })
                  // t.setData({
                  //   order_list: is_status
                  // })
                }else{}

              }
      t.setData({
        order_list: m
      })
    }else{
      // 显示已经还给失主的
      var m=[]
      for (var i = 0; i < data.length; i++) {
        if (!data[i].status) {
          m.push({
            'id': data[i].id,
            'status_desc': "已经还给失主了",
            'date': data[i].updated_time,
            'total_price': data[i].card_number,
            'pic_url': app.globalData.host + data[i].image,
          })
          // t.setData({
          //   order_list: is_status
          // })
        } else { }

      }
      t.setData({
        order_list: m
      })
    }
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