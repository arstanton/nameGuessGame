<template>
  <div id="app">
    <div v-if="!loggedIn" id="login_menu">
      <input type="text" v-model="username" placeholder="Name">
      <input type="text" v-model="roomkey" placeholder="Key">
      <button @click="loggedIn = true" :disabled="!username">{{ roomkey ? 'Join Game' : 'Start New Game' }}</button>
    </div>
    <GameRoom v-if="loggedIn"
      :username="username"
      :roomkey="roomkey"
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
      roomkey: '',
      loggedIn: false,
    };
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
