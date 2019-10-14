import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  
    game: {
      board:{rows: 6, columns: 7, numOfConnectionToWin: 4, matrix:[]},
      playerOne: {color: 'blue', name: 'Shani', id: 1},
      playerTwo: {color: 'red', name: 'Matan', id: 2},
    },
    currPlayer: {},
  },
  getters: {
    getCurrPlayer(state) {
      return state.currPlayer;
    },
    getBoard(state) {
      return state.game.board
    },
    getWidth(state) {
      return state.game.board.columns
    },
    getHeight(state) {
      return state.game.board.rows
    },
  },
  mutations: {
    setCurrPlayer(state) {
      if(!state.currPlayer.id) state.currPlayer = state.game.playerOne
      else if(state.currPlayer.id === 1) state.currPlayer = state.game.playerTwo;
      else state.currPlayer = state.game.playerOne; 
    },
    setMatrix(state, {cellX, cellY}) {
      state.game.board.matrix[cellX][cellY].pickedById = state.currPlayer.id
      
    },
    setGame(state, {playerOne, playerTwo, board}) {
      state.game.board.rows = board.rows
      state.game.board.columns = board.columns
      state.game.board.numOfConnectionToWin = board.numOfConnectionToWin
      state.game.playerOne = playerOne
      state.game.playerTwo = playerTwo
    },
    setDefaultGame(state) {
      state.currPlayer = {};
      state.game.board.matrix = [];

    }
  },
  actions: {
    createBoard(context) {
      let b = context.state.game.board
      for (var i = 0; i < b.rows; i++) {
        b.matrix[i] = []
        for (var j = 0; j < b.columns; j++) {
          b.matrix[i][j] = {x: i, y: j, pickedById: null}
        }
      }
    },
    advanceTurn(context) {
      context.commit('setCurrPlayer')
    },
    updateMatrix(context, payload) {
      context.commit('setMatrix', payload)
    },
    initGame(context, payload) {
      context.commit('setGame', payload.game)
    },
    gameDefaults(context) {
      context.commit('setDefaultGame')
    }
  }
})
