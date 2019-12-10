<template>
  <div class="detail-page">
    <detail-header
      v-if="data"
      :title="pipelineTitle(data)"
    >
      <PipelineStatus :status="data.status" />
    </detail-header>
    <prism-editor
      v-if="data"
      v-model="data.log"
      language="none"
      :readonly="true"
    />
  </div>
</template>
<script>
import api from '../api'
import DetailHeader from '../components/detail/DetailHeader'
import PipelineStatus from '../components/PipelineStatus'
import PrismEditor from 'vue-prism-editor'
import fetchData from '../mixins/detail/fetchData'
import pipelines from '../utils/pipelines'

export default {
  name: 'PipelineDetail',
  components: {
    DetailHeader,
    PipelineStatus,
    PrismEditor,
  },
  mixins: [
    fetchData
  ],
  methods: {
    getData: api.pipelines.getPipeline,
    pipelineTitle: pipelines.pipelineTitle
  }
}
</script>