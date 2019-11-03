<template>
  <div id="app">
    <form v-if=" ! loggedIn" id="login_menu"  onsubmit="return false">
      <div>
        <input type="text" v-model="username" placeholder="Name">
      </div>
      <div>
        <input type="text" v-model="roomId" placeholder="Room Key">
      </div>
      <div>
        <button v-if=" ! roomId" @click="createRoom" :disabled=" ! username">Start New Game</button>
        <button v-if=" ! roomId" @click="createCoopRoom" :disabled=" ! username">Start Coop Game</button>
        <button v-else @click="joinRoom" :disabled=" ! username">Join Game</button>
      </div>
    </form>
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
      roomId: this.$route.params.key || '',
      loggedIn: false,
    };
  },
  methods: {
    createRoom() {
      this.$store.dispatch('game/setUsername', this.username);
      this.$socket.emit('createRoom', {username: this.username, roomType: 'vs'});
    },
    createCoopRoom() {
      this.$store.dispatch('game/setUsername', this.username);
      this.$socket.emit('createRoom', {username: this.username, roomType: 'coop'});
    },
    joinRoom() {
      this.$store.dispatch('game/setUsername', this.username);
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
  font-family: "Courier New", Courier, monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  align-items: center;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  background-color: moccasin;
}
input, button {
  font-family: "Courier New", Courier, monospace;
}
#login_menu {
  margin: 60px auto;
  width: 300px;
  display: flex;
  flex-direction: column;
}
#login_menu div {
  flex: 1;
}
#login_menu input, #login_menu button {
  border: 0;
  padding: 10px;
  margin: 2px;
  width: 100%;
}
.team-select.red, .red b, h2.red , b.red{
  color: tomato;
}
.team-select.red .players {
  background-color: lightpink;
}
.team-select.red .leader {
  background-color: pink;
}
.team-select.blue, .blue b, h2.blue, b.blue {
  color: teal;
}
.team-select.blue .players {
  background-color: lightblue;
}
.team-select.blue .leader {
  background-color: lightcyan;
}
</style>