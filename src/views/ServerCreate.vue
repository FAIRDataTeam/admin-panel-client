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

    <form
      class="form"
      @submit.prevent="submit"
    >
      <fieldset>
        <legend>General</legend>

        <div class="form-group">
          <label>Name</label>
          <input
            v-model.trim="$v.server.name.$model"
            class="form-control"
            :class="{'is-invalid': $v.server.name.$error}"
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
            class="form-control"
            :class="{'is-invalid': $v.server.hostname.$error}"
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
            class="form-control"
            :class="{'is-invalid': $v.server.username.$error}"
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
            class="form-control"
            rows="10"
            :class="{'is-invalid': $v.server.privateKey.$error}"
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
            class="form-control"
            rows="5"
            :class="{'is-invalid': $v.server.publicKey.$error}"
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

import { postServer } from '../api'
import DetailHeader from '../components/detail/DetailHeader'
import Status from '../utils/Status'

export default {
  name: 'ServerCreate',

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
      server: {
        name: '',
        hostname: '',
        username: '',
        privateKey: '',
        publicKey: ''
      },
      status: new Status(),
    }
  },

  methods: {
    submit() {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        this.status.setPending()
        postServer(this.server)
          .then(response => this.$router.replace(`/servers/${response.data.uuid}`))
          .catch(() => this.status.setError('Unable to create a new server.'))
      }
    }
  }
}
</script>
