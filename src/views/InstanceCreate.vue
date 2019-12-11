<template>
  <div class="detail-page">
    <detail-header
      v-if="ready"
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
      :no-loading="ready"
    />

    <InstanceForm
      v-if="ready"
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
import api from '../api'
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

  computed: {
    ready() {
      return !!(this.servers && this.applications)
    }
  },

  watch: {
    '$route': 'fetchData'
  },

  created() {
    this.fetchData()
  },

  methods: {
    async fetchData() {
      try {
        this.status.setPending()

        const requests = [
          api.servers.getServers(),
          api.applications.getApplications()
        ]
        const [servers, applications] = await axios.all(requests)
        this.servers = servers.data
        this.applications = applications.data
        this.status.setDone()
      } catch (error) {
        this.status.setError('Unable to load applications and/or servers data.')
      }
    }
  },

  async submit() {
    try {
      this.status.setPending()
      const response = await api.instances.postInstance(this.data)
      await this.$router.replace(`/instances/${response.data.uuid}`)
    } catch (error) {
      this.status.setError('Unable to create a new application.')
    }
  }
}
</script>
