$(function(){
  var flag = false;
  $('#nickName').val('');
  $('#message').val('');
  var socket = io();
  $(document).ready(function(){
    if(flag==false)
    {
      setInterval(function(){
        $(".login.page").css({
          "background-color" : getRandomColor(),
          "transition" : "background-color 3s ease"
        });
      }, 1000);
    }
    $("#btnSubmit").click(function(){
      var msg = document.getElementById('message').value;
      $('#message').val('');
      if(msg){
          socket.emit('msg', {message: msg, user: user});
      }
    });
  });
  $(document).keypress(function(e) {
      if(flag==false){
        var value = $("#nickName").val();
        if(e.which==8)
        {
          if(value.length<=1){
            $(".usernameInput").css("border-bottom", "2px solid #f00");
          }
          else {
            $(".usernameInput").css("border-bottom", "2px solid #0f0");
          }
        }
        else {
          $(".usernameInput").css("border-bottom", "2px solid #0f0");
        }
        if(e.which == 13) {
            socket.emit('setUsername', document.getElementById('nickName').value);
        }
      }
      else {
        if(e.which == 13){
          var msg = document.getElementById('message').value;
          $('#message').val('');
          if(msg){
              socket.emit('msg', {message: msg, user: user});
          }
        }
      }
  });
  var user;
  socket.on('userExists',function(data){
    $('#nickName').val('');
    $(".usernameInput").css("border-bottom", "2px solid #f00");
  });

  socket.on('userSet',function(data){
    $('#nickName').val('');
    user = data.userName;
    $(".login.page").css("display","none");
    $(".chat.page").css("display","block");
    flag = true;
    initialize();
  });

  socket.on('newmsg', function(data){
    if(user){
      $('#chat').append('<li class="media"> <div class="media-body"> <div class="media"><a class="pull-left" href="#"><b>'+data.user+':</b></a><div class="media-body" >'+data.message+'<br/><hr/></div></div></div></li>');
    }
  });
});

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function initialize(){

  $.get( '/chat', function(data) {
       for(var i = 0;i<data.length;i++){
         $('#chat').append('<li class="media"> <div class="media-body"> <div class="media"><a class="pull-left" href="#"><b>'+data[i].user+':</b></a><div class="media-body" >'+data[i].message+'<br/><hr/></div></div></div></li>');
       }
     });
}
