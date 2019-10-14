<template>
    <div id="instance-detail">
        <loader v-if="loading" />

        <div class="header" v-if="instance">
            <div class="container d-flex justify-content-between align-items-center">
                <strong>{{ instanceName }}</strong>

                <div class="actions">
                    <button class="btn btn-outline-primary" v-if="!editing" v-on:click="deploy" :disabled="anyPending()">
                        <fa :icon="['fas', 'sync-alt']" spin v-if="deployStatus === 'PENDING'" />
                        <fa :icon="['fas', 'play']" v-else />
                        Deploy
                    </button>

                    <button class="btn btn-outline-primary" v-if="editing" v-on:click="submit" :disabled="anyPending()">
                        <fa :icon="['far', 'save']" />
                        Save
                    </button>

                    <b-dropdown v-if="!editing" split right variant="outline-secondary" v-on:click="edit" :disabled="anyPending()">
                        <template v-slot:button-content>
                            <fa :icon="['fas', 'pen']" /> Edit
                        </template>
                        <b-dropdown-item v-on:click="instanceClone" :disabled="anyPending()">
                            <fa :icon="['far', 'copy']" /> Make a copy
                        </b-dropdown-item>
                        <b-dropdown-divider></b-dropdown-divider>
                        <b-dropdown-item v-on:click="instanceDelete" :disabled="anyPending()" class="dropdown-item-danger">
                            <fa :icon="['far', 'trash-alt']" /> Remove
                        </b-dropdown-item>
                    </b-dropdown>
                </div>
            </div>
        </div>

        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <div v-if="deployStatus === 'ERROR'" class="alert alert-danger">
            Deploy failed.
        </div>
        <div v-if="deployStatus === 'DONE'" class="alert alert-success">
            Instance was successfully deployed.
        </div>
        <div v-if="cloneStatus === 'ERROR'" class="alert alert-danger">
            Clone failed.
        </div>

        <div v-if="instance">
            <div>
                <form @submit.prevent="submit">
                <div class="form-group">
                    <label>Name</label>
                    <input v-model.trim="$v.instance.name.$model" v-bind:class="{'is-invalid': $v.instance.name.$error, 'form-control': editing, 'form-control-plaintext': !editing}" :readonly="!editing">
                    <p class="invalid-feedback" v-if="!$v.instance.name.required">Field is required</p>
                </div>

                <div class="form-group">
                    <label>URL</label>
                    <input v-model.trim="$v.instance.url.$model" v-bind:class="{'is-invalid': $v.instance.url.$error, 'form-control': editing, 'form-control-plaintext': !editing}" :readonly="!editing">
                    <p class="invalid-feedback" v-if="!$v.instance.url.required">Field is required</p>
                </div>

                <div class="form-group">
                    <label>Path</label>
                    <input v-model.trim="$v.instance.path.$model" v-bind:class="{'is-invalid': $v.instance.path.$error, 'form-control': editing, 'form-control-plaintext': !editing}" :readonly="!editing">
                    <p class="invalid-feedback" v-if="!$v.instance.path.required">Field is required</p>
                </div>

                <div class="form-group">
                    <label>Server Port</label>
                    <input v-model.trim="$v.instance.variables.server_port.$model" v-bind:class="{'is-invalid': $v.instance.variables.server_port.$error, 'form-control': editing, 'form-control-plaintext': !editing}" :readonly="!editing">
                    <p class="invalid-feedback" v-if="!$v.instance.variables.server_port.required">Field is required</p>
                </div>

                <div class="form-group">
                    <label>JWT Secret</label>
                    <input v-model.trim="$v.instance.variables.jwt_secret.$model" v-bind:class="{'is-invalid': $v.instance.variables.jwt_secret.$error, 'form-control': editing, 'form-control-plaintext': !editing}" :readonly="!editing">
                    <p class="invalid-feedback" v-if="!$v.instance.variables.jwt_secret.required">Field is required</p>
                </div>

                <h2>Repository</h2>

                <div class="form-group">
                    <label>Type</label>
                    <select v-model="instance.variables.repository_type" v-bind:class="{'form-control': editing, 'form-control-plaintext': !editing}" :disabled="!editing">
                        <option v-bind:value="1">In Memory Store</option>
                        <option v-bind:value="2">Native Store</option>
                        <option v-bind:value="3">AllegroGraph</option>
                        <option v-bind:value="4">GraphDB</option>
                        <option v-bind:value="5">Blazegraph</option>
                    </select>
                </div>

                <div class="form-group" v-if="instance.variables.repository_type === 2">
                    <label>Native Directory</label>
                    <input v-model.trim="$v.instance.variables.repository_native_dir.$model" v-bind:class="{'is-invalid': $v.instance.variables.repository_native_dir.$error, 'form-control': editing, 'form-control-plaintext': !editing}" :readonly="!editing">
                    <p class="invalid-feedback" v-if="!$v.instance.variables.repository_native_dir.required">Field is required</p>
                </div>

                <div class="form-group" v-if="instance.variables.repository_type === 3">
                    <label>AllegroGraph URL</label>
                    <input v-model.trim="$v.instance.variables.repository_agraph_url.$model" v-bind:class="{'is-invalid': $v.instance.variables.repository_agraph_url.$error, 'form-control': editing, 'form-control-plaintext': !editing}" :readonly="!editing">
                    <p class="invalid-feedback" v-if="!$v.instance.variables.repository_agraph_url.required">Field is required</p>
                </div>

                <div class="form-group" v-if="instance.variables.repository_type === 3">
                    <label>AllegroGraph Password</label>
                    <input v-model.trim="$v.instance.variables.repository_agraph_password.$model" v-bind:class="{'is-invalid': $v.instance.variables.repository_agraph_password.$error, 'form-control': editing, 'form-control-plaintext': !editing}" :readonly="!editing">
                    <p class="invalid-feedback" v-if="!$v.instance.variables.repository_agraph_password.required">Field is required</p>
                </div>

                <div class="form-group" v-if="instance.variables.repository_type === 4">
                    <label>GraphDB URL</label>
                    <input v-model.trim="$v.instance.variables.repository_graphDb_url.$model" v-bind:class="{'is-invalid': $v.instance.variables.repository_graphDb_url.$error, 'form-control': editing, 'form-control-plaintext': !editing}" :readonly="!editing">
                    <p class="invalid-feedback" v-if="!$v.instance.variables.repository_graphDb_url.required">Field is required</p>
                </div>

                <div class="form-group" v-if="instance.variables.repository_type === 4">
                    <label>GraphDB Repository</label>
                    <input v-model.trim="$v.instance.variables.repository_graphDb_repository.$model" v-bind:class="{'is-invalid': $v.instance.variables.repository_graphDb_repository.$error, 'form-control': editing, 'form-control-plaintext': !editing}" :readonly="!editing">
                    <p class="invalid-feedback" v-if="!$v.instance.variables.repository_graphDb_repository.required">Field is required</p>
                </div>

                <div class="form-group" v-if="instance.variables.repository_type === 5">
                    <label>Blazegraph Repository</label>
                    <input v-model.trim="$v.instance.variables.repository_blazegraph_repository.$model" v-bind:class="{'is-invalid': $v.instance.variables.repository_blazegraph_repository.$error, 'form-control': editing, 'form-control-plaintext': !editing}" :readonly="!editing">
                    <p class="invalid-feedback" v-if="!$v.instance.variables.repository_blazegraph_repository.required">Field is required</p>
                </div>

                <div class="form-group" v-if="instance.variables.repository_type === 5">
                    <label>Blazegraph Repository</label>
                    <input v-model.trim="$v.instance.variables.repository_blazegraph_url.$model" v-bind:class="{'is-invalid': $v.instance.variables.repository_blazegraph_url.$error, 'form-control': editing, 'form-control-plaintext': !editing}" :readonly="!editing">
                    <p class="invalid-feedback" v-if="!$v.instance.variables.repository_blazegraph_url.required">Field is required</p>
                </div>


                <h2>Metadata</h2>

                <div class="form-group">
                    <label>Root Specs</label>
                    <input v-model.trim="$v.instance.variables.metadata_rootSpecs.$model" v-bind:class="{'is-invalid': $v.instance.variables.metadata_rootSpecs.$error, 'form-control': editing, 'form-control-plaintext': !editing}" :readonly="!editing">
                    <p class="invalid-feedback" v-if="!$v.instance.variables.metadata_rootSpecs.required">Field is required</p>
                </div>

                <div class="form-group">
                    <label>Catalog Specs</label>
                    <input v-model.trim="$v.instance.variables.metadata_catalogSpecs.$model" v-bind:class="{'is-invalid': $v.instance.variables.metadata_catalogSpecs.$error, 'form-control': editing, 'form-control-plaintext': !editing}" :readonly="!editing">
                    <p class="invalid-feedback" v-if="!$v.instance.variables.metadata_catalogSpecs.required">Field is required</p>
                </div>

                <div class="form-group">
                    <label>Dataset Specs</label>
                    <input v-model.trim="$v.instance.variables.metadata_datasetSpecs.$model" v-bind:class="{'is-invalid': $v.instance.variables.metadata_datasetSpecs.$error, 'form-control': editing, 'form-control-plaintext': !editing}" :readonly="!editing">
                    <p class="invalid-feedback" v-if="!$v.instance.variables.metadata_datasetSpecs.required">Field is required</p>
                </div>

                <div class="form-group">
                    <label>Distribution Specs</label>
                    <input v-model.trim="$v.instance.variables.metadata_distributionSpecs.$model" v-bind:class="{'is-invalid': $v.instance.variables.metadata_distributionSpecs.$error, 'form-control': editing, 'form-control-plaintext': !editing}" :readonly="!editing">
                    <p class="invalid-feedback" v-if="!$v.instance.variables.metadata_distributionSpecs.required">Field is required</p>
                </div>

                <div class="form-group">
                    <label>Publisher URI</label>
                    <input v-model.trim="$v.instance.variables.metadata_publisherURI.$model" v-bind:class="{'is-invalid': $v.instance.variables.metadata_publisherURI.$error, 'form-control': editing, 'form-control-plaintext': !editing}" :readonly="!editing">
                    <p class="invalid-feedback" v-if="!$v.instance.variables.metadata_publisherURI.required">Field is required</p>
                </div>

                <div class="form-group">
                    <label>Publisher Name</label>
                    <input v-model.trim="$v.instance.variables.metadata_publisherName.$model" v-bind:class="{'is-invalid': $v.instance.variables.metadata_publisherName.$error, 'form-control': editing, 'form-control-plaintext': !editing}" :readonly="!editing">
                    <p class="invalid-feedback" v-if="!$v.instance.variables.metadata_publisherName.required">Field is required</p>
                </div>

                <div class="form-group">
                    <label>Language</label>
                    <input v-model.trim="$v.instance.variables.metadata_language.$model" v-bind:class="{'is-invalid': $v.instance.variables.metadata_language.$error, 'form-control': editing, 'form-control-plaintext': !editing}" :readonly="!editing">
                    <p class="invalid-feedback" v-if="!$v.instance.variables.metadata_language.required">Field is required</p>
                </div>

                <div class="form-group">
                    <label>License</label>
                    <input v-model.trim="$v.instance.variables.metadata_license.$model" v-bind:class="{'is-invalid': $v.instance.variables.metadata_license.$error, 'form-control': editing, 'form-control-plaintext': !editing}" :readonly="!editing">
                    <p class="invalid-feedback" v-if="!$v.instance.variables.metadata_license.required">Field is required</p>
                </div>

                <div class="form-group">
                    <label>Access Rights Descritption</label>
                    <input v-model.trim="$v.instance.variables.metadata_accessRightsDescription.$model" v-bind:class="{'is-invalid': $v.instance.variables.metadata_accessRightsDescription.$error, 'form-control': editing, 'form-control-plaintext': !editing}" :readonly="!editing">
                    <p class="invalid-feedback" v-if="!$v.instance.variables.metadata_accessRightsDescription.required">Field is required</p>
                </div>

                <h2>FAIR Search</h2>

                <div class="form-group">
                    <label>FDP Submit URL</label>
                    <input v-model.trim="$v.instance.variables.fairSearch_fdpSubmitUrl.$model" v-bind:class="{'is-invalid': $v.instance.variables.fairSearch_fdpSubmitUrl.$error, 'form-control': editing, 'form-control-plaintext': !editing}" :readonly="!editing">
                    <p class="invalid-feedback" v-if="!$v.instance.variables.fairSearch_fdpSubmitUrl.required">Field is required</p>
                </div>

                <h2>PID System</h2>

                <div class="form-group">
                    <label>Type</label>
                    <select v-model="instance.variables.pidSystem_type" v-bind:class="{'form-control': editing, 'form-control-plaintext': !editing}" :disabled="!editing">
                        <option v-bind:value="1">Default</option>
                        <option v-bind:value="2">purl.org</option>
                    </select>
                </div>

                <div class="form-group" v-if="instance.variables.pidSystem_type === 2">
                    <label>PURL Base URL</label>
                    <input v-model.trim="$v.instance.variables.pidSystem_purl_baseUrl.$model" v-bind:class="{'is-invalid': $v.instance.variables.pidSystem_purl_baseUrl.$error, 'form-control': editing, 'form-control-plaintext': !editing}" :readonly="!editing">
                    <p class="invalid-feedback" v-if="!$v.instance.variables.pidSystem_purl_baseUrl.required">Field is required</p>
                </div>

                <h2>SCSS</h2>

                <div class="form-group">
                    <label>Customizations</label>
                    <prism-editor v-model="instance.variables.scss_customizations" language="scss" :readonly="!editing"></prism-editor>
                </div>

                <div class="form-group">
                    <label>Extra Styles</label>
                    <prism-editor v-model="instance.variables.scss_extra" language="scss" :readonly="!editing"></prism-editor>
                </div>

                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import PrismEditor from 'vue-prism-editor'

