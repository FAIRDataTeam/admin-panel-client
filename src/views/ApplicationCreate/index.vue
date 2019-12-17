<template>
  <div class="detail-page">
    <detail-header title="Create Application">
      <button
        class="btn btn-outline-primary"
        :disabled="status.isPending()"
        @click="$refs.form.submit()"
      >
        <fa :icon="['far', 'save']" />
        Save
      </button>
    </detail-header>

    <status-flash
      :status="status"
      no-loading
    />

    <application-form
      ref="form"
      :data="data"
      :editing="true"
      :on-submit="submit"
    />
  </div>
</template>

<script>
import api from '../../api'
import ApplicationForm from '../../components/ApplicationForm'
import DetailHeader from '../../components/DetailHeader'
import Status from '../../utils/Status'

export default {
  name: 'ApplicationDetail',

  components: {
    ApplicationForm,
    DetailHeader,
  },

  data() {
    return {
      data: {
        name: '',
        formSpec: '',
        deployCommand: '',
        disposeCommand: '',
        pauseCommand: '',
        templates: [],
      },
      status: new Status(),
    }
  },

  methods: {
    async submit() {
      try {
        this.status.setPending()
        const response = await api.applications.postApplication(this.data)
        await this.$router.replace(`/applications/${response.data.uuid}`)
      } catch (error) {
        this.status.setError('Unable to create a new application.')
      }
    },
  },
}
</script>
