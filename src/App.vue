<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <div class="container">
        <router-link class="navbar-brand" to="/instances">FDP Admin Panel</router-link>
        <ul class="navbar-nav mr-auto ml-5" v-if="authenticated">
          <li class="nav-item">
            <router-link class="nav-link" to="/instances">Instances</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/servers">Servers</router-link>
          </li>
        </ul>
        <ul class="navbar-nav" v-if="authenticated">
          <li class="nav-item">
            <router-link class="nav-link" to="/login" v-on:click.native="logout()">Logout</router-link>
          </li>
        </ul>
      </div>
    </nav>

    <div class="container">
      <router-view @authenticated="setAuthenticated"></router-view>
    </div>
  </div>
</template>

<script>
import { getUserToken, setUserToken, clearUserToken } from './localStorage'

export default {
  name: 'app',

  data() {
    return {
      authenticated: false
    }
  },

  mounted() {
    this.authenticated = getUserToken() !== null

    if (!this.authenticated && this.$router.currentRoute.name !== 'login') {
      this.$router.replace('login')
    }

    if (this.authenticated && this.$router.currentRoute.name === 'login') {
      this.$router.replace('/instances')
    }
  },

  methods: {
    setAuthenticated(data) {
      setUserToken(data.token)
      this.authenticated = true
      this.$router.replace('/instances')
    },

    logout() {
      clearUserToken()
      this.authenticated = false
    }
  }
}
</script>

<style>
#app {
  padding-top: 80px;
}
</style>
