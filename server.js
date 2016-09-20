var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

app.get('/',function(req,res){
  res.sendfile('index.html');
});

users = [];

io.on('connection',function(socket){
  console.log('User got connected');
  socket.on('setUsername',function(name){
    if(users.indexOf(name) > -1){
      console.log('User exists');
      socket.emit('userExists',{flag:false});
    }
    else {
      console.log("User "+name+" connected");
      users.push(name);
      socket.emit('userSet',{userName:name});
    }
  });
  socket.on('msg',function(data){
    console.log(data);
    io.sockets.emit('newmsg', data);
  });
  socket.on('disconnect',function(){
    console.log('User got disconnected');
  });
});

http.listen(port, function(){
  console.log("App listening on port " + port);
});
