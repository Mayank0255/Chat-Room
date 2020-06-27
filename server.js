const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const bodyParser = require("body-parser");
const socketIo = require("socket.io");
const formatMessage = require('./utils/messages');
const {
    userJoin,
    currentUser,
    userLeave,
    getRoomUsers
} = require('./utils/users');

const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "/public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

io.on('connection', socket => {
    const botName = 'WelcomeBot'

    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        socket.emit('message', formatMessage(botName, 'Welcome to ChatCord'));

        socket.broadcast
            .to(user.room)
            .emit('message', formatMessage(user.username, `${user.username} has joined the chat`));

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    })

    socket.on('chatMessage', msg => {
        const user = currentUser(socket.id);
        // console.log(user.username + " - " + socket.id);

        // socket.to(user.room)
        //     .emit('message', formatMessage('You', msg));
        //
        // socket.broadcast
        //     .to(user.room)
        //     .emit('message', formatMessage(user.username, msg));

        io.to(user.room)
            .emit('message', formatMessage(user.username, msg));
    });

    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit(
                'message',
                formatMessage(botName, `${user.username} has left the chat`)
            );

            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
})

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});