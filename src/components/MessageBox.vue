<template>
  <div id="message_box">
    <ul id="messages">
      <li v-for="m in messages">
        <b>{{ m.username }}:</b> {{ m.message }}
      </li>
    </ul>
    <form onsubmit="return false">
      <input autocomplete="off" v-model="message"/>
      <button @click="sendMessage">↵</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'MessageBox',
  props: {
    roomId: String,
  },
  data() {
    return {
      messages: new Array(),
      message: '',
    };
  },
  methods: {
    sendMessage() {
      this.$socket.emit('sendMessage', {message: this.message, roomId: this.roomId});
      this.message = '';
    },
    scrollToEnd() {
      let container = this.$el.querySelector("#messages");
      container.scrollTop = container.scrollHeight;
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
  width: 89%;
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