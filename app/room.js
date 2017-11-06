'use strict';

const GameBoard = require('./gameboard');
const Team = require('./team');

module.exports = class Room {
	constructor (roomId) {
		this.roomview = false;
		this.startgame = false;
		this.endtime = true;
		this.players = {};
		this.redTeam = new Team('Red');
		this.blueTeam = new Team('Blue');
		this.gameboard = new GameBoard();
		this.roomId = roomId;
	}

	startTimer (intervalCallback, endTimeCallback) {
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
}