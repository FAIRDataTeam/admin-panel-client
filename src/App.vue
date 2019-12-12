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
          {{ title }}
        </router-link>
        <b-navbar-toggle target="nav-collapse" />

        <b-collapse
          id="nav-collapse"
          is-nav
        >
          <b-navbar-nav v-if="authenticated">
            <b-nav-item to="/instances">
              Instances
            </b-nav-item>
            <b-nav-item to="/pipelines">
              Pipelines
            </b-nav-item>
            <b-nav-item to="/applications">
              Applications
            </b-nav-item>
            <b-nav-item-dropdown text="More">
              <b-dropdown-item to="/servers">
                Servers
              </b-dropdown-item>
              <b-dropdown-item to="/users">
                Users
              </b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>

          <b-navbar-nav
            v-if="authenticated"
            class="ml-auto"
          >
            <b-nav-item
              class="nav-item"
              @click="logout()"
            >
              <fa :icon="['fas', 'sign-out-alt']" />
              Logout
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

  data() {
    return {
      title: window.config.title
    }
  },

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
