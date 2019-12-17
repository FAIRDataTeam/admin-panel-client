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
    </fieldset>

    <fieldset>
      <legend>Variables</legend>

      <div class="form-group">
        <label>Form Spec</label>
        <prism-editor
          v-model="$v.data.formSpec.$model"
          language="json"
          :readonly="!editing"
          :class="{'is-invalid': $v.data.formSpec.$error}"
        />
        <p
          v-if="!$v.data.formSpec.required"
          class="invalid-feedback"
        >
          Field is required
        </p>
        <p
          v-else-if="!$v.data.formSpec.isJson"
          class="invalid-feedback"
        >
          This is not a valid JSON
        </p>
      </div>
    </fieldset>

    <fieldset>
      <legend>Commands</legend>

      <div class="form-group">
        <label>Deploy</label>
        <input
          v-model.trim="$v.data.deployCommand.$model"
          :class="{'is-invalid': $v.data.deployCommand.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
          :readonly="!editing"
        >
        <p
          v-if="!$v.data.deployCommand.required"
          class="invalid-feedback"
        >
          Field is required
        </p>
      </div>

      <div class="form-group">
        <label>Dispose</label>
        <input
          v-model.trim="$v.data.disposeCommand.$model"
          :class="{'is-invalid': $v.data.disposeCommand.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
          :readonly="!editing"
        >
        <p
          v-if="!$v.data.disposeCommand.required"
          class="invalid-feedback"
        >
          Field is required
        </p>
      </div>

      <div class="form-group">
        <label>Pause</label>
        <input
          v-model.trim="$v.data.pauseCommand.$model"
          :class="{'is-invalid': $v.data.pauseCommand.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
          :readonly="!editing"
        >
        <p
          v-if="!$v.data.pauseCommand.required"
          class="invalid-feedback"
        >
          Field is required
        </p>
      </div>
    </fieldset>

    <fieldset>
      <legend>Files</legend>
      <b-alert
        :show="data.templates.length === 0"
        variant="light"
      >
        There are no file templates.
      </b-alert>
      <div
        v-for="(v, index) in $v.data.templates.$each.$iter"
        :key="index"
        class="file"
      >
        <div class="form-group">
          <div class="file-name">
            <input
              v-model.trim="v.name.$model"
              :class="{'is-invalid':v.name.$error, 'form-control': editing, 'form-control-plaintext form-control-plaintext--bold': !editing}"
              :readonly="!editing"
            >
            <button
              v-if="editing"
              class="btn btn-outline-danger"
              tabindex="-1"
              @click.prevent="removeTemplate(index)"
            >
              <fa :icon="['far', 'trash-alt']" />
            </button>
          </div>
          <p
            v-if="!v.name.required"
            class="invalid-feedback"
          >
            File name is required
          </p>
          <p
            v-if="!v.name.isUnique"
            class="invalid-feedback"
          >
            File name must be unique
          </p>
        </div>

        <div class="form-group">
          <prism-editor
            v-model="v.content.$model"
            :language="detectLanguage(v.name.$model)"
            :readonly="!editing"
          />
        </div>
      </div>

      <div
        v-if="editing"
        class="file-actions"
      >
        <button
          class="btn btn-outline-secondary"
          @click.prevent="addTemplate()"
        >
          <fa :icon="['far', 'file']" />
          Add template
        </button>
      </div>
    </fieldset>
  </form>
</template>
<script>
import _ from 'lodash'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import PrismEditor from 'vue-prism-editor'

export default {
  name: 'ApplicationForm',

  components: {
    PrismEditor
  },
  mixins: [
    validationMixin,
  ],

  props: {
    data: {
      type: Object,
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

  validations() {
    return {
      data: {
        name: { required },
        deployCommand: { required },
        disposeCommand: { required },
        pauseCommand: { required },
        formSpec: {
          required,
          isJson(value) {
            try {
              JSON.parse(value)
              return true
            } catch (e) {
              return false
            }
          }
        },
        templates: {
          $each: {
            name: {
              required,
              isUnique(value) {
                return this.data.templates.filter(t => t.name === value).length === 1
              }
            },
            content: {}
          }
        }
      }
    }
  },
  methods: {
    addTemplate() {
      this.data.templates.push({
        name: 'file',
        content: ''
      })
    },

    removeTemplate(index) {
      if (window.confirm(`Are you sure you want to remove ${this.data.templates[index].name}?`)) {
        this.data.templates.splice(index, 1)
      }
    },

    detectLanguage(filename) {
      if (filename.indexOf('.') > -1) {
        const extension = _.last(filename.split('.'))
        if (extension === 'sh') return 'shell'
        return extension
      }
      return null
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