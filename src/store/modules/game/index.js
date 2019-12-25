export default {
  namespaced: true,
  state: {
    canGiveClue: false,
    currentTeamName: null,
    isGameRunning: false,
    players: {},
    username: '',
    teamScore: null,
    timerTokens: null,
  },
  mutations: {
    setUsername(state, u) {
      state.username = u;
    },
    startGame(state, players) {
      state.players = players;
      state.isGameRunning = true;
    },
    restartGame(state) {
      state.isGameRunning = false;
      state.currentTeamName = null;
      state.teamScore = null;
    },
    updatePlayers(state, players) {
      state.players = players;
    },
    SOCKET_getGameState(state, {currentTeamName, canGiveClue, teamScore, timerTokens}) {
      state.currentTeamName = currentTeamName;
      state.canGiveClue = canGiveClue;
      state.teamScore = teamScore;
      state.timerTokens = timerTokens;
    }
  },
  actions: {
    socket_startGame(context, players) {
      this._vm.$socket.emit('getGameState');
      context.commit('startGame', players);
    },
    socket_restartGame(context) {
      context.commit('restartGame');
    },
    socket_updatePlayers(context, players) {
      context.commit('updatePlayers', players);
    },
    setUsername(context, u) {
      context.commit('setUsername', u);
    },
  },
  getters: {
    isLeader: state => {
      if (state.players[state.username])
        return state.players[state.username].isLeader;
    },
    myTeam: state => {
      return state.players[state.username] && state.players[state.username].teamName;
    },
  },
};