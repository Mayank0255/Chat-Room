const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const server = http.createServer(app);
const io = socketio(server);

const PORT = 3000 || process.env.PORT;

app.use(express.static(path.join(__dirname, "/public")));

io.on('connection', socket => {
    console.log('New User Connected');

    socket.emit('message', 'Welcome to ChatCord');

    socket.broadcast.emit('message', 'A user has joined the chat');

    socket.on('chatMessage', msg => {
        io.emit('message', msg);
    });

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the chat');
    });
})

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});