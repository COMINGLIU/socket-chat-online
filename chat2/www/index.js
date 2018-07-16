(function(window,document){
  var doc = document;
  var ele = {
    oContainer: doc.getElementById("container"),
    oSendTxt: doc.getElementsByTagName("textarea")[0],
    oCloseBtn: doc.getElementsByName("close")[0],
    oSendBtn: doc.getElementsByName("send")[0],
    oRecord: doc.getElementById("record-box"),
    oNickName: doc.getElementById("nickName"),
    oFriendList: doc.getElementById("friend-list"),
    oFriendList_myPhoto: doc.querySelector("#friend-list li em"),
    oFriendList_myName: doc.querySelector("#friend-list li span"),
    oFriendList_num: doc.querySelector("#friends-box span"),
    aFriends: doc.getElementById("addInfo")
  };
  // 好友数组
  var friendsList=[];
  // 我的用户名
  var userName;
  // 用于监听第几次发过来mes.friends，如果是第一次就在好友框加上所有好友否则只加上新增加的好友
  var count = 0;
  var socket = io.connect("/");
  function Chat(){
    // 获取用户昵称
    this.getNickName();
    // 发送消息
    this.sendMessage();
    // 退出聊天室
    this.out();
    // 接收广播消息
    this.receiveMessage();
  }
  Chat.prototype = {
    // 获取用户昵称
    getNickName: function(){
      var nickName = prompt('昵称',"xxx");
      if(nickName){
        window.sessionStorage.setItem('nickName',nickName);
      }else {
        window.sessionStorage.setItem('nickName',"NULL");
      }
      userName = window.sessionStorage.getItem("nickName");
      socket.send(userName);
    },
    // 发送消息
    sendMessage: function(){
      //点击发送键
      document.getElementsByTagName("button")[1].onclick = write;
      // 回车发送消息
      document.addEventListener('keyup',function(e){
        e = e||window.e;
        if(e.keyCode == '13'){
          write();
        }
      })
      //将消息发送到后台
      function write(){
        var content = ele.oSendTxt.value;
        // 消息为空不发送
        if(!content){
          return;
        }else {
          ele.oSendTxt.value="";
          socket.send({"user":userName,"msg":content});
        }
      }
    },
    out: function() {
      // 点击退出按钮
      document.getElementsByTagName("button")[0].onclick = function(){
        var signOut = confirm("退出聊天室吗?");
        if(signOut) {
          console.log('要退出了');
          socket.send({'out':userName});
          ele.oContainer.style.cssText = "height: 0;overflow: hidden";
          window.sessionStorage.removeItem('user');
        }
        // 卸载页面退出聊天
        window.onbeforeunload = function(){
          socket.send({'out':userName});
        }
      }
    },
    // 接收消息
    receiveMessage: function(){
      // 如果监听到socket消息，那么执行这个方法并且广播消息
      socket.on("message",function(mes){
        count++;
        console.log(mes);
        console.log(mes.user);
        console.log(mes.msg);
        if(mes.friends){
          if(mes.out) {
            var aFriendLists = ele.oFriendList.getElementsByTagName("li");
            ele.aFriends.innerHTML = mes.out+"退出群聊";
            friendsList = JSON.parse(window.sessionStorage.getItem('friendsList'));
            var key = friendsList.indexOf(mes.out);
            ele.oFriendList.removeChild(aFriendLists[key]);
            // 更新好友信息
            window.sessionStorage.setItem("friendsList",JSON.stringify(mes.friends));
          }else if(mes.add) {
            console.log(count);
            // var friStr = mes.friends.join(',');
            var addFri = mes.add;
            if(addFri==userName) {
              ele.aFriends.innerHTML = "'我'"+"加入聊天室";
            }else {
              ele.aFriends.innerHTML = '"'+addFri+'"'+"加入聊天室";
            }
            // 保存好友信息
            window.sessionStorage.setItem('friendsList',JSON.stringify(mes.friends));
            ele.oFriendList_num.innerHTML = mes.friends.length;

            if(count==1){
              // 用户加入
              var frag = document.createDocumentFragment();
              for(var i=0,len=mes.friends.length;i<len;i++) {
                var item = document.createElement('li');
                if(mes.friends[i]==userName) {
                    item.innerHTML = "<em></em><span class='redColor'>"+mes.friends[i]+"</span>";
                }else {
                    item.innerHTML = "<em></em><span>"+mes.friends[i]+"</span>";
                }

                frag.appendChild(item);
              }
              ele.oFriendList.appendChild(frag);
            }else {
              var item = document.createElement('li');
              item.innerHTML = "<em></em><span>"+mes.add+"</span>";
              ele.oFriendList.appendChild(item);
            }
          }
        }else {
          // 接收消息
          if(mes.user==userName){
            var item = document.createElement("div");
            item.className = "right-div";
            item.innerHTML = "<em class='photo right-photo'></em><span class='name right-name'>"+userName+"</span><span class='say right-say'>"+mes.msg+"</span>";
            ele.oRecord.appendChild(item);
          }else {
            console.log('不是我');
            var saying = document.createElement('div');
            saying.innerHTML = "<em class='photo left-photo'></em><span class='name left-name'>"+mes.user+"</span><span class='say left-say'>"+mes.msg+"</span>";
            ele.oRecord.appendChild(saying);
          }
        }
      })
    }
  }
  var char = new Chat();
})(window,document);
