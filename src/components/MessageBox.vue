<template>
  <div id="message_box">
    <ul id="messages">
      <li v-for="m in messages">
        <b>{{ m.username }}:</b> {{ m.message }}
      </li>
    </ul>
    <input autocomplete="off" v-model="message"/>
    <button @click="sendMessage">Send</button>
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
    }
  },
  sockets: {
    updateChat(m) {
      this.messages.push(m);
    },
  },
}
</script>

<style scoped>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  form { background: #000; padding: 3px; position: fixed; bottom: 0; width: 100%; }
  form input { border: 0; padding: 10px; width: 90%; margin-right: .5%; }
  form button { width: 9%; background: rgb(130, 224, 255); border: none; padding: 10px; }
  #messages { list-style-type: none; margin: 0; padding: 0; }
  #messages li { padding: 5px 10px; }
  #messages li:nth-child(odd) { background: #eee; }
</style>