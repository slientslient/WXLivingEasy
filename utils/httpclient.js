/* 获取数据
* @param api: 请求路由
* @param params: 查找数据
* @param headers: 请求头
* @param http_method: 请求方法
*/
var url_prefix ="https://govsitemap.com/tp/public/?s="
var url_prefix_test ="https://govsitemap.com/living-easy/tp/public/?s="
function requestTask(action, params, httpMethod) {
  // console.log(api, params, headers, httpMethod);
  return new Promise((resolve, reject) => {
     wx.request({
         url:url_prefix+action,
         data: params,
         header: {'content-type': 'application/json'},
         method: httpMethod,
            success: res => {
                resolve(res);
            },
            fail: res => {
                resolve(res);
         },
    });
 });
}
module.exports = {
    requestTask:requestTask
}