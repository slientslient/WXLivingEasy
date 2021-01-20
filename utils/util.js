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

module.exports = {
  formatTime: formatTime,
  stripscript:stripscript
}
