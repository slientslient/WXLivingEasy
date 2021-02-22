const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function stripscript(s) 
{ 
//var pattern = new RegExp("[`~!@$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]") ;
//var pattern = new RegExp("[`~!@$^&*()=|{}':;',\\[\\].<>/·?~！@￥……&*（）——|{}【】‘；：”“'。，、？' ']")
 var pattern = new RegExp("[^a-zA-Z0-9\u4e00-\u9fff#]");
 var rs = ""; 
 for (var i = 0; i < s.length; i++) { 
   rs = rs+s.substr(i, 1).replace(pattern, ''); 
 } 
 return rs; 
} 
// JS获取指定日期的前一天，后一天
function getNextDate(date, day) { 
  　　var dd = new Date(date);
  　　dd.setDate(dd.getDate() + day);
  　　var y = dd.getFullYear();
  　　var m = dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1;
  　　var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
  　　return y + "-" + m + "-" + d;
  };
module.exports = {
  formatTime: formatTime,
  stripscript:stripscript,
  getNextDate:getNextDate
}
