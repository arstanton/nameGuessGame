'use strict';

const WordCard = require('./WordCard');
const Teams = require('./Teams');

module.exports = class WordCardCoop extends WordCard {
	constructor(word, type) {
		super(word, type);
		this.teamThatRevealed = null;
		this.teamTouched = new Set();
	}

	reveal(team = null) {
		if (this.revealed) return false;
		if (team) {
			if (this.teamTouched.has(team)) return false;
			this.teamTouched.add(team);
			const oppositeTeam = team == Teams.RED ? Teams.BLUE : Teams.RED;
			if (
				this.type[oppositeTeam] === oppositeTeam
				|| this.type[oppositeTeam] === 'Wrong'
				&& this.type[team] === 'Wrong'
			) {
				this.teamThatRevealed = team;
			}
		} else {
			super.reveal();
		}
		return true;
	}

	getWordCard(player) {
		let card = {
			word: this.word,
			revealed: !! this.teamThatRevealed || this.revealed,
			type: this.type[player.team],
		};
		if ( !! this.teamThatRevealed) {
			const revealedTeam = this.teamThatRevealed == Teams.RED ? Teams.BLUE : Teams.RED;
			card.type = this.type[revealedTeam];
		} else if (this.revealed) {
			const oppositeTeam = player.team == Teams.RED ? Teams.BLUE : Teams.RED;
			card.type = this.type[oppositeTeam];
		}
		return card;
	}
}