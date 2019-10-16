<template>
  <div class="detail-page">
    <loader v-if="loading" />

    <detail-header
      v-if="server"
      :title="serverName"
    >
      <button
        v-if="editing"
        class="btn btn-outline-primary"
        :disabled="anyPending()"
        @click="submit"
      >
        <fa :icon="['far', 'save']" />
        Save
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
          Edit
        </template>
        <b-dropdown-item
          :disabled="anyPending()"
          class="dropdown-item-danger"
          @click="serverDelete"
        >
          <fa :icon="['far', 'trash-alt']" />
          Remove
        </b-dropdown-item>
      </b-dropdown>
    </detail-header>

    <error :message="error" />

    <form
      v-if="server"
      class="form"
      @submit.prevent="submit"
    >
      <fieldset>
        <legend>General</legend>

        <div class="form-group">
          <label>Name</label>
          <input
            v-model.trim="$v.server.name.$model"
            :class="{'is-invalid': $v.server.name.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.server.name.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>

        <div class="form-group">
          <label>Hostname</label>
          <input
            v-model.trim="$v.server.hostname.$model"
            :class="{'is-invalid': $v.server.hostname.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.server.hostname.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>

        <div class="form-group">
          <label>Username</label>
          <input
            v-model.trim="$v.server.username.$model"
            :class="{'is-invalid': $v.server.username.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.server.username.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>
      </fieldset>

      <fieldset>
        <legend>SSH Keys</legend>

        <div class="form-group">
          <label>Private Key</label>
          <textarea
            v-model.trim="$v.server.privateKey.$model"
            rows="10"
            :class="{'is-invalid': $v.server.privateKey.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          />
          <p
            v-if="!$v.server.privateKey.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>

        <div class="form-group">
          <label>Public Key</label>
          <textarea
            v-model.trim="$v.server.publicKey.$model"
            rows="5"
            :class="{'is-invalid': $v.server.publicKey.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          />
          <p
            v-if="!$v.server.publicKey.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>
      </fieldset>
    </form>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

import { getServer, putServer, deleteServer } from '../api'
import DetailHeader from '../components/DetailHeader'

export default {
  name: 'ServerDetail',

  components: {
    DetailHeader
  },

  mixins: [ validationMixin ],

  validations() {
    return {
      server: {
        name: { required },
        hostname: { required },
        username: { required },
        privateKey: { required },
        publicKey: { required },
      }
    }
  },

  data() {
    return {
      serverName: 'Server',
      loading: false,
      server: null,
      error: null,
      editing: false,
      submitStatus: null,
      deleteStatus: null
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
      this.error = this.server = null
      this.loading = true

      getServer(this.$route.params.id)
        .then(response => {
          this.server = response.data
          this.serverName = this.server.name
        })
        .catch(error => this.error = error.toString())
        .finally(() => this.loading = false)
    },

    anyPending() {
      return this.submitStatus === 'PENDING' || this.deleteStatus === 'PENDING'
    },

    edit() {
      this.editing = true
    },

    submit() {
      this.$v.$touch()

      if (this.$v.$invalid) {
        this.submitStatus = 'INVALID'
      } else {
        this.submitStatus = 'PENDING'

        putServer(this.server)
          .then(() => {
            this.submitStatus = 'SAVED'
            this.editing = false
            this.serverName = this.server.name
          })
          .catch(() => this.submitStatus = 'ERROR')
      }
    },

    serverDelete() {
      if (window.confirm(`Are you sure you want to delete ${this.server.name}?`)) {
        this.deleteStatus = 'PENDING'

        deleteServer(this.server)
          .then(() => this.$router.replace('/servers'))
          .catch(() => this.deleteStatus = 'ERROR')
      }
    }
  }
}
</script>
