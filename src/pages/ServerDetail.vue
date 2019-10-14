<template>
    <div id="server-detail">
        <div v-if="loading">Loading...</div>

        <div class="header">
            <div v-if="server" class="container d-flex justify-content-between align-items-center">
                <strong>{{ serverName }}</strong>
                <div class="actions">

                <button class="btn btn-outline-primary" v-if="editing" v-on:click="submit" :disabled="anyPending()">
                    <fa :icon="['far', 'save']" />
                    Save
                </button>

                <b-dropdown v-if="!editing" split right variant="outline-secondary" v-on:click="edit" :disabled="anyPending()">
                    <template v-slot:button-content>
                        <fa :icon="['fas', 'pen']" /> Edit
                    </template>
                    <b-dropdown-item v-on:click="serverDelete" :disabled="anyPending()" class="dropdown-item-danger">
                        <fa :icon="['far', 'trash-alt']" /> Remove
                    </b-dropdown-item>
                </b-dropdown>
            </div>
            </div>
        </div>

        <div v-if="error" class="alert alert-danger">{{ error }}</div>

        <div v-if="server">
            <div>
                <form @submit.prevent="submit">
                <div class="form-group">
                    <label>Name</label>
                    <input v-model.trim="$v.server.name.$model" v-bind:class="{'is-invalid': $v.server.name.$error, 'form-control': editing, 'form-control-plaintext': !editing}" :readonly="!editing">
                    <p class="invalid-feedback" v-if="!$v.server.name.required">Field is required</p>
                </div>

                <div class="form-group">
                    <label>Hostname</label>
                    <input v-model.trim="$v.server.hostname.$model" v-bind:class="{'is-invalid': $v.server.hostname.$error, 'form-control': editing, 'form-control-plaintext': !editing}" :readonly="!editing">
                    <p class="invalid-feedback" v-if="!$v.server.hostname.required">Field is required</p>
                </div>

                <div class="form-group">
                    <label>Username</label>
                    <input v-model.trim="$v.server.username.$model" v-bind:class="{'is-invalid': $v.server.username.$error, 'form-control': editing, 'form-control-plaintext': !editing}" :readonly="!editing">
                    <p class="invalid-feedback" v-if="!$v.server.username.required">Field is required</p>
                </div>

                <div class="form-group">
                    <label>Private Key</label>
                    <textarea rows="10" v-model.trim="$v.server.privateKey.$model" v-bind:class="{'is-invalid': $v.server.privateKey.$error, 'form-control': editing, 'form-control-plaintext': !editing}" :readonly="!editing"></textarea>
                    <p class="invalid-feedback" v-if="!$v.server.privateKey.required">Field is required</p>
                </div>

                <div class="form-group">
                    <label>Public Key</label>
                    <textarea rows="5" v-model.trim="$v.server.publicKey.$model" v-bind:class="{'is-invalid': $v.server.publicKey.$error, 'form-control': editing, 'form-control-plaintext': !editing}" :readonly="!editing"></textarea>
                    <p class="invalid-feedback" v-if="!$v.server.publicKey.required">Field is required</p>
                </div>

                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

import { getServer, putServer, deleteServer } from '../api'

export default {
  name: 'ServerDetail',

  mixins: [validationMixin],

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

  created() {
      this.fetchData()
  },

  watch: {
      '$route': 'fetchData'
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
            .catch(error => this.error = error)
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

<style scoped>
#server-detail {
    margin-top: 5rem;
    margin-bottom: 10rem;
}

.actions {
    text-align: right;
}

.actions .btn {
    padding: .375rem 1rem;
    margin-left: 1rem;
}

label {
    font-weight: bold;
}

.form-control-plaintext {
    outline: none;
    padding: 0.375rem 0.75rem;
    background: #f5f2f0;
    font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
}

.header {
    position: fixed;
    left: 0;
    top: 56px;
    right: 0;
    background: white;
    padding: 0.5rem 0;
    border-bottom: 1px solid #ddd;
    z-index: 5;
}

.header .btn-group {
    padding: 0 !important;
}
</style>