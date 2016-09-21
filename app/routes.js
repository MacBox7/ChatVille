var Chat = require('./models/chat');

module.exports = function(app) {

  app.get('/',function(req,res){
    res.sendfile('index.html');
  });

  app.get('/chat',function(req,res){

    Chat.find({}, function(err, chats) {
      console.log(chats);
      res.json(chats);
    });
  });

};
