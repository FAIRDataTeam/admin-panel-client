<template>
  <div class="detail-page">
    <loader v-if="loading" />
    <error :message="error" />

    <detail-header
      v-if="ready"
      title="Create Instance"
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


    <form
      v-if="ready"
      class="form"
      @submit.prevent="submit"
    >
      <fieldset>
        <legend>General</legend>

        <div class="form-group">
          <label>Name</label>
          <input
            v-model.trim="$v.instance.name.$model"
            class="form-control"
            :class="{'is-invalid': $v.instance.name.$error}"
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
            class="form-control"
            :class="{'is-invalid': $v.instance.url.$error}"
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
            v-model="$v.instance.applicationUuid.$model"
            class="form-control"
            :class="{'is-invalid': $v.instance.applicationUuid.$error}"
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
            v-if="!$v.instance.applicationUuid.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>

        <div class="form-group">
          <label>Docker Image</label>
          <input
            v-model.trim="$v.instance.variables.server_image.$model"
            class="form-control"
            :class="{'is-invalid': $v.instance.variables.server_image.$error}"
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
            v-model="$v.instance.serverUuid.$model"
            class="form-control"
            :class="{'is-invalid': $v.instance.serverUuid.$error}"
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
            v-if="!$v.instance.serverUuid.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>

        <div class="form-group">
          <label>Server Port</label>
          <input
            v-model.trim="$v.instance.variables.server_port.$model"
            class="form-control"
            :class="{'is-invalid': $v.instance.variables.server_port.$error}"
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
            class="form-control"
            :class="{'is-invalid': $v.instance.path.$error}"
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
            class="form-control"
            :class="{'is-invalid': $v.instance.variables.jwt_secret.$error}"
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
            class="form-control"
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
            class="form-control"
            :class="{'is-invalid': $v.instance.variables.repository_native_dir.$error}"
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
            class="form-control"
            :class="{'is-invalid': $v.instance.variables.repository_agraph_url.$error}"
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
            class="form-control"
            :class="{'is-invalid': $v.instance.variables.repository_agraph_password.$error}"
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
            class="form-control"
            :class="{'is-invalid': $v.instance.variables.repository_graphDb_url.$error}"
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
            class="form-control"
            :class="{'is-invalid': $v.instance.variables.repository_graphDb_repository.$error}"
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
            class="form-control"
            :class="{'is-invalid': $v.instance.variables.repository_blazegraph_repository.$error}"
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
            class="form-control"
            :class="{'is-invalid': $v.instance.variables.repository_blazegraph_url.$error}"
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
            class="form-control"
            :class="{'is-invalid': $v.instance.variables.metadata_rootSpecs.$error}"
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
            class="form-control"
            :class="{'is-invalid': $v.instance.variables.metadata_catalogSpecs.$error}"
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
            class="form-control"
            :class="{'is-invalid': $v.instance.variables.metadata_datasetSpecs.$error}"
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
            class="form-control"
            :class="{'is-invalid': $v.instance.variables.metadata_distributionSpecs.$error}"
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
            class="form-control"
            :class="{'is-invalid': $v.instance.variables.metadata_publisherURI.$error}"
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
            class="form-control"
            :class="{'is-invalid': $v.instance.variables.metadata_publisherName.$error}"
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
            class="form-control"
            :class="{'is-invalid': $v.instance.variables.metadata_language.$error}"
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
            class="form-control"
            :class="{'is-invalid': $v.instance.variables.metadata_license.$error}"
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
            class="form-control"
            :class="{'is-invalid': $v.instance.variables.metadata_accessRightsDescription.$error}"
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
            class="form-control"
            :class="{'is-invalid': $v.instance.variables.fairSearch_fdpSubmitUrl.$error}"
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
            class="form-control"
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
            class="form-control"
            :class="{'is-invalid': $v.instance.variables.pidSystem_purl_baseUrl.$error}"
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
          />
        </div>

        <div class="form-group">
          <label>Extra Styles</label>
          <prism-editor
            v-model="instance.variables.scss_extra"
            language="scss"
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
import DetailHeader from '../components/DetailHeader'
import PrismEditor from 'vue-prism-editor'

import { postInstance, getApplications, getServers } from '../api'

export default {
  name: 'Instance',

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
        applicationUuid: { required },
        serverUuid: { required },
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
          pidSystem_type: { required },
          pidSystem_purl_baseUrl: this.instance.variables.pidSystem_type === 2 ? { required } : {},
        }
      }
    }
  },

  data() {
    return {
      servers: null,
      applications: null,
      ready: false,
      loading: false,
      instance: {
        name: '',
        url: '',
        path: '',
        applicationUuid: '',
        serverUuid: '',
        variables: {
          server_port: '',
          jwt_secret: '',
          repository_type: 1,
          repository_native_dir: '',
          repository_agraph_url: '',
          repository_agraph_password: '',
          repository_graphDb_url: '',
          repository_graphDb_repository: '',
          repository_blazegraph_url: '',
          repository_blazegraph_repository: '',
          metadata_rootSpecs: '',
          metadata_catalogSpecs: '',
          metadata_datasetSpecs: '',
          metadata_distributionSpecs: '',
          metadata_publisherURI: '',
          metadata_publisherName: '',
          metadata_language: '',
          metadata_license: '',
          metadata_accessRightsDescription: '',
          fairSearch_fdpSubmitUrl: '',
          pidSystem_type: 1,
          pidSystem_purl_baseUrl: '',
        }
      },
      error: null,
      submitStatus: null
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
      this.error = null
      this.loading = true

      const promises = [
        getServers(),
        getApplications()
      ]

      axios.all(promises)
        .then(([ servers, applications ]) => {
          this.servers = servers.data
          this.applications = applications.data
          this.ready = true
        })
        .catch(error => this.error = error.toString())
        .finally(() => this.loading = false)
    },

    submit() {
      this.$v.$touch()

      if (this.$v.$invalid) {
        this.submitStatus = 'INVALID'
      } else {
        this.submitStatus = 'PENDING'

        postInstance(this.instance)
          .then(response => this.$router.replace(`/instances/${response.data.uuid}`))
          .catch(() => this.submitStatus = 'ERROR')
      }
    }
  }
}
</script>
