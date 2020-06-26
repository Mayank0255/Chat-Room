const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require('./utils/messages');

const server = http.createServer(app);
const io = socketio(server);

const PORT = 3000 || process.env.PORT;

app.use(express.static(path.join(__dirname, "/public")));

io.on('connection', socket => {
    const botName = 'PotatoBot'

    console.log('New User Connected');

    socket.emit('message', formatMessage(botName, 'Welcome to ChatCord'));

    socket.broadcast.emit('message', formatMessage(botName, 'A user has joined the chat'));

    socket.on('joinRoom', details => {
        console.log(details);
    })

    socket.on('chatMessage', msg => {
        io.emit('message', formatMessage('USER', msg));
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('message', formatMessage(botName, 'A user has left the chat'));
    });
})

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});