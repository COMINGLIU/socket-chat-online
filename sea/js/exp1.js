function exp1(url,callback){
  var oCS=document.createElement('script');
  oCS.src=url;
  var oCS0 = document.getElementsByTagName('script')[0];
  oCS0.parentNode.insertBefore(oCS,oCS0);

  var require,
      exports,
      module={};
  // 在此处接收模块函数
  define=function(fn){
    console.log(fn);
    fn(require,exports,module)
    console.log(module);
    callback&&callback(module.exports);
    oCS0.parentNode.removeChild(oCS);
  }
}
