// pages/lpdetail/lpdetail.js
import * as echarts from '../../ec-canvas/echarts';

let sdata = [0,0,0,0,0];
let stdata = [0,0,0,0,0];
let xdataOne = ['<100','100~150','150~200','200~250','>250'];
let xdataTwo = ['<90','90~110','110~130','130~150','>150'];
let titleOne = '总价分布(万/套)';
let titleTwo = '面积分布(平米/套)'
//let chart = null;
function setOption(chart,sdata,xdata,title) {
  // chart = echarts.init(canvas, null, {
  //   width: width,
  //   height: height,
  //   devicePixelRatio: dpr // new
  // });
  // canvas.setChart(chart);
  var option = {
    title:{
      show:true,
      text:title,
     padding:[16,0,10,0],
      left:'center',
      right:'center',
      textStyle:{
        fontSize:15,
        fontWeight:'normal',
        fontWeight:'bold',
      }
    },
    color: ['#3398DB'],
    //backgroundColor:'#F8F8F8',
    // tooltip: {
    //     trigger: 'axis',
    //     axisPointer: {            // 坐标轴指示器，坐标轴触发有效
    //         type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
    //     }
    // },
    grid: {
        top:50,
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
        // show:true,
        // borderWidth:1,
        // borderColor:'red'
    },
    xAxis: [
        {
            type: 'category',
            // name: '万',
            // nameLocation :'end',
            nameTextStyle:{
              fontSize:5,
              align:'center'
            },
            data:xdata,
            axisLabel:{
                show:true,
                interval:0,
            },
            axisTick: {
                alignWithLabel: true,
                interval:0,
                lineStyle:{
                  widht:1
                }
            }
        }
    ],
    yAxis: [
        {
          show:true,
          type: 'value',
          name:'户数',
          nameGap:8,
          splitLine:{
            show:false
          }
        }
    ],
    series: [
        {
            name: '户',
             type: 'bar',
             silent:true,
            
             clickable:false,
            //  stack: '总量',
             barWidth: '60%',
             label: {
              show: true,
              position: 'top'
           },
            data: sdata
        },
        
    ]
};
    
  chart.setOption(option);
  //return chart;
  }
