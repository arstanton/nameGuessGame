<template>
  <div id="app">
    <div v-if="!loggedIn" id="login_menu">
      <input type="text" v-model="username" placeholder="Name">
      <input type="text" v-model="roomId" placeholder="Room Key">
      <button v-if="!roomId" @click="createRoom" :disabled="!username">Start New Game</button>
      <button v-else @click="joinRoom" :disabled="!username">Join Game</button>
    </div>
    <GameRoom v-if="loggedIn"
      :username="username"
      :room-id="roomId"
    />
  </div>
</template>

<script>
import GameRoom from './components/GameRoom';

export default {
  name: 'app',
  components: {
    GameRoom,
  },
  data() {
    return {
      username: '',
      roomId: '',
      loggedIn: false,
    };
  },
  methods: {
    createRoom() {
      this.$socket.emit('createRoom', {username: this.username});
    },
    joinRoom() {
      this.$socket.emit('joinRoom', {roomId: this.roomId, username: this.username});
    },
  },
  sockets: {
    roomId(r) {
      this.roomId = r;
      this.loggedIn = true;
    },
  },
}
</script>

<style>
body {
  margin: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
#login_menu {
  margin: 60px auto;
  width: 600px;
}
.team-select.red {
  color: red;
}
.team-select.blue {
  color: blue;
}

</style>
