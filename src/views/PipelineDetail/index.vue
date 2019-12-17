<template>
  <div class="detail-page">
    <detail-header
      v-if="data"
      :title="pipelineTitle(data)"
    >
      <pipeline-status :status="data.status" />
      <b-dropdown
        right
        variant="outline-secondary"
      >
        <b-dropdown-item
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
      no-loading
    />

    <div v-if="data">
      <dl>
        <dt>Created</dt>
        <dd class="mb-4">
          {{ data.created | formatDateTime }}
        </dd>
        <dt>Duration</dt>
        <dd class="mb-4">
          {{ data.duration | formatDuration }}
        </dd>
        <dt>Log</dt>
        <dd>
          <prism-editor
            v-model="data.log"
            language="none"
            :readonly="true"
          />
        </dd>
      </dl>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import PrismEditor from 'vue-prism-editor'
import api from '../../api'
import DetailHeader from '../../components/DetailHeader'
import PipelineStatus from '../../components/PipelineStatus'
import fetchData from '../../mixins/detail/fetchData'
import removeData from '../../mixins/detail/removeData'
import pipelines from '../../utils/pipelines'

export default {
  name: 'PipelineDetail',
  components: {
    DetailHeader,
    PipelineStatus,
    PrismEditor,
  },
  mixins: [
    fetchData,
    removeData,
  ],
  methods: {
    getName: pipelines.pipelineTitle,
    getData: api.pipelines.getPipeline,
    deleteData: api.pipelines.deletePipeline,
    removeRedirectLocation: () => '/pipelines',
    pipelineTitle: pipelines.pipelineTitle,

    async fetchData() {
      try {
        this.status.setPending()
        const response = await this.getData(this.$route.params.id)
        this.data = response.data
        this.dataName = this.data.name
        this.status.setDone()

        if (this.data.status === 'QUEUED' || this.data.status === 'RUNNING') {
          pipelines.awaitPipeline(this.data.uuid, () => {}, () => {}, (data) => {
            this.data = data
          })
        }
      } catch (error) {
        const msg = _.get(error, 'response.data.message', 'Unable to load data.')
        this.status.setError(msg)
      }
    },
  },
}
</script>
