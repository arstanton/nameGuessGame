<template>
  <div id="player_box">
    <ul id="players">
      <li v-for="m in players">
        <b>{{ m.name }}</b>
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
  * { margin: 0; padding: 0; box-sizing: border-box; }
  #players { list-style-type: none; margin: 0; padding: 0; }
  #players li { padding: 5px 10px; }
  #players li:nth-child(odd) { background: #eee; }
</style>