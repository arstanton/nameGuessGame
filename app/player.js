'use strict';

module.exports = class Player {
	constructor (name) {
		this.name = name;
		this.numConnections = 1;
	}

	setLeader (leader) {
		this.leader = leader;
	}

	setTeam (team) {
		this.team = team;
	}
}