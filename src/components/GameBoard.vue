<template>
  <div id="game_board">
    <template v-for="(card, index) in cards">
      <GameCard
        @click="$emit('click', index)"
        :card="card"
        :index="index"
      />
    </template>
  </div>
</template>

<script>
import GameCard from './GameCard';

export default {
  name: 'GameBoard',
  components: {
    GameCard,
  },
  props: {
    cards: Array,
  },
}
</script>

<style>
#game_board {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  padding: 10px;
}
</style>