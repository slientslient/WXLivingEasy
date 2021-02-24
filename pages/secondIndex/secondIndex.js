// pages/secondIndex/secondIndex.js
import * as echarts from '../../ec-canvas/echarts';

const app = getApp();
var httpClient = require('../../utils/httpclient.js');
var districts = require('../../utils/districtData.js');
var utils = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    area_selected:'全合肥',
    area_selected_temp:'',
    is_selected:false,
    districtsData : districts.districtsData,
    ranges:[],
    areas:[],
    value:[1,0],
    is_area_select_scroll:false,//地区选择框
    time_selected:'',
    time_selected_temp:'',
    is_time_selected:false,
    timesData : [],
    year_ranges:[],
    months:[],
    time_value:[0,0],
    is_time_select_scroll:false,//时间选择框
    year_selected:'',
    year_selected_temp:'',
    is_year_selected:false,
    yearsData : [],
    years:[], 
    year_value:[0],
    is_year_select_scroll:false,//年份选择框
    is_radio_show:false,
    choose_name:'单价中位数',
    choose_way:1,
    choose_way_temp:1,
    choose_items:[        //中位数选择框
      {'value':1,name:'单价中位数',checked: true},
      {'value':2,name:'总价中位数',checked:false},
      {'value':3,name:'面积中位数',checked: false},
      {'value':4,name:'总套数',checked: false},
      {'value':5,name:'总价值',checked: false},
      {'value':6,name:'总面积',checked: false}
    ],
    newRegList:[],//新备案楼盘列表
    kpi_tag:1,//1表示月度，2表示年度
    kpiItem:{},//包含关键指标参数
    xAixsData:[],//折线图纵坐标
    serialData:[],//折线数据
    title:'月度',
    unit:'',
    ec:{
      lazyLoad:true
      //onInit: initChart
    },
    timemin:'',//月度折线图时用到
    timemax:'',//月度折线图时用到
    singlePiceMArr:[],
    totalPriceMArr:[],
    areaPriceMArr:[],
    setsArr:[],
    totalPriceArr:[],
    totalAreaArr:[],
    allyears:[],
    allmonths:[],
    is_loading_pull:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.oneComponent = this.selectComponent('#mychart-dom-line');
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
    console.log("rangges==",this.data.ranges)
    console.log("areas==",this.data.areas)
    //获取当前日期
    var date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    month=month<10?'0'+month:month
    this.setData({
      time_selected:year+"年"+month+"月",
      timemax:year+month,
      year_selected:year+"年"
    })
    var dateArr = []
    date.setMonth(date.getMonth()+1, 1)//获取到当前月份,设置月份
    let  month1 = []
    let month2 = []

    var yearArr = []
    for (var i = 0; i < 12; i++) {
	    date.setMonth(date.getMonth() - 1);//每次循环一次 月份值减1
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      console.log(date.getFullYear())
      if(date.getFullYear() == year){
        month1.push((m)+"月")
   
      }else{
        month2.push((m)+"月")
      
      }
    }
    let item = {
      years :year+"年",
      months: month1
    }
    dateArr.push(item)
    let item1 = {
      years :date.getFullYear()+"年",
      months: month2
    }
    dateArr.push(item1)
    console.log("dataArr==",dateArr);
    for(var i =0;i<10;i++){
      yearArr.push(year-i+'年');
    }
    this.setData({
      timesData:dateArr,
      timemin :date.getFullYear()+month2[month2.length-1],
      yearsData:yearArr,
      years:yearArr
    })
    console.log("years===",this.data.years)
    var  year_ranges = []
    var months = []
    this.data.timesData.forEach(function(item,index){
      year_ranges.push(item.years);
      if(index == 0){
        months = item.months;
      }
    });
    console.log("year_ranges===",year_ranges)
    console.log("months===",months)
    this.setData({
      year_ranges:year_ranges,
      months:months
    });
    //请求备案统计数据
    this.getNewRegister();
    this.getNewKpiData();
    this.getChangeData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
/**
 * 下拉刷新
 */
