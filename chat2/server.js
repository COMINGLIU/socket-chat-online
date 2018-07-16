const http = require('http');
const fs = require('fs');
const urlLib = require('url');
const ws = require("socket.io");

let friends = [];
// 读文件
var server = http.createServer(function(req,res){
  // console.log('ok');
  let dataStr = "";
  req.on('data',function(data){
    dataStr+=data;
  })
  req.on('end',function(){
    let obj=urlLib.parse(req.url,true);
    let url=obj.pathname;
    let GET=obj.query;

    let file_name = './www'+url;
    fs.readFile(file_name,function(err,data){
      if(err){
        res.write('404');
      }else {
        res.write(data);
      }
      res.end();
    })
  })
})
// 基于当前web服务开启socket实例
const io=ws(server);
// 检测连接事件
io.on("connection",function(socket){
  console.log('连接');
  // 接收客户端发送的消息,并广播出去
  socket.on("message",function(mes){
    console.log(mes);
    // 向所有的客户端广播消息
    if(mes.msg==undefined){
      if(mes.out) {
        friends.splice(friends.indexOf(mes.out),1);
        io.emit("message",{"friends":friends,"out":mes.out});
      }else {
        friends.push(mes);
        console.log("friends"+friends);
        io.emit("message",{"friends":friends,"add":mes});
      }
    }else {
        console.log(mes);
        io.emit("message",mes);
    }
  });
})
server.listen(8080);
