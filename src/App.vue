<template>
  <div id="app">
    <b-navbar
      toggleable="md"
      type="dark"
      variant="primary"
      fixed="top"
    >
      <b-container>
        <router-link
          class="navbar-brand"
          to="/instances"
        >
          FDP Admin Panel
        </router-link>
        <b-navbar-toggle target="nav-collapse" />

        <b-collapse
          id="nav-collapse"
          is-nav
        >
          <b-navbar-nav v-if="authenticated">
            <b-nav-item>
              <router-link
                class="nav-link"
                to="/instances"
              >
                Instances
              </router-link>
            </b-nav-item>
            <b-nav-item>
              <router-link
                class="nav-link"
                to="/servers"
              >
                Servers
              </router-link>
            </b-nav-item>
            <b-nav-item>
              <router-link
                class="nav-link"
                to="/applications"
              >
                Applications
              </router-link>
            </b-nav-item>
            <b-nav-item>
              <router-link
                class="nav-link"
                to="/users"
              >
                Users
              </router-link>
            </b-nav-item>
          </b-navbar-nav>

          <b-navbar-nav
            v-if="authenticated"
            class="ml-auto"
          >
            <b-nav-item class="nav-item">
              <a
                class="nav-link"
                @click="logout()"
              >
                <fa :icon="['fas', 'sign-out-alt']" />
                Logout
              </a>
            </b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-container>
    </b-navbar>

    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'App',

  computed: {
    ...mapGetters('auth', {
      authenticated: 'authenticated'
    })
  },

  mounted() {
    if (!this.authenticated && this.$router.currentRoute.name !== 'login') {
      this.$router.replace('login')
    }

    if (this.authenticated && this.$router.currentRoute.name === 'login') {
      this.$router.replace('/instances')
    }
  },

  methods: {
    logout() {
      this.$store.dispatch('auth/logout')
      this.$router.push('/login')
    }
  }
}
</script>

<style>
#app {
  padding-top: 80px;
}
</style>
