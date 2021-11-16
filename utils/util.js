var app=getApp()

module.exports = {
  formatTime: formatTime,
  getUsertinfo: getUsertinfo,
  setuserinfo: setuserinfo,
  setdata: setdata,
  getdata: getdata,
  upload_file: upload_file,
  requests: pohhhh,
  is_login: is_login,

}


function is_login(){
  if(app.globalData.is_login==0){
    app.console('is_login 被调用了')
    // 全局变量里拿不到就，让他填信息去
    wx.showModal({
      title: '提示信息',
      content: '你还没完善个人信息，为了更好的得到服务，请完善个人信息~~~',
      cancelText: '不',
      cancelColor: '#FF0000',
      confirmText: '好的',
      confirmColor: '#32CD32',
      success: function(res) {
        if (res.confirm){
          wx.navigateTo({
            url: '/pages/my/myinfo',
          })
        } else if (res.cancel) {
          wx.switchTab({
            url: '/pages/user/index',
          });
        }

        
      },
      fail: function(res) {},
      complete: function(res) {},
    })
   
  }else{ 
    // 查询本地
    var user_info1 = getdata('user_info1')
    if (!user_info1) {
      wx.login({
        success(res) {

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
                if (res.data.code == 200) {
                  utils.setdata('user_info1', res.data.data)
                  utils.setdata('token', res.data.token)
                  app.globalData.user_info1 = res.data.data
                } else {

                  app.globalData.is_login = 0
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
          } else { }
        }
      })

    } else {
      //本地存在
      app.globalData.is_login = 1
      app.globalData.user_info1 = user_info1
    }
  }
}

function pohhhh(url, data, cb){
  app.console(url+','+data)
  var token=getdata('token')
  wx.login({
    success(r){
      if(r.code){
        app.console(token)
        wx.request({
          url: app.globalData.domain + url,
          method: 'POST',
          data: {
            key: data,
            token: token,
            code: r.code,
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: function (res) {
            app.console(res.data);
            if (res.statusCode == 200){
              typeof cb == "function" && cb(res.data)
            }else{
              typeof cb == "function" && fail(res.data);
            }
            
          },
          fail: function (res) {
            console.log(res);
            return typeof cb == "function" && cb(res.data)
          },
          complete:function(res){
            app.console(res)
          }
        })
      }
    }
  })

}



function upload_file(url, filePath, name, formData, success, fail) {
  wx.showToast({
    title: '上传中',
    icon:'loading',
    duration:10000,
  })
  console.log('a=' + filePath)
  wx.uploadFile({
    url: app.globalData.domain + url,
    filePath: filePath,
    name: name,
    header: {
      'content-type': 'multipart/form-data'
    }, // 设置请求的 header
    formData: formData, // HTTP 请求中其他额外的 form data
    success: function (res) {
      app.console(res);
      if (res.statusCode == 200 && !res.data.result_code) {
        
        typeof success == "function" && success(JSON.parse(res.data));
      } else {
        typeof fail == "function" && fail(res.data);
      }
    },
    fail: function (res) {
      console.log(res);
      typeof fail == "function" && fail(res);
    }
  })
  wx.hideToast()
}

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function getauth(){
wx.getSetting({
  success(res) {
    if (!res.authSetting['scope.userInfo']) {
      wx.authorize({
        scope: 'scope.userInfo',
        success() {
          // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
          // wx.startRecord()

        }
      })
    }
  }
})
}

function getUsertinfo(){
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
            setuserinfo(data)
            return data;
          },
        fail:function(e){
          app.console(e)
        }
        })


      } else {
        console.log('获取信息失败失败！' + res.errMsg)
      }
    }
  })
}



function requests(method ='POST',url,data){
  wx.request({
    method: 'POST',
    url: 'http://127.0.0.1:8000/bupadiu'+url,
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: data,
    success: function (re) {
      app.console(re)
      if (re.data.code == 200) {
        return re.data
        app.alert('')
      }

    }
  })
}

function setuserinfo(data){
  wx.setStorage({
    key: 'userinfo',
    data: data,
  })
}

function setdata(key,data){
  wx.setStorage({
    key: key,
    data: data,
  })
}
function getdata(key){
  try {
    const value = wx.getStorageSync(key)
    if (value) {
      // Do something with return value
      return value
    }
  } catch (e) {
    // Do something when catch error
    app.console('获取'+key+'失败了')
    // var value= get_user_info1(
    //   function(data){
    //     return value
    //   }
    // )
    
  }
  
}

function get_user_info1(success){
  if (app.globalData.user_info1) {
    app.console('get_user_info1 被调用了')
    


  } else {
    // 查询本地
    var user_info1 = getdata('user_info1')
    if (!user_info1) {
      wx.login({
        success(res) {

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
                if (res.data.code == 200) {
                  utils.setdata('user_info1', res.data.data)
                  utils.setdata('token', res.data.token)
                  app.globalData.user_info1 = res.data.data
                } else {

                  app.globalData.is_login = 0
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
          } else { }
        }
      })

    } else {
      //本地存在
      app.globalData.is_login = 1
      app.globalData.user_info1 = user_info1
    }
  }
}

// function get_login_code(success){
//   wx.login({
//     success(res){
//       if(res.code){
//         typeof success == "function" && success(code); 
//       }else{
//         app.console('获取code失败了')
//       }

//     }
//   })
// }

