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
      :roomId="roomId"
      :isOwner="isOwner"
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
    roomId({roomId, isOwner}) {
      this.roomId = roomId;
      this.isOwner = isOwner;
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
.team-select.red, .red b {
  color: tomato;
}
.team-select.red .players {
  background-color: lightpink;
}
.team-select.red .leader {
  background-color: pink;
}
.team-select.blue, .blue b {
  color: teal;
}
.team-select.blue .players {
  background-color: lightblue;
}
.team-select.blue .leader {
  background-color: lightcyan;
}
</style>