<template>
  <div id="game_board">
    <div
      v-for="(card, index) in cards"
      @click="$emit('click', index)"
      :class="`card ${card.type}${card.revealed}`">
      <b>{{ card.word }}</b>
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
  flex: 1;
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
  align-items: center;
  justify-content: center;
  display: flex;
}
.card.bluetrue {
  background-color: teal;
}
.card.redtrue {
  background-color: tomato;
}
.card.wrongtrue {
  background-color: #b3ab96;
}
.card.losetrue {
  background-color: dimgray;
}
.card.bluefalse {
  background-color: lightcyan;
}
.card.redfalse {
  background-color: pink;
}
.card.losefalse {
  background-color: gray;
}
</style>