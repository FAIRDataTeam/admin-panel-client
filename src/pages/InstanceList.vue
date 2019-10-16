<template>
  <div id="instances">
    <div class="d-flex justify-content-between align-items-center">
      <h1>Instances</h1>
      <div class="mb-2 text-right">
        <router-link
          to="/instances/create"
          class="btn btn-outline-primary"
        >
          <fa :icon="['fas', 'plus']" />
          Create
        </router-link>
      </div>
    </div>

    <loader v-if="loading" />
    <error :message="error" />

    <div v-if="instances && instances.length > 0">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>Instance</th>
            <th>URL</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="instance in instances"
            :key="instance.uuid"
          >
            <td>
              <router-link :to="`/instances/${instance.uuid}`">
                {{ instance.name }}
              </router-link>
            </td>
            <td>
              <a
                class="link-muted"
                :href="instance.url"
                target="_blank"
              >{{ instance.url }}</a>
            </td>
            <td>
              <span
                v-if="instance.status === 'RUNNING'"
                class="badge badge-pill badge-success"
              >
                {{ instance.status }}
              </span>
              <span
                v-if="instance.status === 'ERROR'"
                class="badge badge-pill badge-danger"
              >
                {{ instance.status }}
              </span>
              <span
                v-if="instance.status === 'NOT_DEPLOYED'"
                class="badge badge-pill badge-secondary"
              >
                NOT DEPLOYED
              </span>
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
                <b-dropdown-item @click="viewDetail(instance)">
                  <fa :icon="['far', 'file-alt']" />
                  View detail
                </b-dropdown-item>
                <b-dropdown-item @click="makeCopy(instance)">
                  <fa :icon="['far', 'copy']" />
                  Make a copy
                </b-dropdown-item>
                <b-dropdown-divider />
                <b-dropdown-item
                  class="dropdown-item-danger"
                  @click="remove(instance)"
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
      :show="instances && instances.length === 0"
      variant="light"
    >
      There are no instances, you can
      <router-link to="/instances/create">
        create
      </router-link>
      a new one.
    </b-alert>
  </div>
</template>

<script>
import _ from 'lodash'
import { getInstances, deleteInstance, cloneInstance } from '../api'

export default {
  name: 'InstanceList',

  data() {
    return {
      loading: false,
      instances: null,
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
      this.error = this.instances = null
      this.loading = true

      getInstances()
        .then(response => this.instances = _.orderBy(response.data, 'name'))
        .catch(error => this.error = error)
        .finally(() => this.loading = false)
    },

    viewDetail(instance) {
      this.$router.replace(`/instances/${instance.uuid}`)
    },

    makeCopy(instance) {
      cloneInstance(instance)
        .then(() => this.fetchData())
        .catch(() => this.error = 'Unable to make a copy.')
    },

    remove(instance) {
      if (window.confirm(`Are you sure you want to delete ${instance.name}?`)) {
        deleteInstance(instance)
          .then(() => this.fetchData())
          .catch(() => this.error = `Unable to delete ${instance.name}`)
      }
    }
  }
}
</script>
