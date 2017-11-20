<template>
  <div id="game_room">
    <div id="side_bar">
      <h1>{{ roomId }}</h1>
      <MessageBox v-if="roomId !== ''"
        :room-id="roomId"
      />
      <PlayerList
        :players="players"
      />
    </div>
    <div id="role_select">
      <team-select
        name="Blue"
      />
      <team-select
        name="Red"
      />
      <!-- <div @click="chooseTeam('blue')" id="blue_team">
        <div @click="chooseRole('leader')" class="leader">
        </div>
        <div @click="chooseRole('player')" class="player">
        </div>
      </div>
      <div @click="chooseTeam('red')" id="red_team">
        <div @click="chooseRole('leader')" class="leader">
          {{ leader.name }}
        </div>
        <div @click="chooseRole('player')" class="player">
          <ul>
            <li v-for="player in players"></li>
          </ul>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import MessageBox from './MessageBox';
import PlayerList from './PlayerList';
import TeamSelect from './TeamSelect';

export default {
  name: 'GameRoom',
  components: {
    MessageBox,
    PlayerList,
    TeamSelect,
  },
  props: {
    username: String,
    roomId: String,
  },
  data() {
    return {
      players: {
        [this.username]: {
          name: this.username,
        },
      },
    };
  },
  sockets: {
    updatePlayers(players) {
      this.players = players;
    },
  },
}
</script>

<style scoped>
  #game_room {
    display: flex;
    flex-direction: row;
    height: 100%;
  }
  #side_bar {
    flex-grow: 1;
  }
  #role_select {
    flex-grow: 3;
    display: flex;
    flex-direction: row;
  }
</style>