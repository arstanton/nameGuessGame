<template>
  <div id="game_room">
    <MessageBox v-if="roomId !== ''"
      :room-id="roomId"
    />
  </div>
</template>

<script>
import MessageBox from './MessageBox';

export default {
  name: 'GameRoom',
  components: {
    MessageBox,
  },
  props: {
    username: String,
    roomId: String,
  },
  data() {
    return {
      players: new Array(),
    };
  },
}
</script>

<style scoped>
  
</style>