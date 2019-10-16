<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <h1>Servers</h1>
      <div class="mb-2 text-right">
        <router-link
          to="/servers/create"
          class="btn btn-outline-primary"
        >
          <fa :icon="['fas', 'plus']" />
          Create
        </router-link>
      </div>
    </div>

    <loader v-if="loading" />
    <error :message="error" />

    <div v-if="servers && servers.length > 0">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>Server</th>
            <th class="desktop-only">
              Username
            </th>
            <th class="desktop-only">
              Hostname
            </th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="server in servers"
            :key="server.uuid"
          >
            <td>
              <router-link :to="`/servers/${server.uuid}`">
                {{ server.name }}
              </router-link>
            </td>
            <td class="desktop-only">
              {{ server.username }}
            </td>
            <td class="desktop-only">
              {{ server.hostname }}
            </td>
            <td class="text-right">
              <b-dropdown
                text="Actions"
                right
                variant="link"
                no-caret
              >
                <template v-slot:button-content>
                  <fa :icon="['fas', 'ellipsis-v']" />
                </template>
                <b-dropdown-item @click="viewDetail(server)">
                  <fa :icon="['far', 'file-alt']" />
                  View detail
                </b-dropdown-item>
                <b-dropdown-divider />
                <b-dropdown-item
                  class="dropdown-item-danger"
                  @click="remove(server)"
                >
                  <fa :icon="['far', 'trash-alt']" />
                  Remove
                </b-dropdown-item>
              </b-dropdown>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <b-alert
      :show="servers && servers.length === 0"
      variant="light"
    >
      There are no servers, you can
      <router-link to="/servers/create">
        create
      </router-link>
      a new one.
    </b-alert>
  </div>
</template>

<script>
import { getServers, deleteServer } from '../api'

export default {
  name: 'ServerList',

  data() {
    return {
      loading: false,
      servers: null,
      error: null
    }
  },

  watch: {
    '$route': 'fetchData'
  },

  created() {
    this.fetchData()
  },

  methods: {
    fetchData() {
      this.error = this.servers = null
      this.loading = true

      getServers()
        .then(response => this.servers = response.data)
        .catch(error => this.error = error)
        .finally(() => this.loading = false)
    },


    viewDetail(server) {
      this.$router.replace(`/servers/${server.uuid}`)
    },

    remove(server) {
      if (window.confirm(`Are you sure you want to delete ${server.name}?`)) {
        deleteServer(server)
          .then(() => this.fetchData())
          .catch(() => this.error = `Unable to delete ${server.name}`)
      }
    }
  }
}
</script>