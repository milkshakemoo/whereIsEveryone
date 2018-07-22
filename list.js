var app = getApp()
var Bmob = require('../../utils/Bmob-1.6.1.min.js');
var query = Bmob.Query("data");
var query2 = Bmob.Query("data");
var QQMapWX = require('qqmap-wx-jssdk.js');

var EARTH_RADIUS = 6378.137; //地球半径

function rad(d) {
  return d * Math.PI / 180.0;
}
function getDistance(lng1, lat1, lng2, lat2) {
  var radLat1 = rad(lat1);
  var radLat2 = rad(lat2);
  var a = radLat1 - radLat2;
  var b = rad(lng1) - rad(lng2);
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2)
    + Math.cos(radLat1) * Math.cos(radLat2)
    * Math.pow(Math.sin(b / 2), 2)));
  s = s * EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000;
  return s;//返回数值单位：公里
}

Page({
  
  onLoad:function(options){
    console.log("i am load")

    var demo = new QQMapWX({
      key: 'FUPBZ-WYGC4-TTKUG-DVHDO-R2RQF-HQBC6' // 必填
    });
   var that=this;
   console.log(options.id)
   that.setData({
     id: options.id
   })
   
   //通过id查询该人的房间号
  
   query.get(options.id).then(res => {
     console.log(res)
     that.setData({
       roomNum: res.roomNum
     })


     //查询房主
   
     console.log(that.data.roomNum)
     query2.equalTo("name", "==",that.data.roomNum);
     query2.find().then(res => {

       that.setData({
         hostlong:res[0].longitude,
         hostlati:res[0].latitude,
       })
       
       //查询和该房间号相同的人
       console.log(that.data.roomNum)
       query.equalTo("roomNum", "==", parseInt(that.data.roomNum));
       query.order("name");
       query.find().then(res => {
         //存储房间里一共有多少个学生
         console.log(res)
         that.setData({
           length:res.length-1
         })

         var distan = [];
         for (var i = 0; i < res.length; i++) {

           distan.push(getDistance(res[i].longitude, res[i].latitude, that.data.hostlong, that.data.hostlati));
           console.log(distan[i])
         }

         var url = []
         for (var i = 1; i < res.length; i++) {
           console.log(distan[i] + res[i].name)
           url.push({
             distance: distan[i],
             name: res[i].name
           });
         }

         that.setData({
           userList: url
         })

       });

     })


   }).catch(err => {
     console.log(err)
   })
   

  },
  

  refresh:function(){
    var that=this;
    console.log("i am refresh")
     
    //查询房主是否存在
    console.log(that.data.roomNum)
    query2.equalTo("name", "==", that.data.roomNum);
    query2.find().then(res => {

      if(res == ''){
        //退出房间
        wx.showModal({
          title: '提示',
          content: '您所在的房间没了',
          success: function (res) {
            if (res.confirm) {
              console.log('点击确定')
            } else {
              console.log('点击取消')
            }
          }
        })
        wx.switchTab({
          url: '/pages/enter/enter'
        })
        

      }else{

      that.setData({
        hostlong: res[0].longitude,
        hostlati: res[0].latitude,
      })

      //查询和该房间号相同的人
      console.log(that.data.roomNum)
      query.equalTo("roomNum", "==", parseInt(that.data.roomNum));
      query.order("name");
      query.find().then(res => {
        console.log(res)
        that.setData({
          length: res.length-1
        })
        var distan = [];
        for (var i = 0; i < res.length; i++) {

          distan.push(getDistance(res[i].longitude, res[i].latitude, that.data.hostlong, that.data.hostlati));
          console.log(distan[i])
        }

        var url = []
        for (var i = 1; i < res.length; i++) {
          console.log(distan[i] + res[i].name)
          url.push({
            distance: distan[i],
            name: res[i].name
          });
        }

        that.setData({
          userList: url
        })

      });
      }

    })

  },


  leave:function(){
    var that=this;
   //将数据从库里删除，并重定向到enter页面
   console.log("i am leave")

   query.get(that.data.id).then(res => {
     //如果该用户是房主
   if(res.roomNum==res.name){

     query.equalTo("roomNum", "==", that.data.roomNum);
     query.find().then(todos => {
       todos.destroyAll().then(res => {
         console.log(res, 'ok')
       }).catch(err => {
         console.log(err)
       });
     })
    console.log("dao le chongdingxiangle")
    wx.switchTab({
       url: '/pages/enter/enter'
     })


   }else{

     query.destroy(that.data.id).then(res => {
       console.log(res)
     }).catch(err => {
       console.log(err)
     })
    
     console.log("dao le chongdingxiangle")
     wx.switchTab({
       url: '/pages/enter/enter'
     })

   }

   })

   
  },
  


  onHide:function(){
   
    console.log("i am hidden")

  },


  seeMap:function(e){
    var that=this;
    var index=parseInt(e.currentTarget.dataset.index);
    console.log(index)
    console.log(that.data.userList[index].name)
    query.equalTo("name", "==", parseInt(that.data.userList[index].name));
    query.find().then(res => {  
    wx.openLocation({
      longitude: Number(res[0].longitude),
      latitude: Number(res[0].latitude)
    })
  })

  },

  allMap:function(){

    var that=this;
    console.log("i will show all map")
    wx.navigateTo({
      url: '/pages/logs/logs?roomNum=' + that.data.roomNum
    })       
  },

  data: {
    id:"",
    userList:[],
    hostlong: 116.349686,
    hostlati: 39.961758,
    roomNum:0,
    length:0
    
  }
})