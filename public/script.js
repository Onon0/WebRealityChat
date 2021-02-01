const socket = io('/')

var peer = new Peer(socket.id);
peer.on('open', function(id){
    console.log('My peer id:' + id)
})

var camera = document.getElementById('camera');
var myScene = document.getElementById('myScene');
document.addEventListener('keypress', event=>{
    console.log(camera.getAttribute('position'))
    socket.emit('moved',{id: socket.id ,pos:camera.getAttribute('position')})
})
socket.on('user-joined', (data)=>{
    if(document.getElementById(data.id) === null){
        var user_avatar = document.createElement("a-sphere")
        user_avatar.setAttribute('position', '0 1.6 0')
        user_avatar.setAttribute('id' , data.id)

        myScene.append(user_avatar)
        console.log(data.id)

        socket.emit('user-joined',{id: socket.id ,pos:camera.getAttribute('position')})
    }else{
        console.log("user already exist")
    }
})

socket.on('moved', (data)=>{
    var mover = document.getElementById(data.id);
    mover.setAttribute('position', data.pos);
})




