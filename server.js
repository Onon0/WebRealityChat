const express = require('express')
const app = express()
const server = app.listen(3000)
const io = require('socket.io')(server)
const{v4 : uuidV4} = require('uuid')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.get('/',(req, res)=>{
    
    res.redirect("home")
})

app.get('/home',(req, res)=>{
    res.render('home')
})

app.get('/login', (req, res)=>{
    res.redirect(uuidV4());
    console.log('logged');
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})


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






