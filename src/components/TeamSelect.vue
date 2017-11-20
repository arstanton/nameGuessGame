<template>
  <div class="team-select" :class="name.toLowerCase()">
    <h1>{{ name }}</h1>
    <h2 v-if="leader" >{{ leader.name }}</h2>
    <div class="players" @click="joinTeam">
      <ul>
        <li v-for="player in players">
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
  },
  data() {
    return {
      leader: null,
      players: {},
    };
  },
  methods: {
    joinTeam() {
      this.$socket.emit('joinTeam', this.name.toLowerCase());
    },
  },
  sockets: {
    updateTeam(team) {
      if (team.name !== this.name) return;
      this.leader = team.leader;
      this.players = team.players;
    },
  },
}
</script>

<style scoped>
  .team-select {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
  .players {
    flex-grow: 1;
  }
</style>