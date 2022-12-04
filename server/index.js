const corsMiddleWare = require('cors');
const { Server } = require('socket.io');
const PORT = 4000;

//Server setup
const express = require('express');
const app = express();

// Socket setup
const http = require('http');
const server = http.createServer(app);
const io = new Server(server);
let messages = [];

app.use(corsMiddleWare());
app.use(express.json());

//Every socket.on and socket.emit needs to be wrapped around "io.on('connection, socket)"
io.on('connection', (socket) => {
    //When a client is connected, all the following will be applied. We first start with the getPreviousMessages request.
    socket.on('getPreviousMessages', () => {
        socket.emit('receivePreviousMessages', messages);
    });
    //Next we declare what to do when the client is sending a message
    socket.on('sendMessage', (name, message) => {
        //First we add the message as an object to the messages array from line 13, so that users that connect after this message is sent
        //are also able to receive this message too.
        messages.push({ name, message });
        //Next, we send the message to everyone, including the sender. There are several ways to do this, I use io.emit here.
        io.emit('receiveMessage', name, message);
    });
});

server.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});

module.exports = server;
