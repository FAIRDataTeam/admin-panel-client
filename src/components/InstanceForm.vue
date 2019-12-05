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
        <label>URL</label>
        <input
          v-model.trim="$v.data.url.$model"
          :class="{'is-invalid': $v.data.url.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
          :readonly="!editing"
        >
        <p
          v-if="!$v.data.url.required"
          class="invalid-feedback"
        >
          Field is required
        </p>
        <p
          v-else-if="!$v.data.url.url"
          class="invalid-feedback"
        >
          This is not a valid URL.
        </p>
      </div>

      <div class="form-group">
        <label>Application Template</label>
        <select
          v-model="$v.data.applicationUuid.$model"
          :class="{'is-invalid': $v.data.applicationUuid.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
          :disabled="!editing"
          @change="sanitizeData"
        >
          <option
            v-for="application in applications"
            :key="application.uuid"
            :value="application.uuid"
          >
            {{ application.name }}
          </option>
        </select>
        <p
          v-if="!$v.data.url.required"
          class="invalid-feedback"
        >
          Field is required
        </p>
      </div>

      <div class="form-group">
        <label>Server</label>
        <select
          v-model="$v.data.serverUuid.$model"
          :class="{'is-invalid': $v.data.serverUuid.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
          :disabled="!editing"
        >
          <option
            v-for="server in servers"
            :key="server.uuid"
            :value="server.uuid"
          >
            {{ server.name }}
          </option>
        </select>
        <p
          v-if="!$v.data.url.required"
          class="invalid-feedback"
        >
          Field is required
        </p>
      </div>

      <div class="form-group">
        <label>Path</label>
        <input
          v-model.trim="$v.data.path.$model"
          :class="{'is-invalid': $v.data.path.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
          :readonly="!editing"
        >
        <p
          v-if="!$v.data.path.required"
          class="invalid-feedback"
        >
          Field is required
        </p>
      </div>
    </fieldset>

    <fieldset
      v-for="section in selectedSpecSections"
      :key="section.title"
    >
      <legend>{{ section.title }}</legend>

      <div
        v-for="field in section.fields.filter(isVisible)"
        :key="field.key"
        class="form-group"
      >
        <label>{{ field.label }}</label>
        <template v-if="field.type === 'string'">
          <input
            v-model.trim="$v.data.variables[field.key].$model"
            :class="{'is-invalid': $v.data.variables[field.key].$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
        </template>
        <template v-else-if="field.type === 'code'">
          <prism-editor
            v-model="$v.data.variables[field.key].$model"
            :language="field.language"
            :readonly="!editing"
            :class="{'is-invalid': $v.data.variables[field.key].$error}"
          />
        </template>
        <template v-else-if="field.type === 'options'">
          <select
            v-model="$v.data.variables[field.key].$model"
            :class="{'is-invalid': $v.data.variables[field.key].$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :disabled="!editing"
          >
            <option
              v-for="option in field.options"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </template>
        <p
          v-if="field.required && !$v.data.variables[field.key].required"
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
import { required, url } from 'vuelidate/lib/validators'
import PrismEditor from 'vue-prism-editor'

export default {
  name: 'InstanceForm',

  components: {
    PrismEditor
  },

  mixins: [
    validationMixin
  ],

  props: {
    data: {
      type: Object,
      required: true
    },
    applications: {
      type: Array,
      required: true
    },
    servers: {
      type: Array,
      required: true
    },
    editing: {
      type: Boolean,
      default: true
    },
    onSubmit: {
      type: Function,
      required: true
    }
  },

  computed: {
    selectedSpecSections() {
      try {
        const selectedApplication = this.applications.filter(a => a.uuid === this.data.applicationUuid)
        const spec = JSON.parse(selectedApplication[0].formSpec)
        return spec.sections || []
      } catch (e) {
        return []
      }
    },
    selectedSpecFields() {
      return this.selectedSpecSections.flatMap(section => section.fields)
    }
  },

  created() {
    this.sanitizeData()
  },

  validations() {
    const variableValidation = (field) => {
      if (field.required && this.isVisible(field)) {
        return { required }
      }
      return {}
    }

    const variables = this.selectedSpecFields.reduce((acc, field) => {
      return { ...acc, [field.key]: variableValidation(field) }
    }, {})

    return {
      data: {
        name: { required },
        url: { required, url },
        path: { required },
        applicationUuid: { required },
        serverUuid: { required },
        variables
      }
    }
  },

  methods: {
    isVisible(field) {
      return !field.if || this.data.variables[field.if.field] === field.if.value
    },

    sanitizeData() {
      this.data.variables = this.selectedSpecFields.reduce((acc, field) => {
        if (!(field.key in acc)) {
          return { ...acc, [field.key]: null }
        }
        return acc
      }, this.data.variables)
    },

    submit() {
      this.$v.data.$touch()

      if (!this.$v.data.$invalid) {
        this.onSubmit()
      }
    }
  }

}
</script>