const socket = io('/');
var peer = new Peer();
var assets = document.getElementById("asset");
var scene = document.getElementById("myScene");
var camera = document.getElementById("camera");
var con = document.getElementById("con");
var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
const peers = {}
peer.on('open', id=>{
    console.log(id)
    socket.emit('join-room', ROOM_ID,id)
    
})
socket.on('user-connected', userId=>{
    con.setAttribute('value', ""+ userId + "joined")
    
    
    
    
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


peer.on('call', function(call) {
  getUserMedia({video: true, audio: true}, function(stream) {
    call.answer(stream); // Answer the call with an A/V stream.
    console.log('90s called' + call.peer)
   
    
  

    call.on('stream', function(remoteStream) {
      if(document.getElementById(call.peer) === null){
          var video = document.createElement('video')
          var player = document.createElement('a-box')
        
          video.setAttribute('id', 'asset' + call.peer)
          player.setAttribute('id', call.peer)
          player.setAttribute('position', "0 1.6 0")
          player.setAttribute('material', 'src: #asset' + call.peer)
          player.setAttribute('dev', 'answer');
          addVideoStream(video, remoteStream, player)
          peers[userId] = call
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
