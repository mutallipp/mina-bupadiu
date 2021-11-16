var app = getApp();
var utils=require("../../utils/util.js")
var img_icon ='/images/camera.png'
Page({
  data: {
    logo: img_icon,
    card_number:'',
    userInfo: {},
    checkbox:'',
    
  },
  onShow: function () {
    if (app.globalData.is_login != 1) {
      utils.is_login()

    } else { }
  },

  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      // url: '../logs/logs'
      //   url: '../load/load'
    })
  },
  onLoad: function () {
    // wx.navigateTo({
    //   url: '/pages/my/managecart/card?card_number=11111111',
    // })
    console.log('onLoad')
  },
  xieyi:function(e){
    app.console('协议被调用了')
    wx.navigateTo({
      url: '/pages/upload/agreement',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  checkbox:function(e){
    var t=this;
    app.console('checkbox发生change事件，携带value值为：', e.detail.value)
    app.console(e.detail.value[0] =='checkbox')
    if (e.detail.value[0] == 'checkbox') {
      app.console('协议同意了')
      t.setData({
        checkbox:1
      })
    } else {
      app.console('协议不同意了')
      t.setData({
        checkbox: ''
      })
    }
  },
  checkbox_cancel:function(){
    var param = { content: '你没有同意免责声明协议书。请先认真读它然后勾选“免责声明”' };
    app.alert(param)
  },

  test1:function(e){
    app.console(e.detail.value.checkbox)
    if (e.detail.value.checkbox && e.detail.value.checkbox!=''){
      app.console('协议同意了')
    }else{
      app.console('协议不同意了')
    }
  },

// 上传按钮
  bindSaveTap: function (e) {
    var t=this;
    var card_number=app.globalData.user_info1.number
    var formId = e.detail.formId;
    if (card_number == e.detail.value.name){
      app.alert({'content':'你找到了自己一卡通？？？？？？'})
    }else{
    var token=utils.getdata('token')
      if (!e.detail.value.name){
        var param={ content:'学号不能为空'};
        app.alert(param)
      }else{
        wx.login({
          success(r){
            if(r.code){
              var formData = {
                // uid: util.getUserID(),
                card_number: e.detail.value.name,
                token: token,
                code: r.code,
                formId: formId,

              }
              // console.log(formData)
              if (t.data.logo != img_icon) {
                utils.upload_file('/uploadcard/', t.data.logo, 'card', formData,
                  function (res) {
                    
                    // 成功
                    // app.console("成功")
                    // console.log(res.code);
                    if(res.code==200){
                      var new_card=res.data;
                      app.console('carddata-----' + res.data)
                      var card = wx.getStorageSync('card')
                      app.console('card-----'+card)
                      if(card){
                        card.push(new_card);
                        wx.setStorage({
                          key: 'card',
                          data: card,
                        })
                      }
                    }
                    var card=res.data;
                    t.setData({
                      logo: img_icon,
                      card_number: ''
                    })
                    app.show('上传成功')

                  },
                  function () {
                    // 失败
                    app.show('上传失败', 0)
                  })
              } else {
                var param = { content: '图片不能为空' };
                app.alert(param)
              }
            }
          }
        })
        }
    }
  },
// 选择图片
  chooseImageTap: function () {
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