onPullDownRefresh: function (){
  //获取当前日期
  var date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  month=month<10?'0'+month:month
  this.setData({
    area_selected:'全合肥',
    time_selected:year+"年"+month+"月",
    kpi_tag:1,
    choose_way:1,
    choose_name:'单价中位数',
    is_loading_pull:true,
  })
  
   //请求备案统计数据
   this.getNewRegister();
   this.getNewKpiData();
   this.getChangeData();
},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  //折线初始化
  init_one: function (sdata,xdata,title,sname,unit) { 
    let _this = this          //初始化第一个图表
    this.oneComponent.init((canvas, width, height,dpr) => {
        const chart = echarts.init(canvas, null, {
            width: width,
            height: height,
            devicePixelRatio: dpr // new
        });
        _this.setOption(chart,sdata,xdata,title,sname,unit)
        this.chart = chart;
        return chart;
    });

  },
  //折线初始化设置数据
  setOption:function(chart,sdata,xdata,sname,unit){
    
   var  option = {
      grid: {
        top:'15%',
        left:'10%',
        right:'5%',
        bottom:'22%'
      },
      tooltip: {
          trigger: 'axis'
      },
      color:["#37A2DA"],
      xAxis: {
          type: 'category',
          boundaryGap: false,
          nameTextStyle:{
            fontSize:5,
            align:'center'
          },
          data:xdata,
          axisLabel: {
						interval: 0,    //强制文字产生间隔
					    rotate: 30,     //文字逆时针旋转45°
						textStyle: {    //文字样式
              color: '#000',
						   fontSize: 8
						    }
		          },
  
          axisLine: {
            lineStyle: {
              color: '#000',
              width: 1,   //这里是坐标轴的宽度,可以去掉
            }
          }
      },
      
      yAxis:{
        show:true,
        type: 'value',
        name:unit,
        nameGap:10,
        nameTextStyle:{
          fontSize:13,
          align:'center'
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: '#000',
            fontSize: '8',
          }
        },
        //网格线
        // splitLine: {
        //   show: true,
        //   //  改变轴线颜色
        //   lineStyle: {
        //     // 使用深浅的间隔色
        //     color: ['#aaaaaa']
        //   }
        // },
      },
      series: [
          {
              name: sname,
              smooth:true,
              type: 'line',
              data: sdata,
          //     markPoint: {
          //         data: [
          //             {type: 'max', name: '最大值'},
          //             {type: 'min', name: '最小值'}
          //         ]
          //     },
          //     markLine: {
          //         data: [
          //             {type: 'average', name: '平均值'}
          //         ]
          //     }
          },
          
      ]
  };
    chart.setOption(option);
  },
  changeKpiTag:function(){
    if(this.data.kpi_tag ==1){
      this.setData({
        kpi_tag:2
      })
    }else{
      this.setData({
        kpi_tag:1
      })
    }
    this.getNewKpiData()
    this.getChangeData()

  },
  //跳转楼盘详情页面
  goToLpanDetail:function(e){
    console.log("e==",e.currentTarget.dataset.id)
    let lp_id =  e.currentTarget.dataset.id
   wx.navigateTo({
     url: '/pages/lpdetail/lpdetail?id='+lp_id,
   })
  },
  //跳转到所有楼盘页面
  goToIndex:function(){
    wx.navigateTo({
      url: '/pages/index/index?area='+this.data.area_selected,
    })
  },
  //跳转到搜索楼盘页面
  goToSearch:function(){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
    //获取新的楼盘数据
  getNewRegister:function(){
    var newRegister = httpClient.requestTask('first.secondIndex/getNewRegister',{'area':this.data.area_selected},'post');
    newRegister.then(res=>{
     if(res.data){
       console.log(res.data.data)
       let list = res.data.data
       list.forEach(item=>{
         let i = item.price.lastIndexOf(',')
         let pre_prcie = item.price.substring(0,i)
         let post_price = item.price.substring(i+1)
         item.price = Math.round(pre_prcie+post_price)
         //取出时间中的月份和日期
         if(item.gen_time != null){
            //let i = item.gen_time.lastIndexOf('-')
            let month = item.gen_time.substring(5,7)
            let day = item.gen_time.substring(8,10)
            item.gen_time = ~~month+'月'+~~day+'日' 
         }else{
          item.gen_time = '/'
         }
        
       })
       this.setData({
         newRegList:list
       })
     }
    },err=>{
      console.log("err==",err)
    })
  },
  //获取关键指标
  getNewKpiData:function(){
    let time = ''
    if(this.data.kpi_tag == 1){
      time = this.data.time_selected.replace(/[^0-9]/ig,"");
    }else{
      time = this.data.year_selected.replace(/[^0-9]/ig,"");
    }
    console.log("tag==",this.data.kpi_tag)
    console.log("area==",this.data.area_selected)
    console.log("time==",time)
    var newKpiData = httpClient.requestTask('first.secondIndex/getKpiData',{'tag':this.data.kpi_tag,'area':this.data.area_selected,'time':time},'post')
    newKpiData.then(res=>{
      console.log(res.data)
      if(res.data.data.length){
        if(res.data.data[0].sets == 0){
          res.data.data[0].sets = '--'
          res.data.data[0].area = '--'
          res.data.data[0].areaMiddle = '--'
          res.data.data[0].singlePriceMiddle = '--'
          res.data.data[0].totalPrice = '--'
          res.data.data[0].totalPriceMiddle = '--'
        }else{
          res.data.data[0].area = Math.round(res.data.data[0].area/10000)
          res.data.data[0].areaMiddle = Math.round(res.data.data[0].areaMiddle)
          res.data.data[0].singlePriceMiddle = Math.round(res.data.data[0].singlePriceMiddle)
          res.data.data[0].totalPrice = Math.round(res.data.data[0].totalPrice/100000000)
          res.data.data[0].totalPriceMiddle = Math.round(res.data.data[0].totalPriceMiddle/10000)
        }
        let day = res.data.data[0].updateTime.substring(0,10)
        console.log("getNextTime==",utils.getNextDate(day,-1))
        res.data.data[0].updateTime = utils.getNextDate(day,-1)
        this.setData({
          kpiItem:res.data.data[0]
        }) 
      }
    },err=>{

    })
  },
  //获取变化趋势指标
  getChangeData:function(){
    let timemin = ''
    let timemax = ''
    if(this.data.kpi_tag == 1){
      timemin = this.data.timemin.replace(/[^0-9]/ig,"");
      timemax= this.data.timemax;
    }else{
      timemin = this.data.years[this.data.years.length-1].replace(/[^0-9]/ig,"")
      timemax = this.data.years[0].replace(/[^0-9]/ig,"")
    }
    console.log("timemin==",timemin,"timemax==",timemax)
    var result = httpClient.requestTask('first.secondIndex/getChangeData',{'tag':this.data.kpi_tag,'area':this.data.area_selected,'timemin':timemin,'timemax':timemax},'post')
    result.then(res=>{
     if(res.data.data){
      console.log("data==",res.data.data)
      let singlePiceMArr = []
      let totalPriceMArr = []
      let areaPriceMArr = []
      let setsArr = []
      let totalPriceArr = []
      let totalAreaArr = []
      let yearss = []
      let monthss = []
      res.data.data.forEach(item=>{
        if(item.sets == 0){
          item.sets = 0
          item.area = 0
          item.areaMiddle = 0
          item.singlePriceMiddle = 0
          item.totalPrice = 0
          item.totalPriceMiddle = 0
        }else{
          item.area = Math.round(item.area/10000)
          item.areaMiddle = Math.round(item.areaMiddle)
          item.singlePriceMiddle = Math.round(item.singlePriceMiddle)
          item.totalPrice = Math.round(item.totalPrice/100000000)
          item.totalPriceMiddle = Math.round(item.totalPriceMiddle/10000)
        }
        if(this.data.kpi_tag == 2){
          yearss.push(item.timeFlag+"年")
        }else{
          monthss.push(item.timeFlag.substring(2,4)+"年"+item.timeFlag.substring(4,6)+"月")
        }
        singlePiceMArr.push(parseInt(item.singlePriceMiddle))
        totalPriceMArr.push(parseInt(item.totalPriceMiddle))
        areaPriceMArr.push(parseInt(item.areaMiddle))
        setsArr.push(parseInt(item.sets))
        totalPriceArr.push(parseInt(item.totalPrice))
        totalAreaArr.push(parseInt(item.area))
      })
      this.setData({
        singlePiceMArr:singlePiceMArr,
        totalPriceMArr:totalPriceMArr,
        areaPriceMArr:areaPriceMArr,
        setsArr:setsArr,
        totalPriceArr:totalPriceArr,
        totalAreaArr:totalPriceArr,
        allyears:yearss,
        allmonths:monthss
      })
      if(this.data.choose_way == 1){
        this.data.serialData = singlePiceMArr
        this.data.unit = "元/m²"
      }else if(this.data.choose_way == 2){
        this.data.serialData = totalPriceMArr
        this.data.unit = "万"
      }else if(this.data.choose_way == 3){
        this.data.serialData = areaPriceMArr
        this.data.unit = "m²"
      }else if(this.data.choose_way == 4){
        this.data.serialData = setsArr
        this.data.unit = "套"
      }else if(this.data.choose_way == 5){
        this.data.serialData = totalPriceArr
        this.data.unit = "亿"
      }else if(this.data.choose_way == 6){
        this.data.serialData = totalAreaArr
        this.data.unit = "万m²"
      }
      if(this.data.kpi_tag == 2){
          this.data.xAixsData = this.data.allyears
          //this.data.title = "年度"
      }else{
         this.data.xAixsData = this.data.allmonths
         //this.data.title = "月度"
      }
      this.init_one(this.data.serialData,this.data.xAixsData,this.data.choose_name,this.data.unit)
     }
     this.setData({
       is_loading_pull:false
     })
     
    },err=>{
     console.log("err==",err)
     this.setData({
      is_loading_pull:false
    })
    })
    wx.stopPullDownRefresh()
  },
  //选择区域
  selectArea:function(){
    this.setData({
      is_selected:true,
      area_selected_temp:this.data.area_selected,
     })   
  },
  selectTime:function(){
    if(this.data.kpi_tag == 1){
      this.setData({
        is_time_selected:true,
        time_selected_temp:this.data.time_selected,
       })   
    }else{
      this.setData({
        is_year_selected:true,
        year_selected_temp:this.data.year_selected,
       })   
    }
   
  },
  selectSure:function(){
    this.setData({
      is_selected:false,
     });
     let _this = this;
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
         })
         console.log("end.data.value==["+_this.data.value[0]+','+_this.data.value[1]+']')
         _this.getNewRegister();
         _this.getNewKpiData()
         _this.getChangeData()
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
   //时间设置
   selectTimeSure:function(){
    this.setData({
      is_time_selected:false,
     });
     let _this = this;
    var count = 0;
     var interval = setInterval(function () {  
      console.log("不断调用");
      count = count+1;
      if( !_this.data.is_time_select_scroll){
        var time_select =_this.data.time_selected_temp;
        if(typeof(_this.data.months[_this.data.time_value[1]]) == undefined){
          time_select = this.data.time_selected_temp;
        }else{
          time_select =_this.data.year_ranges[_this.data.time_value[0]] +_this.data.months[_this.data.time_value[1]];
        }
        _this.setData({
          time_selected:time_select,
         })
         console.log("end.data.value==["+_this.data.time_value[0]+','+_this.data.time_value[1]+']')
         _this.getNewKpiData();
         clearInterval(interval);
       }
       if(count > 30){
        clearInterval(interval);
       }
    }, 100) ;
   },
   selectTimeCancel:function(){
    this.setData({
      is_time_selected:false,
      time_selected:this.data.time_selected_temp
     })
   },
   bindpickstartTime(){
    console.log("bindpickstart")
    this.setData({
      is_time_select_scroll:true
    });
   },
   bindpickendTime:function(){
     console.log("bindpickend");
     this.setData({
      is_time_select_scroll:false
     }) 
   },
   /**设置级联 */
   bindChangeTime:function(e){
     console.log("------------------------------------")
     this.setData({
      is_time_select_scroll:true
    });
     var timesData = this.data.timesData;
     //console.log("districtsData==",districtsData);
     var value = this.data.time_value;
     console.log("value==["+value[0]+','+value[1]+']')
     var current_value = e.detail.value;
     console.log("current_value==["+current_value[0]+','+current_value[1]+']')
     if(value[0] != current_value[0]){
       this.setData({
          months : timesData[current_value[0]].months,
          time_value:[current_value[0],0]
       });
       console.log("area=="+this.data.months);
     }else if(value[0] == current_value[0] &&  value[1] != current_value[1]){
      this.setData({
        time_value:[current_value[0],current_value[1]],
     });
    }
     console.log("this.data.value==["+this.data.time_value[0]+','+this.data.time_value[1]+']')
     this.setData({
      is_time_select_scroll:false
     }) 
   },
   //年份设置
   selectYearSure:function(){
    this.setData({
      is_year_selected:false,
     });
     let _this = this;
    var count = 0;
     var interval = setInterval(function () {  
      console.log("不断调用");
      count = count+1;
      if( !_this.data.is_year_select_scroll){
        var year_select =_this.data.year_selected_temp;
        if(typeof(_this.data.years[_this.data.year_value[0]]) == undefined){
          year_select = _this.data.year_selected_temp;
        }else{
          year_select =_this.data.years[_this.data.year_value[0]];
        }
        _this.setData({
          year_selected:year_select,
         })
         _this.getNewKpiData();
         clearInterval(interval);
       }
       if(count > 30){
        clearInterval(interval);
       }
    }, 100) ;
   },
   selectYearCancel:function(){
    this.setData({
      is_year_selected:false,
      year_selected:this.data.year_selected_temp
     })
   },
   bindpickstartYear(){
    console.log("bindpickstart")
    this.setData({
      is_year_select_scroll:true
    });
   },
   bindpickendYear:function(){
     console.log("bindpickend");
     this.setData({
      is_year_select_scroll:false
     }) 
   },
   /**设置级联 */
   bindChangeYear:function(e){
     console.log("------------------------------------")
     this.setData({
      is_year_select_scroll:true
    });
     var yearsData = this.data.yearsData;
     //console.log("districtsData==",districtsData);
     var value = this.data.year_value[0];
     console.log(value)
     var current_value = e.detail.value;
     console.log(current_value[0])
     if(value != current_value){
       this.setData({
          year_value:[current_value[0]]
       });
     }
     console.log(this.data.year_value)
     this.setData({
      is_year_select_scroll:false
     }) 
   },
  catchtouchmove:function(){
     
  },
  radioSelect:function(){
    this.setData({
      is_radio_show:true
     })
  },
  bindRadioSelect:function(){
    this.setData({
      is_radio_show:false
     })
     /**调用请求该地区数据的接口 */
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
    if(this.data.choose_way == 1){
      this.data.serialData = this.data.singlePiceMArr
      this.data.unit = "元/m²"
    }else if(this.data.choose_way == 2){
      this.data.serialData = this.data.totalPriceMArr
      this.data.unit = "万"
    }else if(this.data.choose_way == 3){
      this.data.serialData = this.data.areaPriceMArr
      this.data.unit = "m²"
    }else if(this.data.choose_way == 4){
      this.data.serialData = this.data.setsArr
      this.data.unit = "套"
    }else if(this.data.choose_way == 5){
      this.data.serialData = this.data.totalPriceArr
      this.data.unit = "亿"
    }else if(this.data.choose_way == 6){
      this.data.serialData = this.data.totalAreaArr
      this.data.unit = "万m²"
    }
    if(this.data.kpi_tag == 2){
      this.data.xAixsData = this.data.allyears
      //this.data.title = "年度"
  }else{
     this.data.xAixsData = this.data.allmonths
     //this.data.title = "月度"
  }
    this.init_one(this.data.serialData,this.data.xAixsData,this.data.choose_name,this.data.unit)
  },
  adLoad() {
    console.log('Banner 广告加载成功')
  },
  adError(err) {
    console.log('Banner 广告加载失败', err)
  },
  adClose() {
    console.log('Banner 广告关闭')
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return{
      title: '合肥新房备案价',
      path: '/pages/secondIndex/secondIndex'
     }
  }
})