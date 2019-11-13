'use strict';

const Room = require('./Room');
const GameBoard = require('./GameBoard');
const GameBoardCoop = require('./GameBoardCoop');
const generateUniqueString = require('random-id');

const gamerooms = {};

function isEmpty(obj) {
	return Object.keys(obj).length === 0 && obj.constructor === Object;
}

function createGameBoard(roomType) {
	return roomType === 'vs' ? new GameBoard() : new GameBoardCoop();
}

module.exports = (io) => (socket) => {
	let roomId = null;
	let username = null;
	let isOwner = null;
	let roomType = null;

	/**
	 *
	 * @param string $username
	 * @param string $roomType
	 *
	 */
	socket.on('createRoom', (data) => {
		if ( ! data) return;
		roomId = generateUniqueString(5);
		username = data.username;
		isOwner = true;
		roomType = data.roomType;
		if ( ! username) return;
		gamerooms[roomId] = new Room(roomId, username, roomType, createGameBoard(roomType));
		socket.join(roomId);
		socket.emit('roomId', {roomId, isOwner, roomType});
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
				roomType = gamerooms[roomId].roomType;
				socket.emit('roomId', {roomId, isOwner, roomType});
				socket.emit('updatePlayers', gamerooms[roomId].getPlayers());
				socket.emit('roomMsg', 'Thanks for connecting ' + username + ' :)');
				socket.to(roomId).emit('roomMsg', username + ' has connected, be nice');
			}
		} else {
			//room doesn't exist
		}
	});

	socket.on('joinTeam', (teamName) => {
		if ( ! roomId || ! username) return;
		if (roomType === 'coop') {
			let player = gamerooms[roomId].players[username];
			socket.leave(`${roomId}${player.team}`);
		}
		if (gamerooms[roomId].addToTeam(username, teamName)) {
			io.sockets.in(roomId).emit('updatePlayers', gamerooms[roomId].getPlayers());
			if (roomType === 'coop') {
				socket.join(`${roomId}${teamName}`);
			}
		}
	});

	socket.on('leadTeam', (teamName) => {
		if ( ! roomId || ! username) return;
		if (gamerooms[roomId].addLeader(username, teamName))
			io.sockets.in(roomId).emit('updatePlayers', gamerooms[roomId].getPlayers());
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
		if (msg.roomId !== roomId) return;
		try {
			let team = gamerooms[roomId].players[username].team;
			if (roomType === 'coop' && team) {
				io.sockets.in(`${roomId}${team}`).emit('updateChat', {username, message: msg.message});
			} else {
				io.sockets.in(msg.roomId).emit('updateChat', {username, message: msg.message});
			}
		} catch (e) {
			console.log("ERROR " + e.message);
		}
	});

	socket.on('startGame', () => {
		if ( ! roomId || ! username) return;
		if (isOwner && gamerooms[roomId].hasEnoughPlayers()) {
			io.sockets.in(roomId).emit('startGame', gamerooms[roomId].getPlayers());
		}
	});

	socket.on('restartGame', () => {
		if ( ! roomId || ! username) return;
		let team = gamerooms[roomId].players[username].team;
		if (gamerooms[roomId].restartRoom(createGameBoard(roomType))) {
			io.sockets.in(roomId).emit('restartGame');
			io.sockets.in(roomId).emit('updatePlayers', gamerooms[roomId].getPlayers());
			if (roomType === 'coop') {
				socket.leave(`${roomId}${team}`);
			}
		}
	});

	socket.on('getGameState', () => {
		if ( ! roomId || ! username) return;
		socket.emit('getGameState', gamerooms[roomId].getGameStateFor(username));
	});

	socket.on('mousemove', (pos) => {
		if (
			! roomId ||
			! username ||
			gamerooms[roomId].isPlayerLeader(username) ||
			! gamerooms[roomId].isTeamTurn(username)
		)
			return;
		return socket.to(roomId).emit("mousemove", {username, x: pos.x, y: pos.y});
	});

	socket.on('disconnect', (reason) => {
		if (roomId && gamerooms[roomId]) {
			let team = gamerooms[roomId].players[username].team;
			if (gamerooms[roomId].removePlayer(username) && isEmpty(gamerooms[roomId].players))
				delete gamerooms[roomId];
			else {
				socket.to(roomId).emit('updatePlayers', gamerooms[roomId].getPlayers());
				socket.to(roomId).emit('roomMsg', username + 'has disconnected.');
			}
			socket.leave(roomId);
			if (roomType === 'coop') {
				socket.leave(`${roomId}${team}`);
			}
		}
	});
};