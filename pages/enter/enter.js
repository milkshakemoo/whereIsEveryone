const app = getApp()
var Bmob = require('../../utils/Bmob-1.6.1.min.js');
var query = Bmob.Query("data");
var canIUse= wx.canIUse('button.open-type.getUserInfo')

Page({
  
  data: {
    hiddenmodalput: true,
    name:2015210767,
    roomNum:167,
    long: 116.356709,
    lati: 39.962881,
    id:2
  },

  cancelM: function (e) {
    console.log("quxiaole")
    this.setData({
      hiddenmodalput: true,
    })
  },

  //点击确认后
  confirmM: function (e){
    var that=this;
    console.log(that.data.roomNum)
  
    query.equalTo("roomNum", "==", parseInt(that.data.roomNum));
    query.find().then(res => {
      if (res == '') {
        wx.showModal({
          title: '提示',
          content: '您输入的房间号不存在',
          success: function (res) {
            if (res.confirm) {
              console.log('点击确定')
            } else {
              console.log('点击取消')
            }

          }
        })

      }
      else{
        
        wx.getLocation({
          success: function (res) {
            console.log(res)

            that.setData({
              long: res.longitude,
              lati: res.latitude
            })
          
            query.set("roomNum", parseInt(that.data.roomNum))
            query.set("name", parseInt(that.data.name))
            query.set("longitude", that.data.long)
            query.set("latitude", that.data.lati)

            query.save().then(res => {

              that.setData({
                id: res.objectId
              })

              console.log(that.data.id)
              //转向令一个网页，带着id一起
              wx.navigateTo({
                url: '/pages/list/list?id=' + that.data.id
              })

            }).catch(err => {
              console.log(err)
            })

          }
        })

      }
   });
  
    },

  iroom: function (e) {
    this.setData({
      roomNum: e.detail.value
    })
  },

  iname: function (e) {
    this.setData({
      name: e.detail.value
    })
  },

  enterRoom:function(e){
   
    this.setData({
      hiddenmodalput: false,
    })

  },
 
 
 //新建房间时也一样
  newRoom:function (e) {
    var that = this;
    var hostname;

      hostname = Math.floor(Math.random() * 10000000);
      console.log(hostname);

    
    wx.getLocation({
      success: function (res) { 
        console.log(res)
        that.setData({
          long: res.longitude,
          lati: res.latitude,
          name:hostname,
          roomNum:hostname
        })

        query.set("roomNum", hostname) //房主名字固定
        query.set("name", hostname)
        query.set("longitude", res.longitude)
        query.set("latitude", res.latitude)
        query.save().then(res => {
          that.setData({
            id: res.objectId
          })
          //转向令一个网页，带着id一起
          wx.navigateTo({
            url: '/pages/list/list?id=' + that.data.id
          })
        }).catch(err => {
          console.log(err)
        })
    
  }

    })

  }

})