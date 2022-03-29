const socket = io('/');
/*var peer = new Peer(undefined, {
  host: '/',
  port: '3001'
});//*/
var peer = new Peer(undefined, {
  host: 'https://web3dchat.herokuapp.com',
  port: '443'
});
var assets = document.getElementById("asset");
var scene = document.getElementById("myScene");
var camera = document.getElementById("camera");
var con = document.getElementById("con");
var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
const peers = {}
const users = {}
peer.on('open', id=>{
    console.log(id)
    socket.emit('join-room', ROOM_ID,id, UNAME)
    
})
socket.on('user-connected', data=>{
    var userId = data.userId;
    var uname = data.uname;
    var conn = peer.connect(userId);
    conn.on('open', function(){
      conn.send({"id": peer.id,"uname":UNAME});
    }
    )

    con.setAttribute('value', ""+ uname + "joined");
    getUserMedia({video: true, audio: true}, function(stream) {
      var call = peer.call(userId, stream);
        
      call.on('stream', function (remoteStream) {
        if(document.getElementById(userId) === null){
          var video = document.createElement("video");
          var player = document.createElement("a-box");
          video.setAttribute('id', 'asset' + userId);
          player.setAttribute('id', userId);
          player.setAttribute('position', '0 1.6 0');
          player.setAttribute('material', 'src: #asset' + userId);
          player.setAttribute('dev', 'call');

          
          var uname_obj = document.createElement('a-text')
          uname_obj.setAttribute('value', uname)
          uname_obj.setAttribute('scale', '2 2 2')
          uname_obj.setAttribute('position', '0 1.4 0')
          uname_obj.setAttribute('rotation', '0 180 0')
          uname_obj.setAttribute('color', "#00FF00")
          player.append(uname_obj);
          

          addVideoStream(video, remoteStream, player);
          peers[userId] = call
        }
        
      });
        }, function(err) {
            console.log('Failed to get local stream' ,err);
        });
})



socket.on('user-disconnected', (userId)=>{
  if(peers[userId]) peers[userId].close()
  document.getElementById(userId).remove()
  document.getElementById("asset" + userId).remove()
})

socket.on('moved', data=>{
    var player = document.getElementById(data.id)
   if(player !== null){
        player.setAttribute('position', data.pos)
        player.setAttribute('rotation', data.rot)
    }
})

peer.on('connection', function(conn){
  conn.on('data', function(data){
    //console.log(data);
    users[data.id] = data.uname;
  })
})

peer.on('call', function(call) {

  getUserMedia({video: true, audio: true}, function(stream) {
    call.answer(stream); // Answer the call 


    call.on('stream', function(remoteStream) {
      if(document.getElementById(call.peer) === null){
          var video = document.createElement('video')
          var player = document.createElement('a-box')
          
        
          video.setAttribute('id', 'asset' + call.peer)
          player.setAttribute('id', call.peer)
          player.setAttribute('position', "0 1.6 0")
          player.setAttribute('material', 'src: #asset' + call.peer)
          player.setAttribute('dev', 'answer');
          if(users[call.peer]){
            var uname_obj = document.createElement('a-text')
            uname_obj.setAttribute('value', users[call.peer])
            uname_obj.setAttribute('scale', '2 2 2')
            uname_obj.setAttribute('position', '0 1.4 0')
            uname_obj.setAttribute('rotation', '0 180 0')
            uname_obj.setAttribute('color', "#00FF00")
            player.append(uname_obj);
          }
          addVideoStream(video, remoteStream, player)
          peers[call.peer] = call
        }
        
    });
  }, function(err) {
    console.log('Failed to get local stream' ,err);
  });
});

function connectToNewUser(userId, stream) {
  
}

function addVideoStream(video, stream, player){
    video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  assets.append(video)
  scene.append(player)
}

document.addEventListener('keypress', event=>{
    
    socket.emit('moved',{id: peer.id ,pos:camera.getAttribute('position'), rot:camera.getAttribute('rotation')})

    //console.log("" + peer.id + "" + camera.getAttribute('position'))
    
})
