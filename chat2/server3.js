const express = require('express');
const fs = require('fs');
const urlLib = require('url');
const ws = require("socket.io");

var server = express();
server.use('/',function(req,res){
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
server.listen(8080);
