<template>
  <div id="player_box">
    <ul id="players">
      <li v-for="player in players">
        <b>{{ player.name }}</b>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'PlayerList',
  props: {
    players: Object,
  },
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#player_box {
  overflow-y: auto;
}
#players {
  list-style-type: none;
  margin: 0;
  padding: 0;
}
#players li {
  padding: 5px 10px;
}
#players li:nth-child(odd) {
  background: #eee;
}
</style>