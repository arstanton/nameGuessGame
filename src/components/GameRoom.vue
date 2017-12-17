<template>
  <div id="game_room">
    <div id="side_bar">
      <h1>{{ roomId }}</h1>
      <button
        v-if="isOwner && ! isGameRunning"
        :disabled=" ! isGameReady"
        @click="startGame">
          Start Game
      </button>
      <PlayerList
        :players="players"
      />
      <MessageBox v-if="roomId !== ''"
        :roomId="roomId"
      />
    </div>
    <div id="play_space">
      <div id="role_select" v-if=" ! isGameRunning">
        <team-select
          name="Blue"
        />
        <team-select
          name="Red"
        />
      </div>
      <game-board v-else
        :cards="cards"
        @click="chooseCard"
      />
    </div>
  </div>
</template>

<script>
import MessageBox from './MessageBox';
import PlayerList from './PlayerList';
import TeamSelect from './TeamSelect';
import GameBoard from './GameBoard';

export default {
  name: 'GameRoom',
  components: {
    MessageBox,
    PlayerList,
    TeamSelect,
    GameBoard,
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
      cards: [],
      isGameRunning: false,
    };
  },
  methods: {
    startGame() {
      this.$socket.emit('startGame');
    },
    chooseCard(i) {
      this.$socket.emit('chooseCard', i);
    }
  },
  sockets: {
    updatePlayers(players) {
      this.players = players;
    },
    getGameState(gameboard) {
      this.cards = gameboard.wordCards;
    },
    startGame() {
      this.$socket.emit('getGameState');
      this.isGameRunning = true;
    },
  },
  computed: {
    isGameReady() {
      return true;
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
  #play_space {
    flex-grow: 3;
    display: flex;
    flex-direction: row;
  }
  #role_select {
    display: flex;
    flex-grow: 1;
  }
</style>