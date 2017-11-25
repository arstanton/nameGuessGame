'use strict';

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

const Room = require('./app/Room');
const Player = require('./app/Player');
const gamerooms = {};

function size(obj) {
	let size = 0, key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) size++;
	}
	return size;
}

function isEmpty(obj) {
	return Object.keys(obj).length === 0 && obj.constructor === Object;
}

const generateUniqueString = require('random-id');

io.sockets.on('connection', (socket) => {
	let roomId;
	let username;

	/**
	 *
	 * @param string $username
	 *
	 */
	socket.on('createRoom', (userInfo) => {
		roomId = generateUniqueString(5);
		username = userInfo.username;
		gamerooms[roomId] = new Room(roomId);
		gamerooms[roomId].players[username] = new Player(username);
		socket.join(roomId);
		socket.emit('roomId', {roomId: roomId, isOwner: true});
		socket.emit('updatePlayers', gamerooms[roomId].getPlayers());
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
		if (userInfo.roomId in gamerooms) {
		roomId = userInfo.roomId;
		username = userInfo.username;
			if (username in gamerooms[roomId].players) {
				//player already exists
			} else {
				gamerooms[roomId].players[username] = new Player(username);
				socket.join(roomId);
				socket.emit('roomId', {roomId: roomId, isOwner: false});
				io.sockets.in(roomId).emit('updatePlayers', gamerooms[roomId].getPlayers());
				socket.emit('roomMsg', 'Thanks for connecting ' + username + ' :)');
				socket.to(roomId).emit('roomMsg', username + ' has connected, be nice');
			}
		} else {
			//room doesn't exist
		}
	});

	socket.on('joinTeam', (teamName) => {
		if ( ! roomId || ! teamName in gamerooms[roomId].teams) return;
		if (gamerooms[roomId].teams[teamName].addToTeam(gamerooms[roomId].players[username]))
			for (let teamKey in gamerooms[roomId].teams)
				io.sockets.in(roomId).emit('updateTeam', gamerooms[roomId].teams[teamKey].get());
	});

	socket.on('leadTeam', (teamName) => {
		if ( ! roomId || ! teamName in gamerooms[roomId].teams) return;
		if (gamerooms[roomId].teams[teamName].addLeader(gamerooms[roomId].players[username]))
			for (let teamKey in gamerooms[roomId].teams)
				io.sockets.in(roomId).emit('updateTeam', gamerooms[roomId].teams[teamKey].get());
	});

	/**
	 *
	 * @param string $roomId
	 * @param string $message
	 *
	 */
	socket.on('sendMessage', (msg) => {
		try {
			io.sockets.in(msg.roomId).emit('updateChat', {username: username, message: msg.message});
		} catch (e) {
			console.log("ERROR " + e.message);
		}
	});

	socket.on('startGame', () => {
		socket.to(roomId).emit('startGame');
	});

	socket.on('checkOnlineUsers', () => {
		socket.emit('updatePlayers', gamerooms[roomId].getPlayers());
	});

	socket.on('disconnect', (reason) => {
		if (roomId && gamerooms[roomId]) {
			gamerooms[roomId].players[username].numConnections -= 1;
			if (gamerooms[roomId].players[username].numConnections <= 0) {
				delete gamerooms[roomId].players[username];
				if (isEmpty(gamerooms[roomId].players))
					delete gamerooms[roomId];
				else {
					io.sockets.in(roomId).emit('updatePlayers', gamerooms[roomId].getPlayers());
					socket.to(roomId).emit('roomMsg', username + 'has disconnected.');
				}
			}
			socket.leave(roomId);
		}
	});
});