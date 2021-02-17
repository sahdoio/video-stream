import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    socket: null
  },
  actions: {
    assignSocket: (context, payload) => {
      context.commit('ASSIGN_SOCKET', payload)
    }
  },
  getters: {
    getSocket: state => state.socket
  },
  mutations: {
    ASSIGN_SOCKET: (state, payload) => {
      state.socket = payload
    }
  }
});