export default {
  namespaced: true,
  state: {
    isGameRunning: false,
    players: {},
    username: '',
  },
  mutations: {
    setUsername(state, u) {
      state.username = u;
    },
    startGame(state, players) {
      state.players = players;
      state.isGameRunning = true;
    },
    SOCKET_restartGame(state) {
      state.players = {};
    },
    updatePlayers: (state, players) => {
      state.players = players;
    },
  },
  actions: {
    socket_startGame(context, players) {
      this._vm.$socket.emit('getGameState');
      context.commit('startGame', players);
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
  },
};