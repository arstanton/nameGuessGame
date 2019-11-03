'use strict';

module.exports = class Player {
	constructor(name) {
		this.name = name;
		this.team = null;
		this.isLeader = false;
		this.numConnections = 1;
		this.resetTeam();
	}

	setTeam(teamName, isLeader = false) {
		if (this.team === teamName && this.isLeader === isLeader)
			return false;
		this.isLeader = isLeader;
		this.team = teamName;
		return true;
	}

	resetTeam() {
		this.team = null;
		this.isLeader = false;
	}

	get() {
		return {
			name: this.name,
			numConnections: this.numConnections,
			teamName: this.team,
			isLeader: this.isLeader,
		};
	}
}