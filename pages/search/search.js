// pages/search/search.js
const app = getApp();
var httpClient = require('../../utils/httpclient.js');
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lpanlist:[],
    name:'',
    is_loading:false,
    is_over:false,
    is_zero:false,
    limit:10,
    page:1,
    loadMore:true,
    is_loadingMore:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    
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
    this.searchByName();
  }
 },


  bindinput:function(e){
    var name = utils.stripscript(e.detail.value);
    this.setData({
      lpanlist:[],
      page:1,
      name:name,
      is_over:false,
      is_zero:false,
      loadMore:true,
    });
    if(e.detail.value !=''){
      this.searchByName();
    }
    
  },
  searchByName:function(){
    var areaSearch = httpClient.requestTask('first.search/byName',{'name':this.data.name,'limit':this.data.limit,'page':this.data.page},'post');
     areaSearch.then(res=>{
       if(res.data){
          console.log("res.data.data.length=="+res.data.data.length)
          if(res.data.data.length === 0){
            this.setData({
              loadMore: false,
              is_zero:true
          })}
          else if (res.data.data.length < 10 ) {
            //console.log("length=="+res.data.data.length)
            this.setData({
                loadMore: false,
                is_over:true
            })
          }
          // console.log(JSON.stringify(res.data.data));
            var timestamp = Date.parse(new Date());  
            timestamp = timestamp / 1000;  
          // console.log("当前时间戳为：" + timestamp); 
            res.data.data.forEach(item=>{
              var repTime = item.update_time.replace(/-/g, '/');//用正则主要是把“2019-05-20 00:00:00”转换成“2019/05/0 00:00:00”兼容ios
            // console.log("返回时间：" + repTime);
              var tTamp = Date.parse(repTime);
              tTamp =tTamp/1000;
              //console.log("返回时间戳：" + tTamp)
              
              if((timestamp-tTamp)<14*24*3600){
                item.isNewReg = true;
              //  console.log('yes');
              }else{
                item.isNewReg = false;
                //console.log('no');
              }
              
            })
            var currenIndex = this.data.page-1;
            
            this.setData({
              ["lpanlist["+currenIndex+"]"]:res.data.data,
              is_loadingMore:false,
              is_loading:false,
            });
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
        is_loadingMore:false
      })
      console.log("search err=="+err);
     })
   }
  
})