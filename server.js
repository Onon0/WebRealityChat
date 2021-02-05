const express = require('express')
const app = express()
const server = app.listen(3000)
const io = require('socket.io')(server)

app.use(express.static('public'))
io.on('connection', socket=>{
    socket.on('join-room', (roomId, userId)=>{
        console.log("room:"+roomId+"user joined:"+ userId)
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId)

        socket.on('disconnect', ()=>{
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    })

    socket.on('moved', data=>{
        console.log(data)
        socket.broadcast.emit('moved', data)
    })
    
})




