<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <h1>Applications</h1>
      <div class="mb-2 text-right">
        <router-link
          to="/applications/create"
          class="btn btn-outline-primary"
        >
          <fa :icon="['fas', 'plus']" />
          Create
        </router-link>
      </div>
    </div>

    <loader v-if="loading" />
    <error :message="error" />

    <div v-if="applications && applications.length > 0">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>Application</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="application in applications"
            :key="application.uuid"
          >
            <td>
              <router-link :to="`/applications/${application.uuid}`">
                {{ application.name }}
              </router-link>
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
                <b-dropdown-item @click="viewDetail(application)">
                  <fa :icon="['far', 'file-alt']" />
                  View detail
                </b-dropdown-item>
                <b-dropdown-item @click="makeCopy(application)">
                  <fa :icon="['far', 'copy']" />
                  Make a copy
                </b-dropdown-item>
                <b-dropdown-divider />
                <b-dropdown-item
                  class="dropdown-item-danger"
                  @click="remove(application)"
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
      :show="applications && applications.length === 0"
      variant="light"
    >
      There are no applications, you can
      <router-link to="/applications/create">
        create
      </router-link>
      a new one.
    </b-alert>
  </div>
</template>
<script>
import { cloneApplication, deleteApplication, getApplications } from '../api'

export default {
  name: 'ApplicationList',

  data() {
    return {
      loading: false,
      applications: null,
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
      this.error = this.applications = null
      this.loading = true

      getApplications()
        .then(response => this.applications = response.data)
        .catch(error => this.error = error.toString())
        .finally(() => this.loading = false)
    },


    viewDetail(application) {
      this.$router.replace(`/applications/${application.uuid}`)
    },

    makeCopy(application) {
      cloneApplication(application)
        .then(() => this.fetchData())
        .catch(() => this.error = 'Unable to make a copy.')
    },

    remove(application) {
      if (window.confirm(`Are you sure you want to delete ${application.name}?`)) {
        deleteApplication(application)
          .then(() => this.fetchData())
          .catch(() => this.error = `Unable to delete ${application.name}`)
      }
    }
  }
}
</script>