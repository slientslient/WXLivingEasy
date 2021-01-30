//index.js
//获取应用实例
const app = getApp();
var httpClient = require('../../utils/httpclient.js');
var districts = require('../../utils/districtData.js');
Page({
  data: {
    background: ['/image/table.png', '/image/tabel2.png', '/image/table3.png'],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    lpanlist:[],
    area_selected:'全合肥',
    area_selected_temp:'',
    is_selected:false,
    districtsData : districts.districtsData,
    ranges:[],
    areas:[],
    value:[1,0],
    is_loading:true,
    is_over:false,
    limit:10,
    page:1,
    loadMore:true,
    is_loadingMore:false,
    is_area_select_scroll:false,
    is_loading_pull:false,
    is_first_load:true,
    isNewOpen:true
    
  },
  //事件处理函数
 
  onLoad: function (options) {
    this.setData({
      area_selected:options.area
    })
    console.log("data1=="+JSON.stringify(districts.districtsData))
    //console.log("data2=="+JSON.stringify(this.data.districtsData));
    var ranges = [];
    var areas = [];
    this.data.districtsData.forEach(function(item,index){
      ranges.push(item.name);
      if(index == 1){
        areas = item.areas;
      }
    });
    this.setData({
      ranges:ranges,
      areas:areas
    });
   this.searchByArea();
   
  },
  onShow: function () {
    console.log("onShow");
    if(!this.data.is_first_load && this.data.isNewOpen){
      this.setData({
        is_loading:true,
        page:1,
       
      });
      this.searchByArea();
    }
    if(!this.data.isNewOpen){
      this.setData({
        isNewOpen:true
      });
    }
    
  },
  // onLoad:function(){
  // wx.stopPullDownRefresh({
  //   success: (res) => {
  //    
  //   },
  // })
  // },
/**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("onPullDownRefresh");
    this.setData({
      is_loading_pull:true,
      area_selected:'全合肥',
      page:1
    });
    this.searchByArea();
  },
/** 往上滑动 刷新 分页数据 */
 onReachBottom:function(){
  console.log("scrolltolower");
  let _this = this;
  if (this.data.loadMore) {
    this.setData({
      is_loadingMore:true,
      page:_this.data.page +1
    });
    this.searchByArea();
  }
 },
 /**
  * 分享到微信好友
  */
 onShareAppMessage:function(res){
  return{
   title: '合肥新房备案价格查询',
   path: '/pages/index/index'
  }
},
  selectArea:  function (e){
    console.log('aaaaaaaaaaaaaaaaaaaaaaa')
    this.setData({
    is_selected:true,
    area_selected_temp:this.data.area_selected,
    
   })
 },
 selectSure:function(){
  
  this.setData({
    is_selected:false,
   });
   
   let _this = this;
  //  _this.setData({
  //   loadMore:true,
  //   is_over:false,
  //   is_loading:true,
  //   lpanlist:[],
  //   page:1,
  //  })
  // setTimeout(function(){
  //   _this.setData({
  //     area_selected:_this.data.areas[_this.data.value[1]],
    
  //   });
  //   _this.searchByArea();
  //  },600);
  var count = 0;
   var interval = setInterval(function () {  
    console.log("不断调用");
    count = count+1;
    if( !_this.data.is_area_select_scroll){
      var area_select =_this.data.area_selected_temp;
      if(typeof(_this.data.areas[_this.data.value[1]]) == undefined){
        area_select = '全合肥';
      }else{
        area_select = _this.data.areas[_this.data.value[1]];
      }
      _this.setData({
        area_selected:area_select,
        loadMore:true,
        is_over:false,
        is_loading:true,
        lpanlist:[],
        page:1,
       })
       console.log("end.data.value==["+_this.data.value[0]+','+_this.data.value[1]+']')
       _this.searchByArea();
       clearInterval(interval);
     }
     if(count > 30){
      clearInterval(interval);
     }
  }, 100) ;

  
 },
 selectCancel:function(){
  this.setData({
    is_selected:false,
    area_selected:this.data.area_selected_temp
   })
 },
 bindpickstart(){
  console.log("bindpickstart")
  this.setData({
    is_area_select_scroll:true
  });
 },
 bindpickend:function(){
   console.log("bindpickend");
   this.setData({
    is_area_select_scroll:false
   })
   
 },
 /**设置级联 */
 bindChange:function(e){
   console.log("------------------------------------")
   this.setData({
    is_area_select_scroll:true
  });
   var districtsData = this.data.districtsData;
   //console.log("districtsData==",districtsData);
   var value = this.data.value;
   console.log("value==["+value[0]+','+value[1]+']')
   var current_value = e.detail.value;
   console.log("current_value==["+current_value[0]+','+current_value[1]+']')
   if(value[0] != current_value[0]){
     this.setData({
        areas : districtsData[current_value[0]].areas,
        value:[current_value[0],0]
     });
     console.log("area=="+this.data.areas);
   }else if(value[0] == current_value[0] &&  value[1] != current_value[1]){
    this.setData({
      value:[current_value[0],current_value[1]],
   });
  }
   console.log("this.data.value==["+this.data.value[0]+','+this.data.value[1]+']')
   this.setData({
    is_area_select_scroll:false
   })
   
   
 },
 catchtouchmove:function(){
   //console.log('nothing to do')
 },
//  scrolltolower:function(){
//  },

setIsNext:function(){
  console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
  this.setData({
    isNewOpen:false
  });
},


 searchByArea:function(){
  var areaSearch = httpClient.requestTask('first.search/byArea',{'area':this.data.area_selected,'limit':this.data.limit,'page':this.data.page},'post');
   areaSearch.then(res=>{
     if(res.data){
          if (res.data.data.length < 10) {
            this.setData({
                loadMore: false,
                is_over:true
            })
          }
          console.log(JSON.stringify(res.data.data));
            var timestamp = Date.parse(new Date());  
            timestamp = timestamp / 1000;  
            //console.log("当前时间戳为：" + timestamp); 
            res.data.data.forEach(item=>{
              if(item.update_time !=null){
                var repTime = item.update_time.replace(/-/g, '/');//用正则主要是把“2019-05-20 00:00:00”转换成“2019/05/0 00:00:00”兼容ios
                var tTamp = Date.parse(repTime);
                tTamp =tTamp/1000;
                
                if((timestamp-tTamp)<14*24*3600){
                  console.log("yes");
                  item.isNewReg = true;
                }else{
                  item.isNewReg = false;
                }
              }else{
                item.isNewReg = false;
              }
              
            })
            var currenIndex = this.data.page-1;
            
            this.setData({
              ["lpanlist["+currenIndex+"]"]:res.data.data,
              is_loadingMore:false,
              is_loading:false,
              is_loading_pull:false,
              
            });
            if(this.data.is_first_load){
              this.setData({
                is_first_load:false,
              });
            }
            wx.stopPullDownRefresh()
        }else{
          wx.showToast({
            title: '网络连接超时',
            // icon: 'success',
            duration: 2000
          })
        }
   },err=>{
    this.setData({
      is_loading:false,
      is_loadingMore:false,
      is_loading_pull:false
    })
    console.log("search err=="+err);
    wx.stopPullDownRefresh()
   })
 }


})

