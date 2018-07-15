const http = require("http");
const express = require('express');
const static = require('express-static');
const fs = require('fs');
const ws = require("socket.io");

let friends = [];
const server = http.createServer(function(req,res){
  // 读取文件，发送到前端
  const html = fs.readFileSync('./www/index.html');
  res.write(html);
});
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
        // io.emit("message",mes);
        friends.splice(friends.indexOf(mes.out),1);
        io.emit("message",{"friends":friends,"out":mes.out});
      }else {
        friends.push(mes);
        console.log("friends"+friends);
        io.emit("message",{"friends":friends,"add":mes});
      }
    }else {
        // console.log(mes);
        io.emit("message",mes);
    }
  });
})
server.listen(8080);
