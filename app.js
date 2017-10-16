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
		socket.user = userInfo.username;
		roomId = generateUniqueString(5);
		gamerooms[roomId] = new Room(roomId);
		socket.emit('roomId', roomId);
		socket.join(roomId);
		gamerooms[roomId].players[socket.user] = new Player(socket.user);
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
		socket.user = userInfo.username;
		if(userInfo.roomId in gamerooms) {
			if(socket.user in gamerooms[userInfo.room].players) {
				//player already exists
			} else {
				roomId = userInfo.roomId;
				gamerooms[roomId].players[socket.user] = new Player(socket.user);
			}
			socket.emit('roomMsg', 'Thanks for connecting ' + socket.user + ' :)');
			socket.broadcast.to(userInfo.roomId).emit('roomMsg', socket.user + ' has connected, be nice'); //broadcasts to all sockets in the given room, except to the socket on which it was called
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
	socket.on('sendMsg', function (msg) {
		try {
			io.sockets.in(msg.roomId).emit('updateChat', socket.user, msg.roomId, msg.message);
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
			gamerooms[roomId].players[socket.user].numConnections -= 1;
			if(gamerooms[roomId].players[socket.user].numConnections <= 0) {
				delete gamerooms[roomId].players[socket.user];
				if(isEmpty(gamerooms[roomId].players))
					delete gamerooms[roomId];
				else {
					io.sockets.in(roomId).emit('updateUsers', gamerooms[roomId].players);
					socket.broadcast.to(roomId).emit('roomMsg', socket.user + 'has disconnected.');
				}
			}
		}
		socket.leave(roomId);
	});
});