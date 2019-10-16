<template>
  <div class="detail-page">
    <loader v-if="loading" />

    <detail-header
      v-if="instance"
      :title="instanceName"
    >
      <button
        v-if="!editing"
        class="btn btn-outline-primary"
        :disabled="anyPending()"
        @click="deploy"
      >
        <fa
          v-if="deployStatus === 'PENDING'"
          :icon="['fas', 'sync-alt']"
          spin
        />
        <fa
          v-else
          :icon="['fas', 'play']"
        />
        Deploy
      </button>

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
          @click="instanceClone"
        >
          <fa :icon="['far', 'copy']" />
          Make a copy
        </b-dropdown-item>
        <b-dropdown-divider />
        <b-dropdown-item
          :disabled="anyPending()"
          class="dropdown-item-danger"
          @click="instanceDelete"
        >
          <fa :icon="['far', 'trash-alt']" />
          Remove
        </b-dropdown-item>
      </b-dropdown>
    </detail-header>

    <div
      v-if="error"
      class="alert alert-danger"
    >
      {{ error }}
    </div>
    <div
      v-if="deployStatus === 'ERROR'"
      class="alert alert-danger"
    >
      Deploy failed.
    </div>
    <div
      v-if="deployStatus === 'DONE'"
      class="alert alert-success"
    >
      Instance was successfully deployed.
    </div>
    <div
      v-if="cloneStatus === 'ERROR'"
      class="alert alert-danger"
    >
      Clone failed.
    </div>

    <form
      v-if="instance"
      class="form"
      @submit.prevent="submit"
    >
      <fieldset>
        <legend>General</legend>

        <div class="form-group">
          <label>Name</label>
          <input
            v-model.trim="$v.instance.name.$model"
            :class="{'is-invalid': $v.instance.name.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.instance.name.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>

        <div class="form-group">
          <label>URL</label>
          <input
            v-model.trim="$v.instance.url.$model"
            :class="{'is-invalid': $v.instance.url.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.instance.url.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>

        <div class="form-group">
          <label>Application Template</label>
          <select
            v-model="instance.applicationUuid"
            :class="{'form-control': editing, 'form-control-plaintext': !editing}"
            :disabled="!editing"
          >
            <option
              v-for="application in applications"
              :key="application.uuid"
              :value="application.uuid"
            >
              {{ application.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Docker Image</label>
          <input
            v-model.trim="$v.instance.variables.server_image.$model"
            :class="{'is-invalid': $v.instance.variables.server_image.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.instance.variables.server_image.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>
      </fieldset>

      <fieldset>
        <legend>Server</legend>

        <div class="form-group">
          <label>Server</label>
          <select
            v-model="instance.serverUuid"
            :class="{'form-control': editing, 'form-control-plaintext': !editing}"
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
        </div>

        <div class="form-group">
          <label>Server Port</label>
          <input
            v-model.trim="$v.instance.variables.server_port.$model"
            :class="{'is-invalid': $v.instance.variables.server_port.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.instance.variables.server_port.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>

        <div class="form-group">
          <label>Path</label>
          <input
            v-model.trim="$v.instance.path.$model"
            :class="{'is-invalid': $v.instance.path.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.instance.path.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>
      </fieldset>

      <fieldset>
        <legend>Security</legend>

        <div class="form-group">
          <label>JWT Secret</label>
          <input
            v-model.trim="$v.instance.variables.jwt_secret.$model"
            :class="{'is-invalid': $v.instance.variables.jwt_secret.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.instance.variables.jwt_secret.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>
      </fieldset>

      <fieldset>
        <legend>Repository</legend>

        <div class="form-group">
          <label>Type</label>
          <select
            v-model="instance.variables.repository_type"
            :class="{'form-control': editing, 'form-control-plaintext': !editing}"
            :disabled="!editing"
          >
            <option :value="1">
              In Memory Store
            </option>
            <option :value="2">
              Native Store
            </option>
            <option :value="3">
              AllegroGraph
            </option>
            <option :value="4">
              GraphDB
            </option>
            <option :value="5">
              Blazegraph
            </option>
          </select>
        </div>

        <div
          v-if="instance.variables.repository_type === 2"
          class="form-group"
        >
          <label>Native Directory</label>
          <input
            v-model.trim="$v.instance.variables.repository_native_dir.$model"
            :class="{'is-invalid': $v.instance.variables.repository_native_dir.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.instance.variables.repository_native_dir.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>

        <div
          v-if="instance.variables.repository_type === 3"
          class="form-group"
        >
          <label>AllegroGraph URL</label>
          <input
            v-model.trim="$v.instance.variables.repository_agraph_url.$model"
            :class="{'is-invalid': $v.instance.variables.repository_agraph_url.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.instance.variables.repository_agraph_url.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>

        <div
          v-if="instance.variables.repository_type === 3"
          class="form-group"
        >
          <label>AllegroGraph Password</label>
          <input
            v-model.trim="$v.instance.variables.repository_agraph_password.$model"
            :class="{'is-invalid': $v.instance.variables.repository_agraph_password.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.instance.variables.repository_agraph_password.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>

        <div
          v-if="instance.variables.repository_type === 4"
          class="form-group"
        >
          <label>GraphDB URL</label>
          <input
            v-model.trim="$v.instance.variables.repository_graphDb_url.$model"
            :class="{'is-invalid': $v.instance.variables.repository_graphDb_url.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.instance.variables.repository_graphDb_url.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>

        <div
          v-if="instance.variables.repository_type === 4"
          class="form-group"
        >
          <label>GraphDB Repository</label>
          <input
            v-model.trim="$v.instance.variables.repository_graphDb_repository.$model"
            :class="{'is-invalid': $v.instance.variables.repository_graphDb_repository.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.instance.variables.repository_graphDb_repository.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>

        <div
          v-if="instance.variables.repository_type === 5"
          class="form-group"
        >
          <label>Blazegraph Repository</label>
          <input
            v-model.trim="$v.instance.variables.repository_blazegraph_repository.$model"
            :class="{'is-invalid': $v.instance.variables.repository_blazegraph_repository.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.instance.variables.repository_blazegraph_repository.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>

        <div
          v-if="instance.variables.repository_type === 5"
          class="form-group"
        >
          <label>Blazegraph Repository</label>
          <input
            v-model.trim="$v.instance.variables.repository_blazegraph_url.$model"
            :class="{'is-invalid': $v.instance.variables.repository_blazegraph_url.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.instance.variables.repository_blazegraph_url.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>
      </fieldset>

      <fieldset>
        <legend>Metadata</legend>

        <div class="form-group">
          <label>Root Specs</label>
          <input
            v-model.trim="$v.instance.variables.metadata_rootSpecs.$model"
            :class="{'is-invalid': $v.instance.variables.metadata_rootSpecs.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.instance.variables.metadata_rootSpecs.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>

        <div class="form-group">
          <label>Catalog Specs</label>
          <input
            v-model.trim="$v.instance.variables.metadata_catalogSpecs.$model"
            :class="{'is-invalid': $v.instance.variables.metadata_catalogSpecs.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.instance.variables.metadata_catalogSpecs.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>

        <div class="form-group">
          <label>Dataset Specs</label>
          <input
            v-model.trim="$v.instance.variables.metadata_datasetSpecs.$model"
            :class="{'is-invalid': $v.instance.variables.metadata_datasetSpecs.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.instance.variables.metadata_datasetSpecs.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>

        <div class="form-group">
          <label>Distribution Specs</label>
          <input
            v-model.trim="$v.instance.variables.metadata_distributionSpecs.$model"
            :class="{'is-invalid': $v.instance.variables.metadata_distributionSpecs.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.instance.variables.metadata_distributionSpecs.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>

        <div class="form-group">
          <label>Publisher URI</label>
          <input
            v-model.trim="$v.instance.variables.metadata_publisherURI.$model"
            :class="{'is-invalid': $v.instance.variables.metadata_publisherURI.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.instance.variables.metadata_publisherURI.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>

        <div class="form-group">
          <label>Publisher Name</label>
          <input
            v-model.trim="$v.instance.variables.metadata_publisherName.$model"
            :class="{'is-invalid': $v.instance.variables.metadata_publisherName.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.instance.variables.metadata_publisherName.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>

        <div class="form-group">
          <label>Language</label>
          <input
            v-model.trim="$v.instance.variables.metadata_language.$model"
            :class="{'is-invalid': $v.instance.variables.metadata_language.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.instance.variables.metadata_language.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>

        <div class="form-group">
          <label>License</label>
          <input
            v-model.trim="$v.instance.variables.metadata_license.$model"
            :class="{'is-invalid': $v.instance.variables.metadata_license.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.instance.variables.metadata_license.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>

        <div class="form-group">
          <label>Access Rights Descritption</label>
          <input
            v-model.trim="$v.instance.variables.metadata_accessRightsDescription.$model"
            :class="{'is-invalid': $v.instance.variables.metadata_accessRightsDescription.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.instance.variables.metadata_accessRightsDescription.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>
      </fieldset>


      <fieldset>
        <legend>FAIR Search</legend>

        <div class="form-group">
          <label>FDP Submit URL</label>
          <input
            v-model.trim="$v.instance.variables.fairSearch_fdpSubmitUrl.$model"
            :class="{'is-invalid': $v.instance.variables.fairSearch_fdpSubmitUrl.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.instance.variables.fairSearch_fdpSubmitUrl.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>
      </fieldset>

      <fieldset>
        <legend>PID System</legend>

        <div class="form-group">
          <label>Type</label>
          <select
            v-model="instance.variables.pidSystem_type"
            :class="{'form-control': editing, 'form-control-plaintext': !editing}"
            :disabled="!editing"
          >
            <option :value="1">
              Default
            </option>
            <option :value="2">
              purl.org
            </option>
          </select>
        </div>

        <div
          v-if="instance.variables.pidSystem_type === 2"
          class="form-group"
        >
          <label>PURL Base URL</label>
          <input
            v-model.trim="$v.instance.variables.pidSystem_purl_baseUrl.$model"
            :class="{'is-invalid': $v.instance.variables.pidSystem_purl_baseUrl.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.instance.variables.pidSystem_purl_baseUrl.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>
      </fieldset>

      <fieldset>
        <legend>SCSS</legend>

        <div class="form-group">
          <label>Customizations</label>
          <prism-editor
            v-model="instance.variables.scss_customizations"
            language="scss"
            :readonly="!editing"
          />
        </div>

        <div class="form-group">
          <label>Extra Styles</label>
          <prism-editor
            v-model="instance.variables.scss_extra"
            language="scss"
            :readonly="!editing"
          />
        </div>
      </fieldset>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import PrismEditor from 'vue-prism-editor'
import DetailHeader from '../components/DetailHeader'

import {
  getInstance,
  putInstance,
  deployInstance,
  deleteInstance,
  cloneInstance,
  getServers,
  getApplications
} from '../api'

export default {
  name: 'InstanceDetail',

  components: {
    DetailHeader,
    PrismEditor
  },

  mixins: [ validationMixin ],

  validations() {
    return {
      instance: {
        name: { required },
        url: { required },
        path: { required },
        variables: {
          server_port: { required },
          server_image: { required },
          jwt_secret: { required },
          repository_type: { required },
          repository_native_dir: this.instance.variables.repository_type === 2 ? { required } : {},
          repository_agraph_url: this.instance.variables.repository_type === 3 ? { required } : {},
          repository_agraph_password: this.instance.variables.repository_type === 3 ? { required } : {},
          repository_graphDb_url: this.instance.variables.repository_type === 4 ? { required } : {},
          repository_graphDb_repository: this.instance.variables.repository_type === 4 ? { required } : {},
          repository_blazegraph_url: this.instance.variables.repository_type === 5 ? { required } : {},
          repository_blazegraph_repository: this.instance.variables.repository_type === 5 ? { required } : {},
          metadata_rootSpecs: { required },
          metadata_catalogSpecs: { required },
          metadata_datasetSpecs: { required },
          metadata_distributionSpecs: { required },
          metadata_publisherURI: { required },
          metadata_publisherName: { required },
          metadata_language: { required },
          metadata_license: { required },
          metadata_accessRightsDescription: { required },
          fairSearch_fdpSubmitUrl: { required },
          pidSystem_purl_baseUrl: this.instance.variables.pidSystem_type === 2 ? { required } : {},
        }
      }
    }
  },

  data() {
    return {
      instanceName: 'Instance',
      loading: false,
      instance: null,
      servers: null,
      applications: null,
      error: null,
      editing: false,
      submitStatus: null,
      deployStatus: null,
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
      this.error = this.instance = null
      this.loading = true

      const promises = [
        getInstance(this.$route.params.id),
        getServers(),
        getApplications()
      ]

      axios.all(promises)
        .then(([ instance, servers, applications ]) => {
          this.instance = instance.data
          this.instanceName = this.instance.name
          this.servers = servers.data
          this.applications = applications.data
        })
        .catch(error => this.error = error)
        .finally(() => this.loading = false)
    },

    anyPending() {
      return this.submitStatus === 'PENDING' || this.deployStatus === 'PENDING' || this.deleteStatus === 'PENDING' || this.cloneStatus === 'PENDING'
    },

    edit() {
      this.editing = true
    },

    submit() {
      this.$v.$touch()

      if (this.$v.$invalid) {
        this.submitStatus = 'INVALID'
      } else {
        this.submitStatus = 'PENDING'

        putInstance(this.instance)
          .then(() => {
            this.submitStatus = 'SAVED'
            this.editing = false
            this.instanceName = this.instance.name
          })
          .catch(() => this.submitStatus = 'ERROR')
      }
    },

    deploy() {
      this.deployStatus = 'PENDING'

      deployInstance(this.instance)
        .then(() => this.deployStatus = 'DONE')
        .catch(() => this.deployStatus = 'ERROR')

    },

    instanceClone() {
      this.cloneStatus = 'PENDING'
      cloneInstance(this.instance)
        .then(response => {
          this.cloneStatus = null
          this.$router.replace(`/instances/${response.data.uuid}`)
        })
        .catch(() => this.cloneStatus = 'ERROR')
    },

    instanceDelete() {
      if (window.confirm(`Are you sure you want to delete ${this.instance.name}?`)) {
        this.deleteStatus = 'PENDING'

        deleteInstance(this.instance)
          .then(() => this.$router.replace('/instances'))
          .catch(() => this.deleteStatus = 'ERROR')
      }
    }
  }
}
</script>
