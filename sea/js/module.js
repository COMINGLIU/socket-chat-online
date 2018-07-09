/*
1.在js文件互相引用模块，
*/
define(function(require,exports,module){
  //模块之间互相引用
  var color=require('module1.js');
  console.log(color);
  color(document.getElementsyTagName('div')[0],'red');
  
  function fun(dom){
    return document.querySelector(dom);
  }
  module.exports=fun;
})
