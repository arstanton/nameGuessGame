<template>
  <div id="message_box">
    <ul id="messages">
      <li v-for="m in messages">
        <b>{{ m.username }}:</b> {{ m.message }}
      </li>
    </ul>
    <form onsubmit="return false">
      <h2 v-if="isGameRunning">
        {{ clue }}&nbsp;{{ numGuesses }}
      </h2>
      <template v-if=" ! isGameRunning || ! isLeader">
        <input
          v-model="message"
          class="message_input"
          autocomplete="off"
        />
        <button @click="sendMessage">↵</button>
      </template>
      <template v-else>
        <input
          v-model="localClue"
          class="clue_input"
          autocomplete="off"
          placeholder="Clue"
        />
        <input
          v-model="localNumGuesses"
          class="num_input"
          type="number"
          autocomplete="off"
          placeholder="#"
        />
        <button @click="giveClue">↵</button>
      </template>
    </form>
  </div>
</template>

<script>
export default {
  name: 'MessageBox',
  props: {
    roomId: String,
    isGameRunning: Boolean,
    clue: {
      type: String,
      default: null,
    },
    numGuesses: {
      type: Number,
      default: null,
    },
    isLeader: {
      type: Boolean,
      default: false,
    },
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
      this.$socket.emit('sendMessage', {message: this.message, roomId: this.roomId});
      this.message = '';
    },
    giveClue() {
      this.$socket.emit('giveClue', {clue: this.localClue, numGuesses: this.localNumGuesses});
      this.localClue = null;
      this.localNumGuesses = null;
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
}
form {
  background: moccasin;
  padding: 3px;
  width: 100%;
}
form input {
  border: 0;
  padding: 10px;
}
form input.message_input {
  width: 89%;
}
form input.clue_input {
  width: 69%;
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
  width: 9%;
  background: palevioletred;
  border: none;
  padding: 10px;
  cursor: pointer;
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
  background: #eee;
}
</style>