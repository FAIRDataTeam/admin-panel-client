<template>
  <div class="detail-page">
    <detail-header title="Create Server">
      <button
        class="btn btn-outline-primary"
        :disabled="status.isPending()"
        @click="submit"
      >
        <fa :icon="['far', 'save']" />
        <span class="desktop-only">
          Save
        </span>
      </button>
    </detail-header>

    <status-flash
      :status="status"
      no-loading
    />

    <server-form
      :data="data"
      :editing="true"
      :on-submit="submit"
    />
  </div>
</template>

<script>
import api from '../../api'
import DetailHeader from '../../components/DetailHeader'
import ServerForm from '../../components/ServerForm'
import Status from '../../utils/Status'

export default {
  name: 'ServerCreate',

  components: {
    ServerForm,
    DetailHeader,
  },

  data() {
    return {
      data: {
        name: '',
        hostname: '',
        username: '',
        privateKey: '',
        publicKey: '',
      },
      status: new Status(),
    }
  },

  methods: {
    async submit() {
      try {
        this.status.setPending()
        const response = await api.servers.postServer(this.data)
        await this.$router.replace(`/servers/${response.data.uuid}`)
      } catch (error) {
        this.status.setError('Unable to create a new server.')
      }
    },
  },
}
</script>
