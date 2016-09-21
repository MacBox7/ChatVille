var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var http = require('http').Server(app);
var mongoose = require('mongoose');
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var database = require('./config/database');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

users = [];

mongoose.connect(database.url);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error with mongodb:'));
db.once('open', function() {
  console.log("User connected with mongodb");
});

require('./app/routes.js')(app);

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
    var Chat = require('./app/models/chat');
    var newMessage = new Chat(data);
    newMessage.save(function (err) {
      if (err) console.log(err);
      else console.log("Message saved success: " + data.message);
      // saved!
    });
    io.sockets.emit('newmsg', data);
  });
  socket.on('disconnect',function(){
    console.log('User got disconnected');
  });
});

http.listen(port, function(){
  console.log("App listening on port " + port);
});
