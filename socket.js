const {
  userJoin,
  currentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

const formatMessage = require('./utils/messages');

let username;
let room;

const setUserRoom = (userName, Room) => {
  username = userName;
  room = Room;
}

const getUserRoom = () => {
  return { username, room }
}

const configureSockets = (io) => {
  io.on('connection', socket => {
    const botName = 'WelcomeBot'

    socket.on('joinRoom', () => {
      const { username, room } = getUserRoom();

      const user = userJoin(socket.id, username, room)

      socket.join(user.room);

      socket.emit('message', formatMessage(botName, `${username[0].toUpperCase() + username.slice(1)}, Welcome to the ${user.room} room`), 1, botName);

      socket.broadcast
        .to(user.room)
        .emit('message', formatMessage(botName, `${user.username} has joined the chat`), 1, botName);

      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    })

    socket.on('chatMessage', msg => {
      const user = currentUser(socket.id);

      socket.emit('message', formatMessage('You', msg), 2, 'You');

      socket.broadcast
          .to(user.room)
          .emit('message', formatMessage(user.username, msg), 1, user.username);

    });

    socket.on('disconnect', () => {
      const user = userLeave(socket.id);

      if (user) {
        io.to(user.room).emit(
          'message',
          formatMessage(botName, `${user.username} has left the chat`),
          1,
          botName
        );

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
          room: user.room,
          users: getRoomUsers(user.room)
        });
      }
    });
  })
}

module.exports = {
  configureSockets,
  setUserRoom,
  getUserRoom
}