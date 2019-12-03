<template>
  <div class="detail-page">
    <detail-header
      v-if="data"
      :title="dataName"
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
      <button
        v-if="editing"
        class="btn btn-outline-secondary"
        :disabled="status.isPending()"
        @click="cancelEdit"
      >
        <fa :icon="['fas', 'ban']" />
        Cancel
      </button>

      <button
        v-if="!editing"
        class="btn btn-outline-primary"
        :disabled="anyPending()"
        @click="deploy"
      >
        <fa
          v-if="deployStatus.isPending()"
          :icon="['fas', 'sync-alt']"
          spin
        />
        <fa
          v-else
          :icon="['fas', 'play']"
        />
        Deploy
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
          @click="makeCopy"
        >
          <fa :icon="['far', 'copy']" />
          Make a copy
        </b-dropdown-item>
        <b-dropdown-divider />
        <b-dropdown-item
          :disabled="anyPending()"
          class="dropdown-item-danger"
          @click="dispose"
        >
          <fa :icon="['fas', 'power-off']" />
          Dispose
        </b-dropdown-item>
        <b-dropdown-item
          :disabled="anyPending()"
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
    <status-flash
      :status="deployStatus"
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
            v-if="!$v.data.url.url"
            class="invalid-feedback"
          >
            This is not a valid URL.
          </p>
        </div>

        <div class="form-group">
          <label>Application Template</label>
          <select
            v-model="data.applicationUuid"
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
            v-model.trim="$v.data.variables.server_image.$model"
            :class="{'is-invalid': $v.data.variables.server_image.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.data.variables.server_image.required"
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
            v-model="data.serverUuid"
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
            v-model.trim="$v.data.variables.server_port.$model"
            :class="{'is-invalid': $v.data.variables.server_port.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.data.variables.server_port.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>

        <div class="form-group">
          <label>Server Path</label>
          <input
            v-model.trim="$v.data.variables.server_path.$model"
            :class="{'is-invalid': $v.data.variables.server_path.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.data.variables.server_path.required"
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

      <fieldset>
        <legend>Mongo DB</legend>

        <div class="form-group">
          <label>Mongo Port</label>
          <input
            v-model.trim="$v.data.variables.mongo_port.$model"
            :class="{'is-invalid': $v.data.variables.mongo_port.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.data.variables.mongo_port.required"
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
            v-model.trim="$v.data.variables.jwt_secret.$model"
            :class="{'is-invalid': $v.data.variables.jwt_secret.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.data.variables.jwt_secret.required"
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
            v-model="data.variables.repository_type"
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
          v-if="data.variables.repository_type === 2"
          class="form-group"
        >
          <label>Native Directory</label>
          <input
            v-model.trim="$v.data.variables.repository_native_dir.$model"
            :class="{'is-invalid': $v.data.variables.repository_native_dir.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.data.variables.repository_native_dir.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>

        <div
          v-if="data.variables.repository_type === 3"
          class="form-group"
        >
          <label>AllegroGraph URL</label>
          <input
            v-model.trim="$v.data.variables.repository_agraph_url.$model"
            :class="{'is-invalid': $v.data.variables.repository_agraph_url.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.data.variables.repository_agraph_url.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>

        <div
          v-if="data.variables.repository_type === 3"
          class="form-group"
        >
          <label>AllegroGraph Password</label>
          <input
            v-model.trim="$v.data.variables.repository_agraph_password.$model"
            :class="{'is-invalid': $v.data.variables.repository_agraph_password.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.data.variables.repository_agraph_password.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>

        <div
          v-if="data.variables.repository_type === 4"
          class="form-group"
        >
          <label>GraphDB URL</label>
          <input
            v-model.trim="$v.data.variables.repository_graphDb_url.$model"
            :class="{'is-invalid': $v.data.variables.repository_graphDb_url.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.data.variables.repository_graphDb_url.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>

        <div
          v-if="data.variables.repository_type === 4"
          class="form-group"
        >
          <label>GraphDB Repository</label>
          <input
            v-model.trim="$v.data.variables.repository_graphDb_repository.$model"
            :class="{'is-invalid': $v.data.variables.repository_graphDb_repository.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.data.variables.repository_graphDb_repository.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>

        <div
          v-if="data.variables.repository_type === 5"
          class="form-group"
        >
          <label>Blazegraph Repository</label>
          <input
            v-model.trim="$v.data.variables.repository_blazegraph_repository.$model"
            :class="{'is-invalid': $v.data.variables.repository_blazegraph_repository.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.data.variables.repository_blazegraph_repository.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>

        <div
          v-if="data.variables.repository_type === 5"
          class="form-group"
        >
          <label>Blazegraph Repository</label>
          <input
            v-model.trim="$v.data.variables.repository_blazegraph_url.$model"
            :class="{'is-invalid': $v.data.variables.repository_blazegraph_url.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.data.variables.repository_blazegraph_url.required"
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
            v-model.trim="$v.data.variables.metadata_rootSpecs.$model"
            :class="{'is-invalid': $v.data.variables.metadata_rootSpecs.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.data.variables.metadata_rootSpecs.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>

        <div class="form-group">
          <label>Catalog Specs</label>
          <input
            v-model.trim="$v.data.variables.metadata_catalogSpecs.$model"
            :class="{'is-invalid': $v.data.variables.metadata_catalogSpecs.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.data.variables.metadata_catalogSpecs.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>

        <div class="form-group">
          <label>Dataset Specs</label>
          <input
            v-model.trim="$v.data.variables.metadata_datasetSpecs.$model"
            :class="{'is-invalid': $v.data.variables.metadata_datasetSpecs.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.data.variables.metadata_datasetSpecs.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>

        <div class="form-group">
          <label>Distribution Specs</label>
          <input
            v-model.trim="$v.data.variables.metadata_distributionSpecs.$model"
            :class="{'is-invalid': $v.data.variables.metadata_distributionSpecs.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.data.variables.metadata_distributionSpecs.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>

        <div class="form-group">
          <label>Publisher URI</label>
          <input
            v-model.trim="$v.data.variables.metadata_publisherURI.$model"
            :class="{'is-invalid': $v.data.variables.metadata_publisherURI.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.data.variables.metadata_publisherURI.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>

        <div class="form-group">
          <label>Publisher Name</label>
          <input
            v-model.trim="$v.data.variables.metadata_publisherName.$model"
            :class="{'is-invalid': $v.data.variables.metadata_publisherName.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.data.variables.metadata_publisherName.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>

        <div class="form-group">
          <label>Language</label>
          <input
            v-model.trim="$v.data.variables.metadata_language.$model"
            :class="{'is-invalid': $v.data.variables.metadata_language.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.data.variables.metadata_language.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>

        <div class="form-group">
          <label>License</label>
          <input
            v-model.trim="$v.data.variables.metadata_license.$model"
            :class="{'is-invalid': $v.data.variables.metadata_license.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.data.variables.metadata_license.required"
            class="invalid-feedback"
          >
            Field is required
          </p>
        </div>

        <div class="form-group">
          <label>Access Rights Descritption</label>
          <input
            v-model.trim="$v.data.variables.metadata_accessRightsDescription.$model"
            :class="{'is-invalid': $v.data.variables.metadata_accessRightsDescription.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.data.variables.metadata_accessRightsDescription.required"
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
            v-model.trim="$v.data.variables.fairSearch_fdpSubmitUrl.$model"
            :class="{'is-invalid': $v.data.variables.fairSearch_fdpSubmitUrl.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.data.variables.fairSearch_fdpSubmitUrl.required"
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
            v-model="data.variables.pidSystem_type"
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
          v-if="data.variables.pidSystem_type === 2"
          class="form-group"
        >
          <label>PURL Base URL</label>
          <input
            v-model.trim="$v.data.variables.pidSystem_purl_baseUrl.$model"
            :class="{'is-invalid': $v.data.variables.pidSystem_purl_baseUrl.$error, 'form-control': editing, 'form-control-plaintext': !editing}"
            :readonly="!editing"
          >
          <p
            v-if="!$v.data.variables.pidSystem_purl_baseUrl.required"
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
            v-model="data.variables.scss_customizations"
            language="scss"
            :readonly="!editing"
          />
        </div>

        <div class="form-group">
          <label>Extra Styles</label>
          <prism-editor
            v-model="data.variables.scss_extra"
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
import { required, url } from 'vuelidate/lib/validators'
import PrismEditor from 'vue-prism-editor'
import DetailHeader from '../components/detail/DetailHeader'

