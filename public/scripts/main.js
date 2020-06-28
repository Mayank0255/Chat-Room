const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const socket = io();

socket.emit('joinRoom');

socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
})

socket.on('message', (message, type, user) => {
  outputMessage(message, type, user);

  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener('submit', e => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;

  socket.emit('chatMessage', msg);

  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

function outputMessage(message, type, user) {
  const colors = [
    'rgb(233, 30, 99)',
    'rgb(148, 83, 174)',
    'rgb(242, 141, 0)',
    'rgb(52, 152, 209)'
  ]

  let color = '';

  if (type === 1 && user === 'WelcomeBot') {
    color = 'rgb(241, 192, 26)';
  } else if (type === 1 && user !== 'WelcomeBot') {
    color = colors[Math.floor(Math.random() * colors.length)];
  }
  color = 'color: ' + color;

  const div = document.createElement('div');
  div.classList.add(type === 1 ? 'message-1' : 'message-2');
  div.innerHTML = `<p class='meta' style='${color}'>${message.user} <span>${message.time}</span></p>
						<p class='text'>
							${message.text}
						</p>`;
  document.querySelector('.chat-messages').appendChild(div);
}

function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}