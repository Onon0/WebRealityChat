

var login_btn = document.getElementById('login_btn');
var name_txt = document.getElementById('name_txt');
login_btn.onclick = function(){
    var str = name_txt.value;
   if(!(!str || /^\s*$/.test(str))) window.location.href = '/login/'+ name_txt.value;
}

var join_btn = document.getElementById('join_btn');
var roomId_txt = document.getElementById('roomId_txt');

join_btn.onclick = function(){
   var str = name_txt.value;
   if(!(!str || /^\s*$/.test(str))){
      var roomId = roomId_txt.value;
      if(!(!roomId || /^\s*$/.test(roomId)))
      window.location.href = '/join?roomId=' + roomId_txt.value + "&uname="+ name_txt.value;
   }
}