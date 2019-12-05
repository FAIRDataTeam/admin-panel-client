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
        :disabled="anyPending()"
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
        :disabled="anyPending()"
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
        :disabled="anyPending()"
        @click="edit"
      >
        <template v-slot:button-content>
          <fa :icon="['fas', 'pen']" />
          <span class="desktop-only">
            Edit
          </span>
        </template>
        <b-dropdown-item
          :disabled="anyPending()"
          @click="makeCopy"
        >
          <fa :icon="['far', 'copy']" />
          Make a copy
        </b-dropdown-item>
        <b-dropdown-divider />
        <b-dropdown-item
          :disabled="anyPending()"
          class="dropdown-item-danger"
          @click="dispose"
        >
          <fa :icon="['fas', 'power-off']" />
          Dispose
        </b-dropdown-item>
        <b-dropdown-item
          :disabled="anyPending()"
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

import {
  getInstance,
  putInstance,
  deployInstance,
  deleteInstance,
  cloneInstance,
  getServers,
  getApplications, disposeInstance
} from '../api'
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

  methods: {
    getData: getInstance,
    putData: putInstance,
    deleteData: deleteInstance,
    cloneData: cloneInstance,
    removeRedirectLocation: () => '/instances',
    cloneRedirectLocation: id => `/instances/${id}`,

    fetchData() {
      this.status.setPending()

      const promises = [
        getInstance(this.$route.params.id),
        getServers(),
        getApplications()
      ]

      axios.all(promises)
        .then(([data, servers, applications]) => {
          this.data = data.data
          this.dataName = this.data.name
          this.servers = servers.data
          this.applications = applications.data
          this.status.setDone()
        })
        .catch(error => this.status.setError(error.toString()))
    },

    submit() {
      this.status.setPending()
      this.putData(this.data)
        .then(() => {
          this.status.setDone()
          this.editing = false
          this.dataName = this.data.name
        })
        .catch(() => this.status.setError(`Unable to save ${this.dataName}.`))
    },

    anyPending() {
      return this.status.isPending() || this.deployStatus.isPending()
    },

    deploy() {
      this.deployStatus.setPending()
      this.status.setPending()

      deployInstance(this.data)
        .then(() => this.status.setDone('Instance was successfully deployed.'))
        .catch(() => this.status.setError('Deploy failed.'))
        .finally(() => this.deployStatus.setDone())

    },

    dispose() {
      if (window.confirm(`Are you sure you want to dispose ${this.data.name}? (This will stop the running data and remove it from the server)`)) {
        this.status.setPending()

        disposeInstance(this.data)
          .then(() => this.status.setDone('Instance was successfully disposed.'))
          .catch(() => this.status.setError('Dispose failed.'))
      }
    }
  }
}
</script>
