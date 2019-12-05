<template>
  <div class="detail-page">
    <detail-header
      v-if="ready()"
      title="Create Instance"
    >
      <button
        class="btn btn-outline-primary"
        :disabled="status.isPending()"
        @click="$refs.form.submit()"
      >
        <fa :icon="['far', 'save']" />
        <span class="desktop-only">
          Save
        </span>
      </button>
    </detail-header>

    <status-flash
      :status="status"
      :no-loading="ready()"
    />

    <InstanceForm
      v-if="ready()"
      ref="form"
      :data="data"
      :applications="applications"
      :servers="servers"
      :on-submit="submit"
    />
  </div>
</template>

<script>
import axios from 'axios'
import DetailHeader from '../components/detail/DetailHeader'

import { postInstance, getApplications, getServers } from '../api'
import InstanceForm from '../components/InstanceForm'
import Status from '../utils/Status'

export default {
  name: 'Instance',

  components: {
    InstanceForm,
    DetailHeader,
  },

  data() {
    return {
      servers: null,
      applications: null,
      status: new Status(),
      data: {
        name: '',
        url: '',
        path: '',
        applicationUuid: '',
        serverUuid: '',
        variables: {}
      }
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
      this.status.setPending()

      const promises = [
        getServers(),
        getApplications()
      ]

      axios.all(promises)
        .then(([servers, applications]) => {
          this.servers = servers.data
          this.applications = applications.data
          this.status.setDone()
        })
        .catch(() => this.status.setError('Unable to load applications and/or servers data.'))
    },

    ready() {
      return !!(this.servers && this.applications)
    },

    submit() {
      this.status.setPending()

      postInstance(this.data)
        .then(response => this.$router.replace(`/instances/${response.data.uuid}`))
        .catch(() => this.status.setError('Unable to create a new application'))
    }
  }
}
</script>
