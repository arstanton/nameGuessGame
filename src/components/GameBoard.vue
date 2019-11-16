<template>
  <div id="game_board" ref="gameboard">
    <template v-for="(card, index) in cards">
      <GameCard
        @click="$emit('click', index)"
        :card="card"
        :index="index"
      />
    </template>
    <div
      v-for="p in pointers"
      class="pointer"
      :style="{left: `${p.x}px`, top: `${p.y}px`}">
      {{ p.pointer }}
    </div>
  </div>
</template>

<script>
import GameCard from './GameCard';
Function.prototype.throttle = function (milliseconds, context) {
  var baseFunction = this,
    lastEventTimestamp = null,
    limit = milliseconds;

  return function () {
    var self = context || this,
      now = Date.now();

    if ( ! lastEventTimestamp || now - lastEventTimestamp >= limit) {
      lastEventTimestamp = now;
      baseFunction.apply(self, arguments);
    }
  };
};

export default {
  name: 'GameBoard',
  components: {
    GameCard,
  },
  props: {
    cards: Array,
    isLeader: {
      type: Boolean,
      default: false,
    },
    players: Object,
    username: String,
    currentTeamName: String,
    showPointers: Boolean,
    roomType: String,
  },
  data() {
    return {
      pointers: this.getUpdatedPointers(),
    };
  },
  methods: {
    mousemove: (function (e) {
      this.$socket.emit('mousemove', {
        x: (e.pageX - this.$refs.gameboard.offsetLeft) / this.$refs.gameboard.offsetWidth,
        y: (e.pageY - this.$refs.gameboard.offsetTop) / this.$refs.gameboard.offsetHeight,
      });
    }).throttle(30),
    getUpdatedPointers() {
      if ( ! this.showPointers) return {};
      return Object.keys(this.players)
      .filter(key => {
        return ! this.players[key].isLeader && this.players[key].name !== this.username && this.players[key].teamName && (this.players[key].teamName === this.currentTeamName && this.roomType === 'vs' || this.players[this.username].teamName === this.players[key].teamName);
      })
      .reduce((obj, key) => {
        obj[key] = Object.assign({}, this.players[key]);
        obj[key].pointer = obj[key].teamName === 'Red' ? '🔴' : '🔵';
        return obj;
      }, {});
    },
  },
  watch: {
    players() {
      this.pointers = this.getUpdatedPointers();
    },
    currentTeamName() {
      this.pointers = this.getUpdatedPointers();
    }
  },
  mounted() {
    if ( ! this.isLeader && this.showPointers) {
      this.$refs.gameboard.addEventListener('mousemove', this.mousemove);
    }
  },
  beforeDestroy() {
    this.$refs.gameboard.removeEventListener('mousemove', this.mousemove);
  },
  sockets: {
    mousemove: (function (p) {
      this.pointers[p.username] = {
        name: p.username,
        pointer: this.pointers[p.username].pointer,
        x: p.x * this.$refs.gameboard.offsetWidth,
        y: p.y * this.$refs.gameboard.offsetHeight,
      };
    }).throttle(30),
  },
}
</script>

<style>
#game_board {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  padding: 10px;
  overflow: hidden;
  position: relative;
}
.pointer {
  position: absolute;
  pointer-events: none;
}
</style>