var httpClient = require('../utils/httpclient.js');
function getAll(){
  var result = httpClient.requestTask('first.listModel/getAll','','get');
    result.then(res=>{
       // console.log(JSON.stringify(res.data.data));
        var timestamp = Date.parse(new Date());  
        timestamp = timestamp / 1000;  
        console.log("当前时间戳为：" + timestamp); 
        res.data.data.forEach(item=>{
          var repTime = item.update_time.replace(/-/g, '/');//用正则主要是把“2019-05-20 00:00:00”转换成“2019/05/0 00:00:00”兼容ios
          console.log("返回时间：" + repTime);
          var tTamp = Date.parse(repTime);
          tTamp =tTamp/1000;
          console.log("返回时间戳：" + tTamp)
           
          if((timestamp-tTamp)<14*24*3600){
            item.isNewReg = true;
            console.log('yes');
          }else{
            item.isNewReg = false;
            console.log('no');
          }
          
        })
        //console.log(res.data.data)
        return res.data.data;
    },err=>{
      console.log("err=="+err)
    });

}

module.exports = {
  getAll :getAll,

}