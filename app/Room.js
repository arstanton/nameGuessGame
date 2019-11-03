'use strict';

const GameBoard = require('./GameBoard');
const Teams = require('./Teams');
const Player = require('./Player');

module.exports = class Room {
	constructor(roomId, username) {
		this.endtime = true;
		this.players = {};
		this.addPlayer(username);
		this.leaders = {
			[Teams.RED]: null,
			[Teams.BLUE]: null,
		};
		this.gameboard = new GameBoard();
		this.roomId = roomId;
	}

	restartRoom() {
		if ( ! this.gameboard.isGameOver()) return false;
		this.leaders = {
			[Teams.RED]: null,
			[Teams.BLUE]: null,
		};
		for (let playerKey in this.players)
			this.players[playerKey].resetTeam();
		this.gameboard = new GameBoard();
		return true;
	}

	startTimer(intervalCallback, endTimeCallback) {
		this.endtime = false;
		var countDownDate = new Date(new Date().getTime() + .1*50000);

		var x = setInterval(function() {
			var now = new Date().getTime();
			var distance = countDownDate - now;
			var seconds = Math.ceil(distance / 1000);
			intervalCallback(seconds);
			if (distance <= 0) {
				clearInterval(x);
				this.endtime = true;
				endTimeCallback();
			}
		}, 250);
	}

	addPlayer(username) {
		this.players[username] = new Player(username);
	}

	removePlayer(username) {
		if (--this.players[username].numConnections <= 0) {
			const player = this.players[username];
			const team = player.team;
			if (team) {
				if (this.isPlayerLeader(username))
					this.leaders[player.team] = null;
			}
			delete this.players[username];
			return true;
		}
		return false;
	}

	addToTeam(username, teamName) {
		if ( ! Object.values(Teams).includes(teamName)) return false;
		const player = this.players[username];
		if (player.isLeader)
			this.leaders[player.team] = null;
		return player.setTeam(teamName, false);
	}

	addLeader(username, teamName) {
		if ( ! Object.values(Teams).includes(teamName)) return false;
		if (this.leaders[teamName] != null) return false;
		const player = this.players[username];
		if (player.isLeader)
			this.leaders[player.team] = null;
		this.leaders[teamName] = player;
		return player.setTeam(teamName, true);
	}

	giveClue(username, clue) {
		if ( ! this.isPlayerLeader(username) || ! this.isTeamTurn(username)) return false;
		return this.gameboard.giveClue(clue.clue, clue.numGuesses);
	}

	chooseCard(username, i) {
		if (this.isPlayerLeader(username) || ! this.isPlayerTurn(username)) return false;
		return this.gameboard.chooseCard(i);
	}

	passTurn(username) {
		if (this.isPlayerLeader(username) || ! this.isPlayerTurn(username)) return false;
		return this.gameboard.passTurn();
	}

	getGameStateFor(username) {
		return this.gameboard.getBoard(this.isPlayerLeader(username));
	}

	hasEnoughPlayers() {
		for (let team of Object.values(Teams)) {
			const teamHasPlayer = Object.values(this.players).find(p => p.team === team)
			if ( ! this.leaders[team] || ! teamHasPlayer)
				return false;
		}
		return true;
	}

	getPlayers() {
		let players = Object.keys(this.players).reduce((players, key) => {
			players[key] = this.players[key].get();
			return players;
		}, {});
		return players;
	}

	isPlayerLeader(username) {
		return this.players[username].isLeader;
	}

	isPlayerTurn(username) {
		return this.isTeamTurn(username) && ! this.gameboard.canGiveClue;
	}

	isTeamTurn(username) {
		return this.players[username].team && this.players[username].team === this.gameboard.currentTeamName;
	}
}