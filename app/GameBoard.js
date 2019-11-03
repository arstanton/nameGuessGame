'use strict';

const getRandomWords = require('./RandomWords');
const WordCard = require('./WordCard');
const Teams = require('./Teams');

module.exports = class GameBoard {
	constructor() {
		this.setNewTurnState();
		this.wordCards = [];
		this.teamScore = {
			[Teams.RED]: 8,
			[Teams.BLUE]: 8,
		};

		if (Math.random() < 0.5) {
			this.teamScore[Teams.RED]++;
			this.currentTeamName = Teams.RED;
		} else {
			this.teamScore[Teams.BLUE]++;
			this.currentTeamName = Teams.BLUE;
		}

		let words = getRandomWords(25);
		let wordIds = [];
		for(let x = 0; x < 25; x++)
			wordIds.push(x);
		wordIds.sort(() => Math.random() - 0.5);
		let redIds = wordIds.splice(0, this.teamScore[Teams.RED]);
		let blueIds = wordIds.splice(0, this.teamScore[Teams.BLUE]);
		let loseId = wordIds.pop();

		words.forEach((word, i) => {
			let type = 'Wrong';
			if (redIds.indexOf(i) != -1)
				type = Teams.RED;
			else if (blueIds.indexOf(i) != -1)
				type = Teams.BLUE;
			else if (loseId == i)
				type = 'Lose';
			this.wordCards.push(new WordCard(word, type));
		});
	}

	setNewTurnState() {
		this.clue = null;
		this.numGuesses = -1;
		this.canGiveClue = true;
		this.canPass = false;
	}

	getBoard(isLeader) {
		return Object.assign({}, this, {
			wordCards: this.getWordCards(isLeader),
		});
	}

	getWordCards(isLeader) {
		if (isLeader)
			return this.wordCards;
		else
			return this.wordCards.map(wordCard => wordCard.getWordCard(isLeader));
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

	chooseCard(i) {
		if (this.numGuesses <= -1 || this.canGiveClue)
			return false;

		let card = this.wordCards[i];
		
		if (card.revealed)
			return false;

		card.reveal();
		this.canPass = true;
		this.numGuesses--;

		if (card.type == this.currentTeamName) {
			if (--this.teamScore[this.currentTeamName] === 0)
				this.revealAllCards();
			else if (this.numGuesses <= -1)
				this.toggleTeam();
			return card.type;
		}

		if (card.type == 'Lose') {
			this.toggleTeam();
			this.teamScore[this.currentTeamName] = 0;
			this.revealAllCards();
			return card.type;
		}

		this.toggleTeam();

		if (card.type == this.currentTeamName) {
			if (--this.teamScore[this.currentTeamName] === 0)
				this.revealAllCards();
			return card.type;
		}

		return card.type;
	}

	toggleTeam() {
		this.currentTeamName = this.currentTeamName == Teams.RED ? Teams.BLUE : Teams.RED;
		this.setNewTurnState();
	}

	isGameOver() {
		return ! this.teamScore[Teams.BLUE] || ! this.teamScore[Teams.RED];
	}

	revealAllCards() {
		this.wordCards.forEach((card) => {
			card.reveal();
		});
	}
}