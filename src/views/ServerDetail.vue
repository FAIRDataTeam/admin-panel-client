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

      <b-dropdown
        v-if="!editing"
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
      no-loading
    />

    <form
      v-if="data"
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
          <label>Hostname</label>
          <input
            v-model.trim="$v.data.hostname.$model"
            :class="{'is-invalid': $v.data.hostname.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.data.hostname.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>

        <div class="form-group">
          <label>Username</label>
          <input
            v-model.trim="$v.data.username.$model"
            :class="{'is-invalid': $v.data.username.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.data.username.required"
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
            v-model.trim="$v.data.privateKey.$model"
            rows="10"
            :class="{'is-invalid': $v.data.privateKey.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          />
          <p
            v-if="!$v.data.privateKey.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>

        <div class="form-group">
          <label>Public Key</label>
          <textarea
            v-model.trim="$v.data.publicKey.$model"
            rows="5"
            :class="{'is-invalid': $v.data.publicKey.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          />
          <p
            v-if="!$v.data.publicKey.required"
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
import DetailHeader from '../components/detail/DetailHeader'
import editableData from '../mixins/detail/editableData'
import fetchData from '../mixins/detail/fetchData'
import removeData from '../mixins/detail/removeData'

export default {
  name: 'ServerDetail',
  components: {
    DetailHeader
  },
  mixins: [
    validationMixin,
    fetchData,
    editableData,
    removeData
  ],
  validations() {
    return {
      data: {
        name: { required },
        hostname: { required },
        username: { required },
        privateKey: { required },
        publicKey: { required },
      }
    }
  },
  methods: {
    getData: getServer,
    putData: putServer,
    deleteData: deleteServer,
    redirectLocation: () => '/servers',
  }
}
</script>
