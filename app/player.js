'use strict';

module.exports = class Player {
	constructor(name) {
		this.name = name;
		this.numConnections = 1;
		this.team = null;
	}

	setLeaderOf(team) {
		return team.addLeader(this);
	}

	setTeam(team) {
		return team.addToTeam(this);
	}

	removeFromTeam() {
		if ( ! this.team) return false;
		this.team.removeFromTeam(this);
		return true;
	}

	get() {
		return {
			name: this.name,
			numConnections: this.numConnections,
		};
	}
}