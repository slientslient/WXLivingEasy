// pages/lddetail/lddetail.js
const app = getApp();
var httpClient = require('../../utils/httpclient.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:1920,
    lpName:'北雁湖护金茂湾',
    is_loading:true,
    lditem:{},
    tableData: [
      ['00户','01户', '02户', '03户', '04户', '05户', '06户','07户']
    ],
    fixedColsNum: 1,
    tbodyHeight: 660, 
    roomDetail:{},
    lpanLevelMax:1,
    levelList:[],
    isRoomShow:false,
    roomResult:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     console.log(JSON.stringify(options.id))
     this.setData({
      id:options.id,
      lpName:options.lpName
    });
    this.getDetail();
  },
     /**
  * 分享到微信好友
  */
 onShareAppMessage:function(res){
  return{
   title: this.data.lpName+' '+this.data.lditem.ld_name+'栋备案价',
   path: '/pages/lddetail/lddetail?id='+this.data.id+'&lpName='+this.data.lpName
  }
},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  // onReady: function () {

  // },

  /**
   * 生命周期函数--监听页面显示
   */
  // onShow: function () {

  // },

 
  //http请求
  getDetail:function(){
    var result = httpClient.requestTask('first.ldongDetail/getDetail',{'id':this.data.id},'post');
    result.then(res=>{
     if(res.data){
       console.log("res.data.data=="+JSON.stringify(res.data.data));
       var tableData = [];
       var tableRow = [];
       tableRow.push('00户');
       res.data.data.type_list.forEach(item=>{
         
          item.avg_single_price = Math.round(item.avg_single_price);
          item.med_single_price = Math.round(item.med_single_price);
          item.med_total_price = parseFloat(item.med_total_price/10000).toFixed(1);
          item.med_area = parseFloat(item.med_area).toFixed(1);
          if(item.room_num !='整体'){
          tableRow.push(item.room_num+'户');
         }
         
       });
      //  var roomResult = res.data.data.room_result;
      //  this.setData({
      //   roomResult:roomResult
      //  })
       tableData.push(tableRow);
       var tableItem = {};
       var lpanLevelMax =1;
       var levelList = [];
       for(var row = 0;row<res.data.data.room_result.length;row++){
           tableRow = [];
         for(var col = 0;col<res.data.data.room_result[row].length;col++){
          tableItem  = res.data.data.room_result[row][col];
          if(col==0){
            tableRow.push(tableItem.floor_level);
          }
          if(col==0 && row==0){
            lpanLevelMax = tableItem.floor_level;
            for(var index=lpanLevelMax;index>0;index--){
              levelList.push(index);
            }
           }
           tableItem.building_area=  parseFloat(tableItem.building_area).toFixed(1);
           tableItem.single_price = Math.round(tableItem.single_price);
           tableItem.total_price = parseFloat(tableItem.total_price/10000).toFixed(1);
           tableItem.inside_area = parseFloat(tableItem.inside_area).toFixed(1);
           tableItem.pub_area = parseFloat(tableItem.pub_area).toFixed(1);
            tableRow.push(tableItem);
            //  tableRow.push(innerData.floor_level,innerData.room_name,,Math.round(innerData.single_price),parseFloat(innerData.total_price/10000).toFixed(1),parseFloat(innerData.inside_area).toFixed(1),parseFloat(innerData.pub_area).toFixed(1),innerData.remark);
            //  console.log(tableRow);
         }
         tableData.push(tableRow);
       }
       res.data.data.room_special.forEach(item=>{
        item.building_area=  parseFloat(item.building_area).toFixed(1);
        item.single_price = Math.round(item.single_price);
        item.total_price = parseFloat(item.total_price/10000).toFixed(1);
        item.inside_area = parseFloat(item.inside_area).toFixed(1);
        item.pub_area = parseFloat(item.pub_area).toFixed(1);
       });
       this.setData({
         is_loading:false,
         lditem:res.data.data,
         tableData:tableData,
         lpanLevelMax:lpanLevelMax,
         levelList:levelList,
       });
     }else{
      wx.showToast({
        title: '网络连接超时',
        //icon: 'fail',
        duration: 2000
      })
     }
    },err=>{
      console.log("err=="+err);
      this.setData({
        is_loading:false,
      })
    });
  },
  onMyEvent:function(e){
    //console.log("------------------------"+JSON.stringify(e.detail));
    //console.log("------------"+JSON.stringify(this.data.levelList));
    var roomDetail = e.detail;
    //console.log("---------------"+JSON.stringify(roomDetail));
    // roomDetail.building_area =  parseFloat(roomDetail.building_area).toFixed(2);
    // roomDetail.single_price = parseFloat(roomDetail.single_price).toFixed(2);
    // roomDetail.total_price = parseFloat(roomDetail.total_price/10000).toFixed(2);
    // roomDetail.inside_area = parseFloat(roomDetail.inside_area).toFixed(2);
    // roomDetail.pub_area = parseFloat(roomDetail.pub_area).toFixed(2);
    roomDetail.innerPercent = parseFloat(roomDetail.inside_area/roomDetail.building_area*100).toFixed(2);
    roomDetail.pubPercent = parseFloat(roomDetail.pub_area/roomDetail.building_area*100).toFixed(2);
    roomDetail.levelHeight = Math.round(308/this.data.lpanLevelMax);
    console.log('-------------------',roomDetail.levelHeight);
    this.setData({
      isRoomShow:true,
      roomDetail:roomDetail
    });
  },
  cancelPopShow:function(){
    this.setData({
      isRoomShow:false
    });
  }
})