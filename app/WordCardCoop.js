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
			if (this.type[oppositeTeam] === oppositeTeam) {
				this.teamThatRevealed = team;
			}
		} else {
			super.reveal();
		}
		return true;
	}

	getWordCard(player) {
		const oppositeTeam = player.team == Teams.RED ? Teams.BLUE : Teams.RED;
		let card = {
			word: this.word,
			revealed: !! this.teamThatRevealed || this.revealed || this.teamTouched.has(player.team) && this.type[player.team] !== player.team,
			type: this.type[player.team],
			wrong: this.teamTouched.has(player.team) && this.type[oppositeTeam] === 'Wrong' || this.teamTouched.has(oppositeTeam) && this.type[player.team] === 'Wrong',
		};
		if ( !! this.teamThatRevealed) {
			const revealedTeam = this.teamThatRevealed == Teams.RED ? Teams.BLUE : Teams.RED;
			card.type = this.type[revealedTeam];
		} else if (this.revealed) {
			if (card.type === 'Wrong' || card.type === player.team)
				if (this.type[oppositeTeam] === 'Lose' || this.type[oppositeTeam] === oppositeTeam)
					card.type = this.type[oppositeTeam];
		}
		return card;
	}
}