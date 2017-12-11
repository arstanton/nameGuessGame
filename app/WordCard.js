'use strict';

module.exports = class WordCard {
	constructor(word, type) {
		this.word = word;
		this.type = type;
		this.revealed = false;
	}

	reveal() {
		this.revealed = true;
	}

	getWordCard(isLeader = false) {
		let card = {
			word: this.word,
			revealed: this.revealed,
		};
		if (this.revealed || isMaster)
			card.type = this.type;
		return card;
	}
}