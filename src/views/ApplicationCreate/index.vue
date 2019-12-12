<template>
  <div class="detail-page">
    <detail-header
      v-if="application"
      title="Create Application"
    >
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
      v-if="application"
      class="form"
      @submit.prevent="submit"
    >
      <fieldset>
        <legend>General</legend>

        <div class="form-group">
          <label>Name</label>
          <input
            v-model.trim="$v.application.name.$model"
            class="form-control"
            :class="{'is-invalid': $v.application.name.$error}"
          >
          <p
            v-if="!$v.application.name.required"
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
            v-model="$v.application.formSpec.$model"
            language="json"
            :class="{'is-invalid': $v.application.formSpec.$error}"
          />
          <p
            v-if="!$v.application.formSpec.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
          <p
            v-else-if="!$v.application.formSpec.isJson"
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
            v-model.trim="$v.application.deployCommand.$model"
            class="form-control"
            :class="{'is-invalid': $v.application.deployCommand.$error}"
          >
          <p
            v-if="!$v.application.deployCommand.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>

        <div class="form-group">
          <label>Dispose</label>
          <input
            v-model.trim="$v.application.disposeCommand.$model"
            class="form-control"
            :class="{'is-invalid': $v.application.disposeCommand.$error}"
          >
          <p
            v-if="!$v.application.disposeCommand.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>

        <div class="form-group">
          <label>Pause</label>
          <input
            v-model.trim="$v.application.pauseCommand.$model"
            class="form-control"
            :class="{'is-invalid': $v.application.pauseCommand.$error}"
          >
          <p
            v-if="!$v.application.pauseCommand.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>
      </fieldset>

      <fieldset>
        <legend>Files</legend>

        <div
          v-for="(v, index) in $v.application.templates.$each.$iter"
          :key="index"
          class="file"
        >
          <div class="form-group">
            <div class="file-name">
              <input
                v-model.trim="v.name.$model"
                class="form-control"
                :class="{'is-invalid':v.name.$error}"
              >
              <button
                class="btn btn-outline-danger"
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
            />
          </div>
        </div>

        <div class="file-actions">
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
  </div>
</template>

<script>
import _ from 'lodash'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import api from '../../api'
import DetailHeader from '../../components/DetailHeader/index'
import PrismEditor from 'vue-prism-editor'
import Status from '../../utils/Status'

export default {
  name: 'ApplicationDetail',

  components: {
    DetailHeader,
    PrismEditor
  },

  mixins: [validationMixin],

  validations() {
    return {
      application: {
        name: { required },
        formSpec: { required },
        deployCommand: { required },
        disposeCommand: { required },
        pauseCommand: { required },
        templates: {
          $each: {
            name: {
              required,
              isUnique(value) {
                return this.application.templates.filter(t => t.name === value).length === 1
              }
            },
            content: {}
          }
        }
      }
    }
  },

  data() {
    return {
      application: {
        name: '',
        formSpec: '',
        deployCommand: '',
        disposeCommand: '',
        pauseCommand: '',
        templates: []
      },
      status: new Status()
    }
  },

  methods: {
    addTemplate() {
      this.application.templates.push({
        name: 'file',
        content: ''
      })
    },

    removeTemplate(index) {
      if (window.confirm(`Are you sure you want to remove ${this.application.templates[index].name}?`)) {
        this.application.templates.splice(index, 1)
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

    async submit() {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        try {
          this.status.setPending()
          const response = await api.applications.postApplication(this.application)
          await this.$router.replace(`/applications/${response.data.uuid}`)
        } catch (error) {
          this.status.setError('Unable to create a new application.')
        }
      }
    }
  }
}
</script>
