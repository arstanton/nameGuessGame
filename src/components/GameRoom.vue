<template>
  <div id="game_room">
    <div id="side_bar">
      <h1>{{ roomId }}</h1>
      <button v-if="isOwner" :disabled="isGameReady" @click="startGame">Start Game</button>
      <PlayerList
        :players="players"
      />
      <MessageBox v-if="roomId !== ''"
        :roomId="roomId"
      />
    </div>
    <div id="role_select">
      <team-select
        name="Blue"
      />
      <team-select
        name="Red"
      />
    </div>
  </div>
</template>

<script>
import MessageBox from './MessageBox';
import PlayerList from './PlayerList';
import TeamSelect from './TeamSelect';

export default {
  name: 'GameRoom',
  components: {
    MessageBox,
    PlayerList,
    TeamSelect,
  },
  props: {
    username: String,
    roomId: String,
    isOwner: Boolean,
  },
  data() {
    return {
      players: {
        [this.username]: {
          name: this.username,
        },
      },
    };
  },
  methods: {
    startGame() {
      this.$socket.emit('startGame');
    },
  },
  sockets: {
    updatePlayers(players) {
      this.players = players;
    },
  },
  computed: {
    isGameReady() {
      return false;
    },
  },
}
</script>

<style scoped>
  #game_room {
    display: flex;
    flex-direction: row;
    height: 100%;
  }
  #side_bar {
    flex-grow: 1;
    max-width: 512px;
  }
  #role_select {
    flex-grow: 3;
    display: flex;
    flex-direction: row;
  }
</style>