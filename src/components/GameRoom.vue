<template>
  <div id="game_room">
    <h1>{{ roomId }}</h1>
    <MessageBox v-if="roomId !== ''"
      :room-id="roomId"
    />
    <PlayerList
      :players="players"
    />
  </div>
</template>

<script>
import MessageBox from './MessageBox';
import PlayerList from './PlayerList';

export default {
  name: 'GameRoom',
  components: {
    MessageBox,
    PlayerList,
  },
  props: {
    username: String,
    roomId: String,
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
  sockets: {
    updatePlayers(players) {
      this.players = players;
    },
  },
}
</script>

<style scoped>
  
</style>