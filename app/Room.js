'use strict';

const GameBoard = require('./GameBoard');
const Team = require('./Team');
const Player = require('./Player');

module.exports = class Room {
	constructor(roomId) {
		this.roomview = false;
		this.startgame = false;
		this.endtime = true;
		this.players = {};
		this.teams = {
			red: new Team('Red'),
			blue: new Team('Blue'),
		};
		this.gameboard = new GameBoard();
		this.roomId = roomId;
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
		if ( ! this.isPlayerLeader(username)) return false;
		return this.gameboard.giveClue(clue.clue, clue.numGuesses);
	}

	chooseCard(username, i) {
		if (this.isPlayerLeader(username) || ! this.isPlayerTurn(username)) return false;
		return this.gameboard.chooseCard(i);
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
			players[key] = Object.assign({}, this.players[key]);
			delete players[key].team;
			return players;
		}, {});
		return players;
	}

	isPlayerLeader(username) {
		return this.players[username].isLeader;
	}

	isPlayerTurn(username) {
		return this.players[username].team.name === this.gameboard.currentTeamName;
	}
}