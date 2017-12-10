'use strict';

const getRandomWords = require('./RandomWords');
const WordCard = require('./WordCard');

module.exports = class GameBoard {
	constructor() {
		this.canGiveClue = true;
		this.clue = null;
		this.numGuesses = -1;
		this.wordCards = [];
		this.teamScore = {
			'Red': 8,
			'Blue': 8,
		};

		if (Math.random() < 0.5) {
			this.teamScore['Red']++;
			this.currentTeam = 'Red';
		} else {
			this.teamScore['Blue']++;
			this.currentTeam = 'Blue';
		}

		let words = getRandomWords(25);
		let wordIds = [];
		for(let x = 0; x < 25; x++)
			wordIds.push(x);
		wordIds.sort(() => Math.random() - 0.5);
		let redIds = wordIds.splice(0, this.teamScore['Red']);
		let blueIds = wordIds.splice(0, this.teamScore['Blue']);
		let loseId = wordIds.pop();

		words.forEach((word, i) => {
			let type = null;
			if (redIds.indexOf(i) != -1)
				type = 'Red';
			else if (blueIds.indexOf(i) != -1)
				type = 'Blue';
			else if (loseId == i)
				type = 'Lose';
			this.wordCards.push(new WordCard(word, type));
		});
	}

	giveClue(clue, numGuesses) {
		if (this.canGiveClue) {
			this.clue = clue;
			this.numGuesses = numGuesses;
		}
		this.canGiveClue = false;
	}

	chooseCard(i) {
		if (this.numGuesses <= -1)
			return false;

		let card = this.wordCards[i];
		
		if (card.revealed)
			return false;

		card.reveal();
		this.numGuesses--;

		if (card.type == this.currentTeam) {
			this.teamScore[this.currentTeam]--;
			if (this.numGuesses <= -1)
				this.toggleTeam();
			return card.type;
		}

		if (card.type == 'Lose')
			return card.type;

		this.toggleTeam();

		if (card.type == this.currentTeam) {
			this.teamScore[this.currentTeam]--;
			return card.type;
		}

		return card.type;
	}

	toggleTeam() {
		this.currentTeam == 'Red' ? 'Blue' : 'Red';
		this.canGiveClue = true;
	}
}