'use strict';

module.exports = class Team {
	constructor (name) {
		this.name = name;
		this.leader = null;
		this.players = {};
	}

	addToTeam (player) {
		if (player.isLeader) {
			player.team.removeLeader();
		}
		if (player.team) {
			if (player.team.name !== this.name)
				player.team.removeFromTeam(player);
			else
				return false;
		}
		this.players[player.name] = player;
		player.team = this;
		return true;
	}

	addLeader (player) {
		if (this.leader) return false;
		if (player.isLeader){
			if (player.team.name === this.name)
				return false;
			player.team.removeLeader();
		}
		if (player.team)
			player.team.removeFromTeam(player);
		this.leader = player;
		player.isLeader = true;
		player.team = this;
		return true;
	}

	removeLeader () {
		this.leader.isLeader = false;
		this.leader.team = null;
		this.leader = null;
	}

	removeFromTeam (player) {
		player.team = null;
		delete this.players[player.name];
	}
}