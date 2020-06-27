const {
  userJoin,
  currentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

const formatMessage = require('./utils/messages');


function configureSockets(io) {
  io.on('connection', socket => {
    const botName = 'WelcomeBot'

    socket.on('joinRoom', ({ username, room }) => {
      const user = userJoin(socket.id, username, room);

      socket.join(user.room);

      socket.emit('message', formatMessage(botName, 'Welcome to ChatCord'));

      socket.broadcast
        .to(user.room)
        .emit('message', formatMessage(botName, `${user.username} has joined the chat`));

      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    })

    socket.on('chatMessage', msg => {
      const user = currentUser(socket.id);

      socket.emit('message', formatMessage('You', msg));

      socket.broadcast
          .to(user.room)
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
}

module.exports = { configureSockets }