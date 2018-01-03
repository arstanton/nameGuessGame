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

const Room = require('./app/Room');
const gamerooms = {};

function isEmpty(obj) {
	return Object.keys(obj).length === 0 && obj.constructor === Object;
}

const generateUniqueString = require('random-id');

io.sockets.on('connection', (socket) => {
	let roomId = null;
	let username = null;
	let isOwner = null;

	/**
	 *
	 * @param string $username
	 *
	 */
	socket.on('createRoom', (userInfo) => {
		if ( ! userInfo) return;
		roomId = generateUniqueString(5);
		username = userInfo.username;
		isOwner = true;
		if ( ! username) return;
		gamerooms[roomId] = new Room(roomId, username);
		socket.join(roomId);
		socket.emit('roomId', {roomId, isOwner});
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
		if ( ! userInfo) return;
		if (userInfo.roomId in gamerooms) {
			roomId = userInfo.roomId;
			username = userInfo.username;
			isOwner = false;
			if ( ! roomId || ! username) return;
			if (username in gamerooms[roomId].players) {
				//player already exists
			} else {
				gamerooms[roomId].addPlayer(username);
				socket.join(roomId);
				socket.emit('roomId', {roomId, isOwner});
				io.sockets.in(roomId).emit('updatePlayers', gamerooms[roomId].getPlayers());
				for (let teamKey in gamerooms[roomId].teams)
					socket.emit('updateTeam', gamerooms[roomId].teams[teamKey].get());
				socket.emit('roomMsg', 'Thanks for connecting ' + username + ' :)');
				socket.to(roomId).emit('roomMsg', username + ' has connected, be nice');
			}
		} else {
			//room doesn't exist
		}
	});

	socket.on('joinTeam', (teamName) => {
		if ( ! roomId || ! username) return;
		if (gamerooms[roomId].addToTeam(username, teamName))
			for (let teamKey in gamerooms[roomId].teams)
				io.sockets.in(roomId).emit('updateTeam', gamerooms[roomId].teams[teamKey].get());
	});

	socket.on('leadTeam', (teamName) => {
		if ( ! roomId || ! username) return;
		if (gamerooms[roomId].addLeader(username, teamName))
			for (let teamKey in gamerooms[roomId].teams)
				io.sockets.in(roomId).emit('updateTeam', gamerooms[roomId].teams[teamKey].get());
	});

	/**
	 *
	 * @param string $clue
	 * @param number $numGuesses
	 *
	 */
	socket.on('giveClue', (clue) => {
		if ( ! roomId || ! username) return;
		if (gamerooms[roomId].giveClue(username, clue))
			io.sockets.in(roomId).emit('giveClue', clue);
	});

	socket.on('chooseCard', (i) => {
		if ( ! roomId || ! username) return;
		if (gamerooms[roomId].chooseCard(username, i))
			io.sockets.in(roomId).emit('chooseCard');
	});

	socket.on('passTurn', () => {
		if ( ! roomId || ! username) return;
		if (gamerooms[roomId].passTurn(username))
			io.sockets.in(roomId).emit('chooseCard');
	});

	/**
	 *
	 * @param string $roomId
	 * @param string $message
	 *
	 */
	socket.on('sendMessage', (msg) => {
		try {
			io.sockets.in(msg.roomId).emit('updateChat', {username, message: msg.message});
		} catch (e) {
			console.log("ERROR " + e.message);
		}
	});

	socket.on('startGame', () => {
		if ( ! roomId || ! username) return;
		if (isOwner && gamerooms[roomId].hasEnoughPlayers())
			io.sockets.in(roomId).emit('startGame', gamerooms[roomId].getPlayers());
	});

	socket.on('getGameState', () => {
		if ( ! roomId || ! username) return;
		socket.emit('getGameState', gamerooms[roomId].getGameStateFor(username));
	});

	socket.on('mousemove', function(pos) {
		if ( ! roomId || ! username || gamerooms[roomId].isPlayerLeader(username) || ! gamerooms[roomId].isTeamTurn(username)) return;
      	return socket.to(roomId).emit("mousemove", {username, x: pos.x, y: pos.y});
    });

	socket.on('disconnect', (reason) => {
		if (roomId && gamerooms[roomId]) {
			if (--gamerooms[roomId].players[username].numConnections <= 0) {
				let team = gamerooms[roomId].players[username].team;
				if (team && gamerooms[roomId].isPlayerLeader(username)) {
					team.removeLeader();
				}
				gamerooms[roomId].players[username].removeFromTeam();
				delete gamerooms[roomId].players[username];
				if (isEmpty(gamerooms[roomId].players))
					delete gamerooms[roomId];
				else {
					if (team) socket.to(roomId).emit('updateTeam', team.get());
					socket.to(roomId).emit('updatePlayers', gamerooms[roomId].getPlayers());
					socket.to(roomId).emit('roomMsg', username + 'has disconnected.');
				}
			}
			socket.leave(roomId);
		}
	});
});