<template>
  <div class="card-container"
    :class="`${card.type} ${card.revealed ? 'revealed' : 'unknown'}`">
    <div
      @click="$emit('click', index)"
      class="card">
      <div class="front face">
        <b>{{ card.word }}</b>
      </div>
      <div class="back face" :class="`${card.type}${card.revealed}`">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameCard',
  props: {
    card: Object,
    index: Number,
  },
}
</script>

<style>
.card-container {
  flex: 1 0 20%;
  perspective: 1000;
  box-sizing: border-box;
  justify-content: center;
  display: flex;
  padding: 3px;
}
.card {
  background-color: #e0ddd5;
  color: #171e42;
  cursor: pointer;
  flex: 1;
  transform-style: preserve-3d;
  transition: all .5s ease-in-out;
  border: 6px solid white;
  border-radius: 10px;
}
.face {
  transition: all .5s ease-in-out;
  align-items: center;
  justify-content: center;
  display: flex;
}
.blue.revealed .card .back {
  background-color: teal;
}
.red.revealed .card .back {
  background-color: tomato;
}
.wrong.revealed .card .back {
  background-color: #b3ab96;
}
.lose.revealed .card .back {
  background-color: dimgray;
}
.blue.unknown .card .front, .blue.revealed .card .front {
  background-color: lightcyan;
  color: teal;
}
.red.unknown .card .front, .red.revealed .card .front {
  background-color: pink;
  color: tomato;
}
.lose.unknown .card .front, .lose.revealed .card .front {
  background-color: gray;
}
.wrong.revealed .card .front {
  background-color: #b3ab96;
}

.revealed .card {
  transform: rotateY(180deg);
}
.revealed:hover .card {
  transform: rotateY(0deg);
}

.face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}
.face.back {
  transform: rotateY(180deg);
}
</style>