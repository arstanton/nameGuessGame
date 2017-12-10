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
}