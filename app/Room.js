'use strict';

const GameBoard = require('./GameBoard');
const Team = require('./Team');
const Player = require('./Player');

module.exports = class Room {
	constructor(roomId, username) {
		this.endtime = true;
		this.players = {};
		this.addPlayer(username);
		this.teams = {
			red: new Team('Red'),
			blue: new Team('Blue'),
		};
		this.gameboard = new GameBoard();
		this.roomId = roomId;
	}

	restartRoom() {
		if ( ! this.gameboard.isGameOver()) return false;
		this.teams = {
			red: new Team('Red'),
			blue: new Team('Blue'),
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

	addToTeam(username, teamName) {
		if ( ! teamName in this.teams) return false;
		return this.teams[teamName].addToTeam(this.players[username]);
	}

	addLeader(username, teamName) {
		if ( ! teamName in this.teams) return false;
		return this.teams[teamName].addLeader(this.players[username]);
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
		for (let teamKey in this.teams)
			if ( ! this.teams[teamKey].hasEnoughPlayers())
				return false;
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
		return this.players[username].team && this.players[username].team.name === this.gameboard.currentTeamName;
	}
}