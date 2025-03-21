const express = require('express');
const app = express();
const http = require('http');
const path = require('path');

const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname + '/public')));

io.on("connection", function(socket) {//socket is an object with function located the user
    socket.on("send-Location", function(data) {
        io.emit("receive-Location",{id: socket.id, ...data});//(...data is speadring the data)
    });
    socket.on("disconnect", function() {
        io.emit("user-disconnect", socket.id);
    });
    
});

app.get('/', (req, res) => {
    res.render("index");
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});