<template>
  <div class="detail-page">
    <loader v-if="loading" />

    <detail-header
      v-if="application"
      :title="applicationName"
    >
      <button
        v-if="editing"
        class="btn btn-outline-primary"
        :disabled="anyPending()"
        @click="submit"
      >
        <fa :icon="['far', 'save']" />
        Save
      </button>

      <b-dropdown
        v-if="!editing"
        split
        right
        variant="outline-secondary"
        :disabled="anyPending()"
        @click="edit"
      >
        <template v-slot:button-content>
          <fa :icon="['fas', 'pen']" />
          Edit
        </template>
        <b-dropdown-item
          :disabled="anyPending()"
          @click="applicationClone"
        >
          <fa :icon="['far', 'copy']" />
          Make a copy
        </b-dropdown-item>
        <b-dropdown-divider />
        <b-dropdown-item
          :disabled="anyPending()"
          class="dropdown-item-danger"
          @click="applicationDelete"
        >
          <fa :icon="['far', 'trash-alt']" />
          Remove
        </b-dropdown-item>
      </b-dropdown>
    </detail-header>

    <error :message="error" />
    <error :message="cloneStatus === 'ERROR' ? 'Clone failed.' : null" />

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
            :class="{'is-invalid': $v.application.name.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
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
            :class="{'is-invalid': $v.application.deployCommand.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
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
            :class="{'is-invalid': $v.application.disposeCommand.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
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
        <b-alert
          :show="application.templates.length === 0"
          variant="light"
        >
          There are no file templates.
        </b-alert>
        <div
          v-for="(v, index) in $v.application.templates.$each.$iter"
          :key="index"
          class="file"
        >
          <div class="form-group">
            <div class="file-name">
              <input
                v-model.trim="v.name.$model"
                :class="{'is-invalid':v.name.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
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
  </div>
</template>

<script>
import _ from 'lodash'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { cloneApplication, deleteApplication, getApplication, putApplication } from '../api'
import DetailHeader from '../components/DetailHeader'
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
      applicationName: 'Application Template',
      loading: false,
      application: null,
      error: null,
      editing: false,
      submitStatus: null,
      deleteStatus: null,
      cloneStatus: null
    }
  },

  watch: {
    '$route': 'fetchData'
  },

  created() {
    this.fetchData()
  },

  methods: {
    fetchData() {
      this.error = this.application = null
      this.loading = true

      getApplication(this.$route.params.id)
        .then(response => {
          this.application = response.data
          this.applicationName = this.application.name
        })
        .catch(error => this.error = error.toString())
        .finally(() => this.loading = false)
    },

    anyPending() {
      return this.submitStatus === 'PENDING' || this.deleteStatus === 'PENDING' || this.cloneStatus === 'PENDING'
    },

    edit() {
      this.editing = true
    },

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

        putApplication(this.application)
          .then(() => {
            this.submitStatus = 'SAVED'
            this.editing = false
            this.applicationName = this.application.name
          })
          .catch(() => this.submitStatus = 'ERROR')
      }
    },

    applicationClone() {
      this.cloneStatus = 'PENDING'
      cloneApplication(this.application)
        .then(response => {
          this.cloneStatus = null
          this.$router.replace(`/applications/${response.data.uuid}`)
        })
        .catch(() => this.cloneStatus = 'ERROR')
    },

    applicationDelete() {
      if (window.confirm(`Are you sure you want to delete ${this.application.name}?`)) {
        this.deleteStatus = 'PENDING'

        deleteApplication(this.application)
          .then(() => this.$router.replace('/applications'))
          .catch(() => this.deleteStatus = 'ERROR')
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