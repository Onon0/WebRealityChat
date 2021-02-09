const express = require('express')
const app = express()
const port = 13366 || 3000;
const server = app.listen(port)
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

app.get('/join', (req, res)=>{
    res.redirect('/'+req.query.roomId + '?uname='+req.query.uname);
    
})

app.get('/login/:uname', (req, res)=>{
    res.redirect('/'+uuidV4() + '?uname='+req.params.uname);
    
})

app.get('/:room', (req, res) => {
    
    res.render('room', { roomId: req.params.room, uname:req.query.uname })
})


io.on('connection', socket=>{
    socket.on('join-room', (roomId, userId, uname)=>{
        console.log("room:"+roomId+"user joined:"+ uname)
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', {"userId":userId, "uname": uname})

        socket.on('disconnect', ()=>{
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    })

    socket.on('moved', data=>{
       // console.log(data)
        socket.broadcast.emit('moved', data)
    })

    
    
})






