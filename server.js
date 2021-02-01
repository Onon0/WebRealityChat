var express = require('express');
var app = express();

//var node_modules = require('./node_modules/aframe'); 

var server = require('http').Server(app);
app.use(express.static('public'))
app.use(express.static('node_modules'))

//app.use('/node_modules', node_modules)
var socket = require('socket.io');
var io = socket(server);
app.set('view engine', 'ejs')
io.on('connection', (socket)=>{
    console.log(socket.id)
    socket.broadcast.emit('user-joined', {"id":socket.id})
    socket.on('moved', (data)=>{
        //console.log(data)
        socket.broadcast.emit('moved', data)
    })

    socket.on('user-joined', data=>{
        socket.broadcast.emit('user-joined', data)
    })
});



server.listen(3000, ()=>{
    console.log('listening on port:3000')
})

