<template>
  <div class="detail-page">
    <detail-header
      v-if="application"
      title="Create Application"
    >
      <button
        class="btn btn-outline-primary"
        :disabled="submitStatus === 'PENDING'"
        @click="submit"
      >
        <fa :icon="['far', 'save']" />
        Save
      </button>
    </detail-header>

    <error :message="error" />

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
import { postApplication } from '../api'
import DetailHeader from '../components/detail/DetailHeader'
import PrismEditor from 'vue-prism-editor'

export default {
  name: 'ApplicationDetail',

  components: {
    DetailHeader,
    PrismEditor
  },

  mixins: [ validationMixin ],

  validations() {
    return {
      application: {
        name: { required },
        deployCommand: { required },
        disposeCommand: { required },
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
        deployCommand: '',
        disposeCommand: '',
        templates: []
      },
      error: null,
      submitStatus: null
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

    submit() {
      this.$v.$touch()

      if (this.$v.$invalid) {
        this.submitStatus = 'INVALID'
      } else {
        this.submitStatus = 'PENDING'

        postApplication(this.application)
          .then(response => this.$router.replace(`/applications/${response.data.uuid}`))
          .catch(() => this.submitStatus = 'ERROR')
      }
    }
  }
}
</script>
<style scoped>
.file {
  margin-bottom: 4rem;
}

.file:last-child {
  margin-bottom: 2rem;
}

.file .form-group:first-child {
  margin-bottom: 0;
}

.file-name {
  display: flex;
}

.file-name .btn {
  margin-left: .5rem;
}

.file-name .btn .svg-inline--fa {
  margin-right: 0;
}

.file-actions {
  margin: 0 0.5rem 2rem 0.5rem;
}

.file .invalid-feedback {
  display: block;
}
</style>