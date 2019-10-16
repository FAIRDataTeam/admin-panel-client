<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <div class="container">
        <router-link
          class="navbar-brand"
          to="/instances"
        >
          FDP Admin Panel
        </router-link>
        <ul
          v-if="authenticated"
          class="navbar-nav mr-auto ml-5"
        >
          <li class="nav-item">
            <router-link
              class="nav-link"
              to="/instances"
            >
              Instances
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link"
              to="/servers"
            >
              Servers
            </router-link>
          </li>
        </ul>
        <ul
          v-if="authenticated"
          class="navbar-nav"
        >
          <li class="nav-item">
            <router-link
              class="nav-link"
              to="/login"
              @click.native="logout()"
            >
              Logout
            </router-link>
          </li>
        </ul>
      </div>
    </nav>

    <div class="container">
      <router-view @authenticated="setAuthenticated" />
    </div>
  </div>
</template>

<script>
import { getUserToken, setUserToken, clearUserToken } from './localStorage'

export default {
  name: 'App',

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
