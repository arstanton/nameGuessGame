'use strict';

const PORT = '1337';
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = require('socket.io').listen(server);

server.listen(PORT);

app.use(express.static('dist'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/dist/index.html');
});

const composeGame = require('./app/GameComposer');

io.sockets.on('connection', composeGame(io));