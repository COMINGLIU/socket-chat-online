const express = require('express');
// const static = require('express-static');
// const fs = require('fs');
const ws = require("socket.io");

var server = express();
server.use('/',function(req,res){
  console.log('ok');
})
server.listen(8080);
// server.use(static('../chat'));
