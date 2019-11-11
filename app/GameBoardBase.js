'use strict';

const Teams = require('./Teams');

module.exports = class GameBoard {
	constructor() {
		this.setNewTurnState();
		this.wordCards = [];
	}

	setNewTurnState() {
		this.clue = null;
		this.numGuesses = -1;
		this.canGiveClue = true;
		this.canPass = false;
	}

	getBoard(player) {
		return Object.assign({}, this, {
			wordCards: this.getWordCards(player),
		});
	}

	getWordCards(player) {
		if (player.isLeader && this.needsLeaders)
			return this.wordCards;
		else
			return this.wordCards.map(wordCard => wordCard.getWordCard(player));
	}

	giveClue(clue, numGuesses) {
		if (this.canGiveClue) {
			this.clue = clue;
			this.numGuesses = numGuesses;
			this.canGiveClue = false;
			return true;
		}
		return false;
	}

	passTurn() {
		if (this.canPass) {
			this.toggleTeam();
			return true;
		}
		return false;
	}

	toggleTeam() {
		this.currentTeamName = this.currentTeamName == Teams.RED ? Teams.BLUE : Teams.RED;
		this.setNewTurnState();
	}
}