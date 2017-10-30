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

io.sockets.on('connection', function (socket) {
	let roomId;

	socket.on('createRoom', function (userInfo) {
		socket.username = userInfo.username;
		roomId = generateUniqueString(5);
		gamerooms[roomId] = new Room(roomId);
		socket.emit('roomId', roomId);
		socket.join(roomId);
		gamerooms[roomId].players[socket.username] = new Player(socket.username);
		gamerooms[roomId].startTimer(function (seconds) {
			socket.emit('log', seconds);
		}, function () {
			socket.emit('log', "Time up");
		});
	});

	/**
	 *
	 * @param string $username
	 * @param string $roomId
	 *
	 */
	socket.on('joinRoom', function (userInfo) {
		socket.join(userInfo.roomId);
		socket.username = userInfo.username;
		if(userInfo.roomId in gamerooms) {
			if(socket.username in gamerooms[userInfo.roomId].players) {
				//player already exists
			} else {
				roomId = userInfo.roomId;
				gamerooms[roomId].players[socket.username] = new Player(socket.username);
			}
			socket.emit('roomId', userInfo.roomId);
			socket.emit('roomMsg', 'Thanks for connecting ' + socket.username + ' :)');
			socket.broadcast.to(userInfo.roomId).emit('roomMsg', socket.username + ' has connected, be nice'); //broadcasts to all sockets in the given room, except to the socket on which it was called
			io.sockets.in(userInfo.roomId).emit('updateUsers', gamerooms[userInfo.roomId].players); //broadcasts to all sockets in the given room
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
	socket.on('sendMessage', function (msg) {
		try {
			io.sockets.in(msg.roomId).emit('updateChat', {username: socket.username, message: msg.message});
		} catch (e) {
			console.log("ERROR " + e.message);
		}
	});

	socket.on('startGame', function () {
		socket.broadcast.to(roomId).emit('startGame');
	});

	socket.on('checkOnlineUsers', function () {
		socket.emit('updateUsers', gamerooms[roomId].players);
	});

	socket.on('disconnect', function () {
		if(roomId && gamerooms[roomId]) {
			gamerooms[roomId].players[socket.username].numConnections -= 1;
			if(gamerooms[roomId].players[socket.username].numConnections <= 0) {
				delete gamerooms[roomId].players[socket.username];
				if(isEmpty(gamerooms[roomId].players))
					delete gamerooms[roomId];
				else {
					io.sockets.in(roomId).emit('updateUsers', gamerooms[roomId].players);
					socket.broadcast.to(roomId).emit('roomMsg', socket.username + 'has disconnected.');
				}
			}
		}
		socket.leave(roomId);
	});
});