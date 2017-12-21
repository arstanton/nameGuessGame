<template>
  <div id="game_room">
    <div id="side_bar">
      <h1>{{ roomId }}</h1>
      <div v-if="isOwner && ! isGameRunning" class="start-container">
        <button
          :disabled=" ! isGameReady"
          @click="startGame">
          Start Game
        </button>
      </div>
      <PlayerList
        class="player-list"
        :players="players"
      />
      <MessageBox v-if="roomId !== ''"
        class="message-box"
        :roomId="roomId"
        :isGameRunning="isGameRunning"
        :clue="clue"
        :numGuesses="numGuesses"
        :isLeader="isLeader"
      />
    </div>
    <div id="play_space">
      <div id="role_select" v-if=" ! isGameRunning">
        <TeamSelect
          name="Blue"
          @updated="(blueHasMinimum) => {this.blueHasMinimum = blueHasMinimum;}"
        />
        <TeamSelect
          name="Red"
          @updated="(redHasMinimum) => {this.redHasMinimum = redHasMinimum;}"
        />
      </div>
      <GameBoard v-else
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
      clue: null,
      numGuesses: null,
      currentTeamName: null,
      isGameRunning: false,
      blueHasMinimum: false,
      redHasMinimum: false,
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
      this.clue = gameboard.clue;
      this.numGuesses = gameboard.numGuesses;
      this.currentTeamName = gameboard.currentTeamName;
    },
    startGame(players) {
      this.$socket.emit('getGameState');
      this.players = players;
      this.isGameRunning = true;
    },
  },
  computed: {
    isGameReady() {
      return this.redHasMinimum && this.blueHasMinimum;
    },
    isLeader() {
      return this.players[this.username].isLeader;
    }
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
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 512px;
}
#play_space {
  flex: 3;
  display: flex;
}
#role_select {
  flex: 1;
  display: flex;
}
.player-list {
  flex: 1;
}
.message-box {
  flex: 5;
}
.start-container {
  background: moccasin;
  padding: 3px;
  width: 100%;
  box-sizing: border-box;
}
button {
  width: 100%;
  padding: 10px;
  cursor: pointer;
}
button[disabled] {
  cursor: default;
}
</style>