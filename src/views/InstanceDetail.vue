<template>
  <div class="detail-page">
    <detail-header
      v-if="data"
      :title="dataName"
    >
      <instance-status :status="data.status" />
      <button
        v-if="editing"
        class="btn btn-outline-primary"
        :disabled="anyPending"
        @click="$refs.form.submit()"
      >
        <fa :icon="['far', 'save']" />
        <span class="desktop-only">
          Save
        </span>
      </button>
      <button
        v-if="editing"
        class="btn btn-outline-secondary"
        :disabled="status.isPending()"
        @click="cancelEdit"
      >
        <fa :icon="['fas', 'ban']" />
        <span class="desktop-only">
          Cancel
        </span>
      </button>

      <button
        v-if="!editing"
        class="btn btn-outline-primary"
        :disabled="anyPending"
        @click="deploy"
      >
        <fa
          v-if="deployStatus.isPending()"
          :icon="['fas', 'sync-alt']"
          spin
        />
        <fa
          v-else
          :icon="['fas', 'play']"
        />
        <span class="desktop-only">
          Deploy
        </span>
      </button>

      <b-dropdown
        v-if="!editing"
        split
        right
        variant="outline-secondary"
        :disabled="anyPending"
        @click="edit"
      >
        <template v-slot:button-content>
          <fa :icon="['fas', 'pen']" />
          <span class="desktop-only">
            Edit
          </span>
        </template>
        <b-dropdown-item
          :disabled="anyPending"
          @click="makeCopy"
        >
          <fa :icon="['far', 'copy']" />
          Make a copy
        </b-dropdown-item>
        <b-dropdown-divider />
        <b-dropdown-item
          :disabled="anyPending"
          class="dropdown-item-danger"
          @click="dispose"
        >
          <fa :icon="['fas', 'power-off']" />
          Dispose
        </b-dropdown-item>
        <b-dropdown-item
          :disabled="anyPending"
          class="dropdown-item-danger"
          @click="remove"
        >
          <fa :icon="['far', 'trash-alt']" />
          Remove
        </b-dropdown-item>
      </b-dropdown>
    </detail-header>

    <status-flash
      :status="status"
      :no-loading="data !== null"
    />
    <status-flash
      :status="deployStatus"
      no-loading
    />

    <InstanceForm
      v-if="data"
      ref="form"
      :data="data"
      :applications="applications"
      :servers="servers"
      :editing="editing"
      :on-submit="submit"
    />
  </div>
</template>

<script>
import axios from 'axios'
import DetailHeader from '../components/detail/DetailHeader'

import api from '../api'
import InstanceForm from '../components/InstanceForm'
import InstanceStatus from '../components/InstanceStatus'
import cloneData from '../mixins/detail/cloneData'
import editableData from '../mixins/detail/editableData'
import fetchData from '../mixins/detail/fetchData'
import removeData from '../mixins/detail/removeData'
import Status from '../utils/Status'

export default {
  name: 'InstanceDetail',

  components: {
    InstanceStatus,
    InstanceForm,
    DetailHeader,
  },

  mixins: [
    fetchData,
    editableData,
    removeData,
    cloneData
  ],

  data() {
    return {
      applications: null,
      servers: null,
      deployStatus: new Status(),
    }
  },

  computed: {
    anyPending() {
      return this.status.isPending() || this.deployStatus.isPending()
    }
  },

  methods: {
    getData: api.instances.getInstance,
    putData: api.instances.putInstance,
    deleteData: api.instances.deleteInstance,
    cloneData: api.instances.cloneInstance,
    removeRedirectLocation: () => '/instances',
    cloneRedirectLocation: id => `/instances/${id}`,

    async fetchData() {
      try {
        this.status.setPending()
        const requests = [
          api.instances.getInstance(this.$route.params.id),
          api.servers.getServers(),
          api.applications.getApplications()
        ]
        const [data, servers, applications] = await axios.all(requests)
        this.data = data.data
        this.dataName = this.data.name
        this.servers = servers.data
        this.applications = applications.data
        this.status.setDone()
      } catch (error) {
        this.status.setError(error.toString())
      }
    },

    async submit() {
      try {
        this.status.setPending()
        await this.putData(this.data)
        this.status.setDone()
        this.editing = false
        this.dataName = this.data.name
      } catch (error) {
        this.status.setError(`Unable to save ${this.dataName}.`)
      }
    },

    async deploy() {
      try {
        this.deployStatus.setPending()
        this.status.setPending()
        await api.instances.deployInstance(this.data)
        this.status.setDone('Instance was successfully deployed.')
      } catch (error) {
        this.status.setError('Deploy failed.')

      }
      this.deployStatus.setDone()
    },

    async dispose() {
      if (window.confirm(`Are you sure you want to dispose ${this.data.name}? (This will stop the running instance and remove it from the server)`)) {
        try {
          this.status.setPending()
          await api.instances.disposeInstance(this.data)
          this.status.setDone('Instance was successfully disposed.')
        } catch (error) {
          this.status.setError('Dispose failed.')
        }
      }
    }
  }
}
</script>
