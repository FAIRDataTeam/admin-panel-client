<template>
    <div id="server">
        <div v-if="error" class="alert alert-danger">{{ error }}</div>

        <div>
            <h1>Create Server</h1>

            <div>
                <form @submit.prevent="submit">
                <div class="form-group">
                    <label>Name</label>
                    <input class="form-control" v-model.trim="$v.server.name.$model" v-bind:class="{'is-invalid': $v.server.name.$error}">
                    <p class="invalid-feedback" v-if="!$v.server.name.required">Field is required</p>
                </div>

                <div class="form-group">
                    <label>Hostname</label>
                    <input class="form-control" v-model.trim="$v.server.hostname.$model" v-bind:class="{'is-invalid': $v.server.hostname.$error}">
                    <p class="invalid-feedback" v-if="!$v.server.hostname.required">Field is required</p>
                </div>

                <div class="form-group">
                    <label>Username</label>
                    <input class="form-control" v-model.trim="$v.server.username.$model" v-bind:class="{'is-invalid': $v.server.username.$error}">
                    <p class="invalid-feedback" v-if="!$v.server.username.required">Field is required</p>
                </div>

                <div class="form-group">
                    <label>Private Key</label>
                    <textarea class="form-control" rows="10" v-model.trim="$v.server.privateKey.$model" v-bind:class="{'is-invalid': $v.server.privateKey.$error}"></textarea>
                    <p class="invalid-feedback" v-if="!$v.server.privateKey.required">Field is required</p>
                </div>

                <div class="form-group">
                    <label>Public Key</label>
                    <textarea class="form-control" rows="5" v-model.trim="$v.server.publicKey.$model" v-bind:class="{'is-invalid': $v.server.publicKey.$error}"></textarea>
                    <p class="invalid-feedback" v-if="!$v.server.publicKey.required">Field is required</p>
                </div>

                <div class="text-right">
                    <button type="submit" class="btn btn-primary" :disabled="submitStatus === 'PENDING'">Save</button>
                </div>

                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

import { postServer } from '../api'

export default {
  name: 'ServerCreate',

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
          loading: false,
          server: {
              name: '',
              hostname: '',
              username: '',
              privateKey: '',
              publicKey: ''
          },
          error: null,
          submitStatus: null
      }
  },

  methods: {
      submit() {
          this.$v.$touch()

          if (this.$v.$invalid) {
              this.submitStatus = 'INVALID'
          } else {
              this.submitStatus = 'PENDING'

                postServer(this.server)
                    .then(response => this.$router.replace(`/servers/${response.data.uuid}`))
                    .catch(() => this.submitStatus = 'ERROR')
          }
      }
  }
}
</script>

<style scoped>
#server {
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
}
</style>