import { getInstance, putInstance, deployInstance, deleteInstance, cloneInstance } from '../api'

export default {
  name: 'InstanceDetail',

  components: {
      PrismEditor
  },

  mixins: [validationMixin],

  validations() {
      return {
        instance: {
            name: { required },
            url: { required },
            path: { required },
            variables: {
                server_port: { required },
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
          error: null,
          editing: false,
          submitStatus: null,
          deployStatus: null,
          deleteStatus: null,
          cloneStatus: null
      }
  },

  created() {
      this.fetchData()
  },

  watch: {
      '$route': 'fetchData'
  },

  methods: {
      fetchData() {
          this.error = this.instance = null
          this.loading = true
          this.error = null

          getInstance(this.$route.params.id)
            .then(response => {
                this.instance = response.data
                this.instanceName = this.instance.name
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
          this.deployStatus = 'PENDING';

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

<style scoped>
#instance-detail {
    margin-top: 3rem;
    margin-bottom: 10rem;
}

.actions {
    text-align: right;
}

.actions .btn, .actions .btn-group {
    padding: .375rem 1rem;
    margin-left: .5rem;
}

label {
    font-weight: bold;
}

.form-control-plaintext {
    outline: none;
    padding: 0.375rem 0.75rem;
    background: #f5f2f0;
    font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
}

select.form-control-plaintext {
    -moz-appearance: none;
    -webkit-appearance: none;
}

select.form-control-plaintext::-ms-expand {
    display: none;
}

.header {
    position: fixed;
    left: 0;
    top: 56px;
    right: 0;
    padding: 0.5rem 0;
    background: white;
    border-bottom: 1px solid #ddd;
    z-index: 5;
}

.header .btn-group {
    padding: 0 !important;
}
</style>