'use strict';
const Room = require('./app/room');
const Player = require('./app/player');

const PORT = '1337';
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = require('socket.io').listen(server);

server.listen(PORT);

app.use(express.static('public'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

const gamerooms = {};

function size (obj) {
	let size = 0, key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) size++;
	}
	return size;
}

function isEmpty (obj) {
	return Object.keys(obj).length === 0 && obj.constructor === Object;
}

const generateUniqueString = require('random-id');

io.sockets.on('connection', (socket) => {
	let roomId;

	socket.on('createRoom', (userInfo) => {
		roomId = generateUniqueString(5);
		socket.username = userInfo.username;
		gamerooms[roomId] = new Room(roomId);
		gamerooms[roomId].players[socket.username] = new Player(socket.username);
		socket.join(roomId);
		socket.emit('roomId', roomId);
		socket.emit('updatePlayers', gamerooms[roomId].players);
		gamerooms[roomId].startTimer((seconds) => {
			socket.emit('log', seconds);
		}, () => {
			socket.emit('log', "Time up");
		});
	});

	/**
	 *
	 * @param string $username
	 * @param string $roomId
	 *
	 */
	socket.on('joinRoom', (userInfo) => {
		roomId = userInfo.roomId;
		socket.username = userInfo.username;
		if(roomId in gamerooms) {
			if(socket.username in gamerooms[roomId].players) {
				//player already exists
			} else {
				gamerooms[roomId].players[socket.username] = new Player(socket.username);
				socket.join(roomId);
				socket.emit('roomId', roomId);
				io.sockets.in(roomId).emit('updatePlayers', gamerooms[roomId].players);
				socket.emit('roomMsg', 'Thanks for connecting ' + socket.username + ' :)');
				socket.to(roomId).emit('roomMsg', socket.username + ' has connected, be nice');
			}
		} else {
			//room doesn't exist
		}
	});

	/**
	 *
	 * @param string $roomId
	 * @param string $message
	 *
	 */
	socket.on('sendMessage', (msg) => {
		try {
			io.sockets.in(msg.roomId).emit('updateChat', {username: socket.username, message: msg.message});
		} catch (e) {
			console.log("ERROR " + e.message);
		}
	});

	socket.on('startGame', () => {
		socket.to(roomId).emit('startGame');
	});

	socket.on('checkOnlineUsers', () => {
		socket.emit('updatePlayers', gamerooms[roomId].players);
	});

	socket.on('disconnect', (reason) => {
		if(roomId && gamerooms[roomId]) {
			gamerooms[roomId].players[socket.username].numConnections -= 1;
			if(gamerooms[roomId].players[socket.username].numConnections <= 0) {
				delete gamerooms[roomId].players[socket.username];
				if(isEmpty(gamerooms[roomId].players))
					delete gamerooms[roomId];
				else {
					io.sockets.in(roomId).emit('updatePlayers', gamerooms[roomId].players);
					socket.to(roomId).emit('roomMsg', socket.username + 'has disconnected.');
				}
			}
			socket.leave(roomId);
		}
	});
});