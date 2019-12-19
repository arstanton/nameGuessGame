<template>
  <div id="message_box">
    <ul id="messages">
      <li v-for="m in messages">
        <b>{{ m.username }}:</b> {{ m.message }}
      </li>
    </ul>
    <h2 v-if="isGameRunning" :class="currentTeamName && currentTeamName.toLowerCase()">
      <template v-if="winMessage">
        {{ winMessage }}
      </template>
      <template v-else-if="clue">
        {{ clue }}&nbsp;{{ numGuesses }}
      </template>
      <template v-else>
        {{ currentTeamName }} Turn
      </template>
    </h2>
    <form onsubmit="return false" v-if=" ! isGameRunning || ! needsLeaders || ! isLeader || winMessage">
      <div>
        <input
          v-model="message"
          class="message_input"
          autocomplete="off"
        />
      </div>
      <button :class="myTeam && myTeam.toLowerCase()"@click="sendMessage">↵</button>
    </form>
    <form onsubmit="return false" v-if="isGameRunning && ( ! needsLeaders || isLeader)">
      <div>
        <input
          ref="clue"
          v-model="localClue"
          class="clue_input"
          autocomplete="off"
          placeholder="Clue"
        />
        <input
          ref="numGuesses"
          v-model="localNumGuesses"
          class="num_input"
          type="number"
          autocomplete="off"
          placeholder="#"
        />
      </div>
      <button :class="myTeam && myTeam.toLowerCase()" @click="giveClue">↵</button>
    </form>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'MessageBox',
  props: {
    roomId: String,
    currentTeamName: String,
    winMessage: {
      type: String,
      default: null,
    },
    clue: {
      type: String,
      default: null,
    },
    numGuesses: {
      type: Number,
      default: null,
    },
    needsLeaders: Boolean,
  },
  data() {
    return {
      messages: new Array(),
      message: '',
      localClue: null,
      localNumGuesses: null,
    };
  },
  methods: {
    sendMessage() {
      if (this.message) {
        this.$socket.emit('sendMessage', {message: this.message, roomId: this.roomId});
        this.message = '';
      }
    },
    giveClue() {
      if (this.localClue === null || this.localClue === '') {
        this.$refs.clue.focus();
        return false;
      }
      if (this.localNumGuesses === null || this.localNumGuesses === '') {
        this.$refs.numGuesses.focus();
        return false;
      }
      this.$socket.emit('giveClue', {clue: this.localClue, numGuesses: this.localNumGuesses});
      this.localClue = null;
      this.localNumGuesses = null;
      this.$refs.clue.focus();
    },
    scrollToEnd() {
      this.$nextTick(() => {
        let container = this.$el.querySelector("#messages");
        container.scrollTop = container.scrollHeight;
      });
    },
  },
  sockets: {
    updateChat(m) {
      this.messages.push(m);
      this.scrollToEnd();
    },
  },
  computed: {
    ...mapState('game', [
      'isGameRunning',
    ]),
    ...mapGetters('game', [
      'isLeader',
      'myTeam',
    ]),
  },
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#message_box {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  overflow-y: auto;
}
h2 {
  text-transform: uppercase;
  padding-right: 10px;
}
form {
  background: moccasin;
  padding: 10px;
  width: 100%;
  display: flex;
}
form div {
  flex: 1;
}
form input {
  border: 0;
  padding: 10px;
}
form input.message_input {
  width: 100%;
}
form input.clue_input {
  width: 69%;
  text-transform: uppercase;
}
form input.num_input {
  width: 18%;
}
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none;
  margin: 0;
}
form button {
  width: 35px;
  background: palevioletred;
  border: none;
  padding: 10px;
  cursor: pointer;
}
form button.blue {
  background: paleturquoise;
}
#messages {
  list-style-type: none;
  text-align: left;
  width: 100%;
  flex: 1;
  overflow-y: auto;
  word-wrap: break-word;
}
#messages li {
  padding: 5px 10px;
}
#messages li:nth-child(odd) {
  background: antiquewhite;
}
</style>