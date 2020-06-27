const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');
const configureSockets = require('./socket').configureSockets;

const server = http.createServer(app);
const io = socketIo(server);
configureSockets(io)

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('', (req, res) => {
    res.render('index');
});

app.get('/chat', (req, res) => {
    res.render('chat');
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});