import {
  getInstance,
  putInstance,
  deployInstance,
  deleteInstance,
  cloneInstance,
  getServers,
  getApplications, disposeInstance
} from '../api'
import cloneData from '../mixins/detail/cloneData'
import editableData from '../mixins/detail/editableData'
import fetchData from '../mixins/detail/fetchData'
import removeData from '../mixins/detail/removeData'
import Status from '../utils/Status'

export default {
  name: 'InstanceDetail',

  components: {
    DetailHeader,
    PrismEditor
  },

  mixins: [
    validationMixin,
    fetchData,
    editableData,
    removeData,
    cloneData
  ],

  validations() {
    return {
      data: {
        name: { required },
        url: { required, url },
        path: { required },
        variables: {
          server_port: { required },
          server_path: { required },
          server_image: { required },
          jwt_secret: { required },
          mongo_port: { required },
          repository_type: { required },
          repository_native_dir: this.data.variables.repository_type === 2 ? { required } : {},
          repository_agraph_url: this.data.variables.repository_type === 3 ? { required } : {},
          repository_agraph_password: this.data.variables.repository_type === 3 ? { required } : {},
          repository_graphDb_url: this.data.variables.repository_type === 4 ? { required } : {},
          repository_graphDb_repository: this.data.variables.repository_type === 4 ? { required } : {},
          repository_blazegraph_url: this.data.variables.repository_type === 5 ? { required } : {},
          repository_blazegraph_repository: this.data.variables.repository_type === 5 ? { required } : {},
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
          pidSystem_purl_baseUrl: this.data.variables.pidSystem_type === 2 ? { required } : {},
        }
      }
    }
  },

  data() {
    return {
      applications: null,
      servers: null,
      deployStatus: new Status(),
    }
  },

  methods: {
    getData: getInstance,
    putData: putInstance,
    deleteData: deleteInstance,
    cloneData: cloneInstance,
    removeRedirectLocation: () => '/instances',
    cloneRedirectLocation: id => `/instances/${id}`,

    fetchData() {
      this.status.setPending()

      const promises = [
        getInstance(this.$route.params.id),
        getServers(),
        getApplications()
      ]

      axios.all(promises)
        .then(([ data, servers, applications ]) => {
          this.data = data.data
          this.dataName = this.data.name
          this.servers = servers.data
          this.applications = applications.data
          this.status.setDone()
        })
        .catch(error => this.status.setError(error.toString()))
    },

    anyPending() {
      return this.status.isPending() || this.deployStatus.isPending()
    },

    deploy() {
      this.deployStatus.setPending()
      this.status.setPending()

      deployInstance(this.data)
        .then(() => this.status.setDone('Instance was successfully deployed.'))
        .catch(() => this.status.setError('Deploy failed.'))
        .finally(() => this.deployStatus.setDone())

    },

    dispose() {
      if (window.confirm(`Are you sure you want to dispose ${this.data.name}? (This will stop the running data and remove it from the server)`)) {
        this.status.setPending()

        disposeInstance(this.data)
          .then(() => this.status.setDone('Instance was successfully disposed.'))
          .catch(() => this.status.setError('Dispose failed.'))
      }
    }
  }
}
</script>
