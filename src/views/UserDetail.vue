<template>
  <div class="detail-page">
    <detail-header
      v-if="data"
      :title="dataName"
    >
      <button
        v-if="editing"
        class="btn btn-outline-primary"
        :disabled="status.isPending()"
        @click="submit"
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
        v-if="editingPassword"
        class="btn btn-outline-primary"
        :disabled="status.isPending()"
        @click="submitPassword"
      >
        <fa :icon="['far', 'save']" />
        <span class="desktop-only">
          Save
        </span>
      </button>
      <button
        v-if="editingPassword"
        class="btn btn-outline-secondary"
        :disabled="status.isPending()"
        @click="cancelPassword"
      >
        <fa :icon="['fas', 'ban']" />
        <span class="desktop-only">
          Cancel
        </span>
      </button>
      <b-dropdown
        v-if="!editing && !editingPassword"
        split
        right
        variant="outline-secondary"
        :disabled="status.isPending()"
        @click="edit"
      >
        <template v-slot:button-content>
          <fa :icon="['fas', 'pen']" />
          <span class="desktop-only">
            Edit
          </span>
        </template>
        <b-dropdown-item
          :disabled="status.isPending()"
          @click="changePassword"
        >
          <fa :icon="['fas', 'key']" />
          Change password
        </b-dropdown-item>
        <b-dropdown-divider />
        <b-dropdown-item
          :disabled="status.isPending()"
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

    <form
      v-if="data && !editingPassword"
      class="form"
      @submit.prevent="submit"
    >
      <fieldset>
        <legend>General</legend>

        <div class="form-group">
          <label>Name</label>
          <input
            v-model.trim="$v.data.name.$model"
            :class="{'is-invalid': $v.data.name.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.data.name.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>

        <div class="form-group">
          <label>Email</label>
          <input
            v-model.trim="$v.data.email.$model"
            :class="{'is-invalid': $v.data.email.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.data.email.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
          <p
            v-if="!$v.data.email.email"
            class="invalid-feedback"
          >
            This is not a valid email
          </p>
        </div>
      </fieldset>
    </form>

    <form
      v-if="editingPassword"
      class="form"
      @submit.prevent="submitPassword"
    >
      <fieldset>
        <legend>Change Password</legend>

        <div class="form-group">
          <label>New password</label>
          <input
            v-model.trim="$v.passwordForm.password.$model"
            class="form-control"
            :class="{'is-invalid': $v.passwordForm.password.$error}"
            type="password"
          >
          <p
            v-if="!$v.passwordForm.password.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>

        <div class="form-group">
          <label>New password confirmation</label>
          <input
            v-model.trim="$v.passwordForm.passwordCheck.$model"
            class="form-control"
            :class="{'is-invalid': $v.passwordForm.passwordCheck.$error}"
            type="password"
          >
          <p
            v-if="!$v.passwordForm.passwordCheck.passwordMatch"
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
import { required, email } from 'vuelidate/lib/validators'
import { deleteUser, getUser, putUser, putUserPassword } from '../api'
import DetailHeader from '../components/detail/DetailHeader'
import editableData from '../mixins/detail/editableData'
import fetchData from '../mixins/detail/fetchData'
import removeData from '../mixins/detail/removeData'

export default {
  name: 'UserDetail',
  components: {
    DetailHeader
  },
  mixins: [
    fetchData,
    editableData,
    removeData
  ],
  validations() {
    return {
      data: {
        name: { required },
        email: { required, email }
      },
      passwordForm: {
        password: { required },
        passwordCheck: {
          passwordMatch(value) {
            return this.passwordForm.password === value
          }
        }
      }
    }
  },

  data() {
    return {
      editingPassword: false,
      passwordForm: {
        password: null,
        passwordCheck: null
      }
    }
  },

  methods: {
    getData: getUser,
    putData: putUser,
    deleteData: deleteUser,
    redirectLocation: () => '/users',
    changePassword() {
      this.editingPassword = true
    },
    cancelPassword() {
      this.editingPassword = false
    },
    submitPassword() {
      this.$v.passwordForm.$touch()

      if (!this.$v.passwordForm.$invalid) {
        this.status.setPending()
        putUserPassword(this.data, this.passwordForm.password)
          .then(() => {
            this.status.setDone()
            this.editingPassword = false
          })
          .catch(() => this.status.setError('Unable to change password.'))
      }
    }
  }
}
</script>