<template>
  <div class="team-select" :class="name.toLowerCase()">
    <h1>{{ name }}</h1>
    <div class="leader" @click="leadTeam">
      <h2>Leader: {{ leader ? leader.name : null }}</h2>
    </div>
    <div class="players" @click="joinTeam">
      <ul>
        <li v-for="player in players" v-if=" ! player.isLeader">
          {{ player.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TeamSelect',
  props: {
    name: String,
    allPlayers: Object,
  },
  computed: {
    players() {
      return Object.values(this.allPlayers).filter((p) => p.teamName === this.name);
    },
    leader() {
      return this.players.find((p) => p.isLeader === true);
    },
    hasMinimumPlayers() {
      return this.leader && this.players && this.players.length > 0;
    },
  },
  watch: {
    hasMinimumPlayers() {
      this.$emit('updated', this.hasMinimumPlayers);
    },
  },
  methods: {
    leadTeam() {
      this.$socket.emit('leadTeam', this.name);
    },
    joinTeam() {
      this.$socket.emit('joinTeam', this.name);
    },
  },
}
</script>

<style scoped>
  .team-select {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .players {
    flex: 1;
  }
</style>