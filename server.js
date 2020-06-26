const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");
const formatMessage = require('./utils/messages');
const { userJoin, currentUser } = require('./utils/users');

const server = http.createServer(app);
const io = socketIo(server);

const PORT = 3000 || process.env.PORT;

app.use(express.static(path.join(__dirname, "/public")));

io.on('connection', socket => {
    const botName = 'WelcomeBot'

    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        socket.emit('message', formatMessage(botName, 'Welcome to ChatCord'));

        socket.broadcast
            .to(user.room)
            .emit('message', formatMessage(user.username, `${user.username} has joined the chat`));
    })

    socket.on('chatMessage', msg => {
        const {username, room} = currentUser(socket.id);
        console.log(username + " - " + socket.id);

        io.to(room)
            .emit('message', formatMessage(username, msg));
    });

    socket.on('disconnect', () => {
        const {username} = currentUser(socket.id);
        socket.broadcast.emit('message', formatMessage(botName, `${username} has left the chat`));
    });
})

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});