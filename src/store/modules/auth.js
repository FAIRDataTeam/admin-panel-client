import localStorage from '../../utils/localStorage'
import Status from '../../utils/Status'
import api from '../../api'

export default {
  namespaced: true,

  state: {
    token: localStorage.getUserToken(),
    loginStatus: new Status(),
  },

  getters: {
    authenticated: state => state.token !== null,
    token: state => state.token
  },

  actions: {
    async authenticate({ commit }, { email, password, successCallback }) {
      try {
        commit('setLoginStatus', { status: Status.PENDING })
        const response = await api.tokens.fetchToken(email, password)
        commit('setLoginStatus', { status: Status.DEFAULT })
        const token = response.data.token
        commit('setToken', token)
        localStorage.setUserToken(token)
        successCallback()
      } catch (error) {
        commit('setToken', null)
        commit('setLoginStatus', { status: Status.ERROR, msg: 'Login failed' })
      }
    },

    logout({ commit }) {
      localStorage.clearUserToken()
      commit('setToken', null)
    }
  },

  mutations: {
    setToken(state, token) {
      state.token = token
    },
    setLoginStatus(state, { status, msg }) {
      state.loginStatus.setStatus(status, msg)
    }
  }
}