<template>
  <div id="game_board">
    <div v-for="(card, index) in cards" @click="$emit('click', index)" class="card">
      {{ card.word }}
      <template v-if="card.type && ! card.revealed">
        LEADER VIEW
        {{ card.type }}
        {{ card.revealed }}
      </template>
      <template v-else>
        ALL VIEW
        {{ card.type }}
        {{ card.revealed }}
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameBoard',
  props: {
    cards: Array,
  },
}
</script>

<style scoped>
#game_board {
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}
.card {
  flex: 1 0 20%;
  box-sizing: border-box;
  background: #e0ddd5;
  color: #171e42;
  padding: 10px;
  border: 1px solid black;
}
</style>