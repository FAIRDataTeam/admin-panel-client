<template>
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
          :class="{
            'is-invalid': $v.data.name.$error,
            'form-control': editing,
            'form-control-plaintext': !editing,
          }"
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
          :class="{
            'is-invalid': $v.data.hostname.$error,
            'form-control': editing,
            'form-control-plaintext': !editing,
          }"
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
          :class="{
            'is-invalid': $v.data.username.$error,
            'form-control': editing,
            'form-control-plaintext': !editing,
          }"
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
          :class="{
            'is-invalid': $v.data.privateKey.$error,
            'form-control': editing,
            'form-control-plaintext': !editing,
          }"
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
          :class="{
            'is-invalid': $v.data.publicKey.$error,
            'form-control': editing,
            'form-control-plaintext': !editing,
          }"
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
</template>
<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'ServerForm',

  mixins: [
    validationMixin,
  ],

  props: {
    data: {
      type: Object,
      required: true,
    },
    editing: {
      type: Boolean,
      default: true,
    },
    onSubmit: {
      type: Function,
      required: true,
    },
  },

  validations() {
    return {
      data: {
        name: { required },
        hostname: { required },
        username: { required },
        privateKey: { required },
        publicKey: { required },
      },
    }
  },

  methods: {
    submit() {
      this.$v.data.$touch()

      if (!this.$v.data.$invalid) {
        this.onSubmit()
      }
    },
  },
}
</script>
