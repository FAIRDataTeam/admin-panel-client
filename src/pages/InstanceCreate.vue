<template>
    <div id="instance">
        <div v-if="error" class="alert alert-danger">{{ error }}</div>

        <div>
            <h1>Create Instance</h1>

            <div class="actions">
                <button class="btn btn-primary" v-on:click="submit" :disabled="submitStatus === 'PENDING'">Save</button>
            </div>
            <div>
                <form @submit.prevent="submit">
                <div class="form-group">
                    <label>Name</label>
                    <input class="form-control" v-model.trim="$v.instance.name.$model" v-bind:class="{'is-invalid': $v.instance.name.$error}">
                    <p class="invalid-feedback" v-if="!$v.instance.name.required">Field is required</p>
                </div>

                <div class="form-group">
                    <label>URL</label>
                    <input class="form-control" v-model.trim="$v.instance.url.$model" v-bind:class="{'is-invalid': $v.instance.url.$error}">
                    <p class="invalid-feedback" v-if="!$v.instance.url.required">Field is required</p>
                </div>

                <div class="form-group">
                    <label>Path</label>
                    <input class="form-control" v-model.trim="$v.instance.path.$model" v-bind:class="{'is-invalid': $v.instance.path.$error}">
                    <p class="invalid-feedback" v-if="!$v.instance.path.required">Field is required</p>
                </div>

                <div class="form-group">
                    <label>Server Port</label>
                    <input class="form-control" v-model.trim="$v.instance.variables.server_port.$model" v-bind:class="{'is-invalid': $v.instance.variables.server_port.$error}">
                    <p class="invalid-feedback" v-if="!$v.instance.variables.server_port.required">Field is required</p>
                </div>

                <div class="form-group">
                    <label>JWT Secret</label>
                    <input class="form-control" v-model.trim="$v.instance.variables.jwt_secret.$model" v-bind:class="{'is-invalid': $v.instance.variables.jwt_secret.$error}">
                    <p class="invalid-feedback" v-if="!$v.instance.variables.jwt_secret.required">Field is required</p>
                </div>

                <h2>Repository</h2>

                <div class="form-group">
                    <label>Type</label>
                    <select class="form-control" v-model="instance.variables.repository_type">
                        <option v-bind:value="1">In Memory Store</option>
                        <option v-bind:value="2">Native Store</option>
                        <option v-bind:value="3">AllegroGraph</option>
                        <option v-bind:value="4">GraphDB</option>
                        <option v-bind:value="5">Blazegraph</option>
                    </select>
                </div>

                <div class="form-group" v-if="instance.variables.repository_type === 2">
                    <label>Native Directory</label>
                    <input class="form-control" v-model.trim="$v.instance.variables.repository_native_dir.$model" v-bind:class="{'is-invalid': $v.instance.variables.repository_native_dir.$error}">
                    <p class="invalid-feedback" v-if="!$v.instance.variables.repository_native_dir.required">Field is required</p>
                </div>

                <div class="form-group" v-if="instance.variables.repository_type === 3">
                    <label>AllegroGraph URL</label>
                    <input class="form-control" v-model.trim="$v.instance.variables.repository_agraph_url.$model" v-bind:class="{'is-invalid': $v.instance.variables.repository_agraph_url.$error}">
                    <p class="invalid-feedback" v-if="!$v.instance.variables.repository_agraph_url.required">Field is required</p>
                </div>

                <div class="form-group" v-if="instance.variables.repository_type === 3">
                    <label>AllegroGraph Password</label>
                    <input class="form-control" v-model.trim="$v.instance.variables.repository_agraph_password.$model" v-bind:class="{'is-invalid': $v.instance.variables.repository_agraph_password.$error}">
                    <p class="invalid-feedback" v-if="!$v.instance.variables.repository_agraph_password.required">Field is required</p>
                </div>

                <div class="form-group" v-if="instance.variables.repository_type === 4">
                    <label>GraphDB URL</label>
                    <input class="form-control" v-model.trim="$v.instance.variables.repository_graphDb_url.$model" v-bind:class="{'is-invalid': $v.instance.variables.repository_graphDb_url.$error}">
                    <p class="invalid-feedback" v-if="!$v.instance.variables.repository_graphDb_url.required">Field is required</p>
                </div>

                <div class="form-group" v-if="instance.variables.repository_type === 4">
                    <label>GraphDB Repository</label>
                    <input class="form-control" v-model.trim="$v.instance.variables.repository_graphDb_repository.$model" v-bind:class="{'is-invalid': $v.instance.variables.repository_graphDb_repository.$error}">
                    <p class="invalid-feedback" v-if="!$v.instance.variables.repository_graphDb_repository.required">Field is required</p>
                </div>

                <div class="form-group" v-if="instance.variables.repository_type === 5">
                    <label>Blazegraph Repository</label>
                    <input class="form-control" v-model.trim="$v.instance.variables.repository_blazegraph_repository.$model" v-bind:class="{'is-invalid': $v.instance.variables.repository_blazegraph_repository.$error}">
                    <p class="invalid-feedback" v-if="!$v.instance.variables.repository_blazegraph_repository.required">Field is required</p>
                </div>

                <div class="form-group" v-if="instance.variables.repository_type === 5">
                    <label>Blazegraph Repository</label>
                    <input class="form-control" v-model.trim="$v.instance.variables.repository_blazegraph_url.$model" v-bind:class="{'is-invalid': $v.instance.variables.repository_blazegraph_url.$error}">
                    <p class="invalid-feedback" v-if="!$v.instance.variables.repository_blazegraph_url.required">Field is required</p>
                </div>


                <h2>Metadata</h2>

                <div class="form-group">
                    <label>Root Specs</label>
                    <input class="form-control" v-model.trim="$v.instance.variables.metadata_rootSpecs.$model" v-bind:class="{'is-invalid': $v.instance.variables.metadata_rootSpecs.$error}">
                    <p class="invalid-feedback" v-if="!$v.instance.variables.metadata_rootSpecs.required">Field is required</p>
                </div>

                <div class="form-group">
                    <label>Catalog Specs</label>
                    <input class="form-control" v-model.trim="$v.instance.variables.metadata_catalogSpecs.$model" v-bind:class="{'is-invalid': $v.instance.variables.metadata_catalogSpecs.$error}">
                    <p class="invalid-feedback" v-if="!$v.instance.variables.metadata_catalogSpecs.required">Field is required</p>
                </div>

                <div class="form-group">
                    <label>Dataset Specs</label>
                    <input class="form-control" v-model.trim="$v.instance.variables.metadata_datasetSpecs.$model" v-bind:class="{'is-invalid': $v.instance.variables.metadata_datasetSpecs.$error}">
                    <p class="invalid-feedback" v-if="!$v.instance.variables.metadata_datasetSpecs.required">Field is required</p>
                </div>

                <div class="form-group">
                    <label>Distribution Specs</label>
                    <input class="form-control" v-model.trim="$v.instance.variables.metadata_distributionSpecs.$model" v-bind:class="{'is-invalid': $v.instance.variables.metadata_distributionSpecs.$error}">
                    <p class="invalid-feedback" v-if="!$v.instance.variables.metadata_distributionSpecs.required">Field is required</p>
                </div>

                <div class="form-group">
                    <label>Publisher URI</label>
                    <input class="form-control" v-model.trim="$v.instance.variables.metadata_publisherURI.$model" v-bind:class="{'is-invalid': $v.instance.variables.metadata_publisherURI.$error}">
                    <p class="invalid-feedback" v-if="!$v.instance.variables.metadata_publisherURI.required">Field is required</p>
                </div>

                <div class="form-group">
                    <label>Publisher Name</label>
                    <input class="form-control" v-model.trim="$v.instance.variables.metadata_publisherName.$model" v-bind:class="{'is-invalid': $v.instance.variables.metadata_publisherName.$error}">
                    <p class="invalid-feedback" v-if="!$v.instance.variables.metadata_publisherName.required">Field is required</p>
                </div>

                <div class="form-group">
                    <label>Language</label>
                    <input class="form-control" v-model.trim="$v.instance.variables.metadata_language.$model" v-bind:class="{'is-invalid': $v.instance.variables.metadata_language.$error}">
                    <p class="invalid-feedback" v-if="!$v.instance.variables.metadata_language.required">Field is required</p>
                </div>

                <div class="form-group">
                    <label>License</label>
                    <input class="form-control" v-model.trim="$v.instance.variables.metadata_license.$model" v-bind:class="{'is-invalid': $v.instance.variables.metadata_license.$error}">
                    <p class="invalid-feedback" v-if="!$v.instance.variables.metadata_license.required">Field is required</p>
                </div>

                <div class="form-group">
                    <label>Access Rights Descritption</label>
                    <input class="form-control" v-model.trim="$v.instance.variables.metadata_accessRightsDescription.$model" v-bind:class="{'is-invalid': $v.instance.variables.metadata_accessRightsDescription.$error}">
                    <p class="invalid-feedback" v-if="!$v.instance.variables.metadata_accessRightsDescription.required">Field is required</p>
                </div>

                <h2>FAIR Search</h2>

                <div class="form-group">
                    <label>FDP Submit URL</label>
                    <input class="form-control" v-model.trim="$v.instance.variables.fairSearch_fdpSubmitUrl.$model" v-bind:class="{'is-invalid': $v.instance.variables.fairSearch_fdpSubmitUrl.$error}">
                    <p class="invalid-feedback" v-if="!$v.instance.variables.fairSearch_fdpSubmitUrl.required">Field is required</p>
                </div>

                <h2>PID System</h2>

                <div class="form-group">
                    <label>Type</label>
                    <select class="form-control" v-model="instance.variables.pidSystem_type">
                        <option v-bind:value="1">Default</option>
                        <option v-bind:value="2">purl.org</option>
                    </select>
                </div>

                <div class="form-group" v-if="instance.variables.pidSystem_type === 2">
                    <label>PURL Base URL</label>
                    <input class="form-control" v-model.trim="$v.instance.variables.pidSystem_purl_baseUrl.$model" v-bind:class="{'is-invalid': $v.instance.variables.pidSystem_purl_baseUrl.$error}">
                    <p class="invalid-feedback" v-if="!$v.instance.variables.pidSystem_purl_baseUrl.required">Field is required</p>
                </div>

                <h2>SCSS</h2>

                <div class="form-group">
                    <label>Customizations</label>
                    <prism-editor v-model="instance.variables.scss_customizations" language="scss"></prism-editor>
                </div>

                <div class="form-group">
                    <label>Extra Styles</label>
                    <prism-editor v-model="instance.variables.scss_extra" language="scss"></prism-editor>
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

import { postInstance } from '../api'

export default {
  name: 'Instance',

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
                pidSystem_type: { required },
                pidSystem_purl_baseUrl: this.instance.variables.pidSystem_type === 2 ? { required } : {},
            }
        }
      }
  },

  data() {
      return {
          instance: {
              name: '',
              url: '',
              path: '',
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

  methods: {
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

<style scoped>
#instance {
    margin-bottom: 10rem;
}

.actions {
    text-align: right;
}

.actions .btn {
    padding: .375rem 1rem;
    margin-left: 1rem;
}

label {
    font-weight: bold;
}
</style>