'use strict';

const GameBoardBase = require('./GameBoardBase');
const getRandomWords = require('./RandomWords');
const WordCard = require('./WordCard');
const Teams = require('./Teams');

module.exports = class GameBoard extends GameBoardBase {
	constructor() {
		super();
		this.needsLeaders = true;
		this.initScore();
		this.initCards();
	}

	initScore() {
		this.teamScore = {
			[Teams.RED]: 8,
			[Teams.BLUE]: 8,
		};
	}

	initCards() {
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

	isGameOver() {
		return ! this.teamScore[Teams.BLUE] || ! this.teamScore[Teams.RED];
	}
}