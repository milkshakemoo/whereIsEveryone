var app = getApp()
var Bmob = require('../../utils/Bmob-1.6.1.min.js');
var query = Bmob.Query("data");
var query2 = Bmob.Query("data");

Page({
  onLoad: function (options) {
    var markers_new = []
    console.log(options.roomNum)
    query.equalTo("roomNum", "==", parseInt(options.roomNum));
    query.order("name");
    query.find().then(res => {
      //存储房间里一共有多少个学生
      console.log(res)
      for (var i = 0; i < res.length; i++) {
        markers_new.push({
          longitude: res[i].longitude,
          latitude: res[i].latitude
        });
      }
      console.log(markers_new)
      this.setData({
        markers: markers_new,
        long: res[0].longitude,
        lat: res[0].latitude,
        map: true
      })
    })
  },

  data: {
    map: false,
    long: 116.349686,
    lat: 39.961758,
    markers: [],
    covers: [{
      longitude: 116.349686,
      latitude: 39.961758,
      //iconPath: '../images/car.png',
      rotate: 10
    }]
  }
})