const app = getApp();
var httpClient = require('../../utils/httpclient.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lpitem:{},
    ldlist:[],
    id:16,
    isRegUp:true,
    isPlanUp:true,
    is_loading:true,
    choose_name:'备案时间',
    choose_way:1,
    choose_way_temp:1,
    choose_items:[
      {'value':1,name:'备案时间',checked: true},
      {'value':2,name:'层数升序',checked:false},
      {'value':3,name:'层数降序',checked: false},
      {'value':4,name:'楼号升序',checked: false},
      {'value':5,name:'楼号降序',checked: false},
    ],
    ec:{
      lazyLoad:true
      //onInit: initChart
    },
    ec2:{
      lazyLoad:true
     // onInit: initChart
    },
   
    is_radio_show:false,
    is_echart_show:true
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(JSON.stringify(options.id))
     this.setData({
      id:options.id
    });
       this.oneComponent = this.selectComponent('#mychart-first');
       this.twoComponent = this.selectComponent('#mychart-second');
    
    this.getLpanDetail();
  },

  // onReady:function() {
       
  //   },
    onShow:function(){
      console.log("onShow");
      // if(!this.data.is_first_load && this.data.isNewOpen){
      //   this.setData({
      //     is_loading:true,
      //     page:1,
      //   });
      //    this.getLpanDetail();
      // }
      // if(!this.data.isNewOpen){
      //   this.setData({
      //     isNewOpen:true
      //   });
      // }
    },
     /**
  * 分享到微信好友
  */
 onShareAppMessage:function(res){
  return{
   title: this.data.lpitem.ad_name+'备案价',
   path: '/pages/lpdetail/lpdetail?id='+this.data.id
  }
},
    init_one: function (sdata) {           //初始化第一个图表
      this.oneComponent.init((canvas, width, height,dpr) => {
          const chart = echarts.init(canvas, null, {
              width: width,
              height: height,
              devicePixelRatio: dpr // new
          });
          setOption(chart, sdata,xdataOne,titleOne)
          this.chart = chart;
          return chart;
      });

    },
      init_two: function (stdata) {        //初始化第二个图表
        this.twoComponent.init((canvas, width, height,dpr) => {
            const chart = echarts.init(canvas, null, {
                width: width,
                height: height,
                devicePixelRatio: dpr // new
            });
            setOption(chart,stdata,xdataTwo,titleTwo)
            this.chart = chart;
            return chart;
        });
    },
    regInfoUpDown:function(){
        if(this.data.isRegUp){
          this.setData({
            isRegUp:false
          })
        }else{
          this.setData({
            isRegUp:true
          })
        }
    },
    planInfoUpDown:function(){
      if(this.data.isPlanUp){
        this.setData({
          isPlanUp:false
        })
      }else{
        this.setData({
          isPlanUp:true
        })
      }
  },
    radioChange:function(e){
      console.log('radio发生change事件，携带value值为：', e.detail.value)
      const items = this.data.choose_items
      for (let i = 0, len = items.length; i < len; ++i) {
         if(items[i].value == e.detail.value){
          items[i].checked = true,
          this.setData({
            choose_name:items[i].name,
            choose_way:items[i].value,
            is_loading:true
          })
         }else{
          items[i].checked = false
         }
      }
      console.log("item==="+JSON.stringify(items));
      this.setData({
        choose_items:items,
      })
    },
    showRadio:function(){
      if(!this.data.is_radio_show){
        this.setData({
          choose_way_temp:this.data.choose_way,
          is_radio_show:true,
          is_echart_show:false
        })
      }else{
        this.setData({
          is_radio_show:false,
          is_echart_show:true
        })
      }
      
    },
    catchtouchmove:function(){
     
    },
    bindRadioSelect:function(){
      this.setData({
        is_radio_show:false,
        is_echart_show:true
      });
      /**页面滚动，防止短手机，选择之后出现选择内容看不见，后期或需要改进 */
      wx.pageScrollTo({
        scrollTop: 600,
        duration: 300
    });
    if(this.data.choose_way!=this.data.choose_way_temp){
      this.getLdSort();
    }
    },
    /**点击进入楼栋详情页时对isNewopen字段进行处理 */
    goToLdDetail:function(){
      console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
  
      // this.setData({
      //   isNewOpen:false
      // });
    },
  /**
   * http请求
   */
  getLpanDetail:function(){
    var result = httpClient.requestTask('first.lpanDetail/getDetail',{'id':this.data.id},'post');
    result.then(res=>{
      console.log("res==="+JSON.stringify(res));
      if(res.data){
        res.data.data.land_area =  parseFloat(res.data.data.land_area/10000).toFixed(1);
        this.setData({
          lpitem:res.data.data,
        });
        sdata = this.data.lpitem.sdata;
        stdata = this.data.lpitem.stdata;
        this.init_one(sdata);
        this.init_two(stdata);
        console.log("sdata=="+sdata+"stdata=="+stdata);
        //是否是新备案
        var timestamp = Date.parse(new Date());  
        timestamp = timestamp / 1000; 
        res.data.data.ldong_list.forEach(item=>{
          if(item.gen_time !=null){
           
            var repTime = item.gen_time.replace(/-/g, '/');//用正则主要是把“2019-05-20 00:00:00”转换成“2019/05/0 00:00:00”兼容ios
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
          
          });
        this.setData({
          ldlist:res.data.data.ldong_list,
          is_loading:false
        });
        // if(this.data.is_first_load){
        //    this.setData({
        //     is_first_load:false
        //    });
        // }
      }else{
        wx.showToast({

          title: '网络连接超时',
          // icon: 'success',
          duration: 2000
        })
      }
        

    },err=>{
      console.log("err ==" +err)
      this.setData({
        is_loading:false
      });
    });
  },
  /**
   * 楼栋排序接口
   */
  getLdSort:function(){
    var result = httpClient.requestTask('first.lpanDetail/sort',{'lp_id':this.data.id,'way':this.data.choose_way},'post');
    result.then(res=>{
      console.log("res==="+JSON.stringify(res));
      if(res.data){
      
        //是否是新备案
        var timestamp = Date.parse(new Date());  
        timestamp = timestamp / 1000; 
        res.data.data.forEach(item=>{
          if(item.gen_time !=null){
            var repTime = item.gen_time.replace(/-/g, '/');//用正则主要是把“2019-05-20 00:00:00”转换成“2019/05/0 00:00:00”兼容ios
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
          });
        this.setData({
          ldlist:res.data.data,
          is_loading:false
        });
        // if(this.data.is_first_load){
        //    this.setData({
        //     is_first_load:false
        //    });
        // }
      }else{
        wx.showToast({
          title: '网络连接超时',
          // icon: 'success',
          duration: 2000
        })
      }
        

    },err=>{
      console.log("err ==" +err)
      this.setData({
        is_loading:false
      });
    });
  },


})