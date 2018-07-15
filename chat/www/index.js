// 处理socket
(function(window,document){
  var doc = document;
  var ele = {
    oSendTxt: document.getElementsByTagName("textarea")[0],
    oCloseBtn: doc.getElementsByName("close")[0],
    oSendBtn: doc.getElementsByName("send")[0],
    oRecord: doc.getElementById("record-box")
  };
  var socket = io.connect("/");
  // 获取到用户昵称
  var nickName = prompt('昵称',"xxx");
  if(nickName){
    window.sessionStorage.setItem('nickName',nickName);
  }else {
    window.sessionStorage.setItem('nickName',"NULL");
  }
  var userName = window.sessionStorage.getItem("nickName");
  socket.send(userName);

  //点击发送键
  document.getElementsByTagName("button")[0].onclick = write;
  // 回车发送消息
  document.addEventListener('keyup',function(e){
    e = e||window.e;
    if(e.keyCode == '13'){
      write();
    }
  })
  function write(){
    var content = ele.oSendTxt.value;
    // 消息为空不发送
    if(!content){
      return;
    }else {
      ele.oSendTxt.value="";
      socket.send(content);
      // 将消息添加到记录框
      var item = document.createElement("div");
      item.className = "right-div";
      item.innerHTML = "<em class='photo right-photo'></em><span class='name right-name'>昵称</span><span class='say right-say'>sdv承诺 绍fv</span>"
      ele.oRecord.appendChild(item);
    }
  }

  // 如果监听到socket消息，那么执行这个方法并且广播消息
  socket.on("message",function(mes){
    console.log(mes);
    if(mes['user']){
      // 用户加入
    }else {
      // 接收消息
      var p = document.createElement('p');
      p.innerHTML = mes;
    }
  })
})(window,document);
