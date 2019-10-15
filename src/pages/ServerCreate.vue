<template>
    <div class="detail-page">
        <div v-if="error" class="alert alert-danger">{{ error }}</div>

        <detail-header title="Create Server">
            <button class="btn btn-outline-primary" v-on:click="submit" :disabled="submitStatus === 'PENDING'">
                <fa :icon="['far', 'save']" />
                Save
            </button>
        </detail-header>

        <form @submit.prevent="submit" class="form">
            <fieldset>
                <legend>General</legend>

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
            </fieldset>

            <fieldset>
                <legend>SSH Keys</legend>

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
            </fieldset>
        </form>
    </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

import { postServer } from '../api'
import DetailHeader from '../components/DetailHeader'

export default {
  name: 'ServerCreate',

  components: {
      DetailHeader
  },

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
