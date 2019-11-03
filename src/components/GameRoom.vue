<template>
  <div id="game_room">
    <div id="side_bar">
      <h1 v-if=" ! teamScore">
        <span id="copy" @click="copyKeyLink">📋</span>
        <input
          id="key"
          ref="key"
          :value="roomId"
          readonly
        />
      </h1>
      <template v-else>
        <h1><b class="blue">{{ teamScore.Blue || 'Win' }}</b><b> - </b><b class="red">{{ teamScore.Red || 'Win' }}</b></h1>
      </template>
      <div class="start-container">
        <button v-if="isOwner && ! isGameRunning"
          :disabled=" ! isGameReady"
          @click="startGame">
          Start Game
        </button>
        <button v-else-if="isOwner && isGameRunning && ( ! teamScore.Blue || ! teamScore.Red)"
          @click="restartGame"
        >
          Restart Game
        </button>
        <button v-else-if="isGameRunning && ! isLeader"
          :disabled=" ! canPass"
          @click="passTurn">
          Pass
        </button>
      </div>
      <PlayerList
        class="player-list"
        :players="players"
      />
      <MessageBox v-if="roomId !== ''"
        class="message-box"
        :roomId="roomId"
        :clue="clue"
        :numGuesses="numGuesses"
        :currentTeamName="currentTeamName"
        :winMessage="winMessage"
      />
    </div>
    <div id="play_space">
      <div id="role_select" v-if=" ! isGameRunning">
        <TeamSelect
          name="Blue"
          :allPlayers="players"
          @updated="(blueHasMinimum) => {this.blueHasMinimum = blueHasMinimum;}"
        />
        <TeamSelect
          name="Red"
          :allPlayers="players"
          @updated="(redHasMinimum) => {this.redHasMinimum = redHasMinimum;}"
        />
      </div>
      <GameBoard v-else
        :cards="cards"
        :username="username"
        :isLeader="isLeader"
        :players="players"
        :currentTeamName="currentTeamName"
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
import { mapState, mapGetters } from 'vuex';

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
  mounted() {
    this.$router.push({ path: `/${this.roomId}` });
  },
  data() {
    return {
      cards: [],
      clue: null,
      numGuesses: null,
      currentTeamName: null,
      teamScore: null,
      canPass: false,
      blueHasMinimum: false,
      redHasMinimum: false,
    };
  },
  methods: {
    startGame() {
      this.$socket.emit('startGame');
    },
    restartGame() {
      this.$socket.emit('restartGame');
    },
    chooseCard(i) {
      this.$socket.emit('chooseCard', i);
    },
    passTurn() {
      this.$socket.emit('passTurn');
    },
    copyKeyLink() {
      this.$refs.key.value = window.location.href;
      this.$refs.key.select();
      document.execCommand('copy');
      this.$refs.key.value = this.roomId;
    },
  },
  sockets: {
    getGameState(gameboard) {
      this.cards = gameboard.wordCards;
      this.clue = gameboard.clue;
      this.numGuesses = gameboard.numGuesses;
      this.currentTeamName = gameboard.currentTeamName;
      this.teamScore = gameboard.teamScore;
      this.canPass = gameboard.canPass;
    },
    giveClue(clue) {
      this.clue = clue.clue;
      this.numGuesses = +clue.numGuesses;
    },
    chooseCard() {
      this.$socket.emit('getGameState');
    },
    restartGame() {
      this.cards = [];
      this.clue = null;
      this.numGuesses = null;
      this.currentTeamName = null;
      this.teamScore = null;
      this.canPass = false;
      this.isGameRunning = false;
      this.blueHasMinimum = false;
      this.redHasMinimum = false;
    },
  },
  computed: {
    isGameReady() {
      return this.redHasMinimum && this.blueHasMinimum;
    },
    winMessage() {
      if ( ! this.teamScore) return null;
      for (const [team, score] of Object.entries(this.teamScore))
        if (score === 0)
          return `${team} Wins`;
    },
    ...mapState('game', [
      'players',
      'isGameRunning',
    ]),
    ...mapGetters('game', [
      'isLeader',
    ]),
  },
}
</script>

<style scoped>
#game_room {
  display: flex;
  flex-direction: row;
  height: 100%;
  flex: 1;
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
  padding: 3px;
  width: 100%;
  box-sizing: border-box;
}
#copy {
  cursor: pointer;
}
#key {
  background-color: transparent;
  border: none;
  font: inherit;
  width: 100px;
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