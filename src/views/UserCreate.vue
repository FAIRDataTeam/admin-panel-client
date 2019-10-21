<template>
  <div class="detail-page">
    <detail-header title="Create User">
      <button
        class="btn btn-outline-primary"
        :disabled="status.isPending()"
        @click="submit"
      >
        <fa :icon="['far', 'save']" />
        Save
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
            v-model.trim="$v.user.name.$model"
            class="form-control"
            :class="{'is-invalid': $v.user.name.$error}"
          >
          <p
            v-if="!$v.user.name.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>

        <div class="form-group">
          <label>Email</label>
          <input
            v-model.trim="$v.user.email.$model"
            class="form-control"
            :class="{'is-invalid': $v.user.email.$error}"
          >
          <p
            v-if="!$v.user.email.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
          <p
            v-if="!$v.user.email.email"
            class="invalid-feedback"
          >
            This is not a valid email
          </p>
        </div>
      </fieldset>

      <fieldset>
        <legend>Password</legend>

        <div class="form-group">
          <label>Password</label>
          <input
            v-model.trim="$v.user.password.$model"
            class="form-control"
            :class="{'is-invalid': $v.user.password.$error}"
            type="password"
          >
          <p
            v-if="!$v.user.password.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>

        <div class="form-group">
          <label>Password confirmation</label>
          <input
            v-model.trim="$v.user.passwordCheck.$model"
            class="form-control"
            :class="{'is-invalid': $v.user.passwordCheck.$error}"
            type="password"
          >
          <p
            v-if="!$v.user.passwordCheck.passwordMatch"
            class="invalid-feedback"
          >
            Passwords don't match.
          </p>
        </div>
      </fieldset>
    </form>
  </div>
</template>
<script>
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/src/validators'
import { postUser } from '../api'
import DetailHeader from '../components/detail/DetailHeader'
import Status from '../utils/Status'

export default {
  name: 'UserCreate',

  components: {
    DetailHeader
  },

  mixins: [ validationMixin ],

  validations() {
    return {
      user: {
        name: { required },
        email: { required, email },
        password: { required },
        passwordCheck: {
          passwordMatch(value) {
            return this.user.password === value
          }
        }
      }
    }
  },

  data() {
    return {
      user: {
        name: '',
        email: '',
        password: '',
        passwordCheck: ''
      },
      status: new Status()
    }
  },

  methods: {
    submit() {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        this.status.setPending()
        postUser(this.user)
          .then(response => this.$router.replace(`/users/${response.data.uuid}`))
          .catch(() => this.status.setError('Unable to create a new user.'))
      }
    }
  }
}
</script>