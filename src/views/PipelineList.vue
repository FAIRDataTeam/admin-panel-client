<template>
  <div>
    <list-header
      title="Pipelines"
    />

    <status-flash
      :status="status"
      :no-loading="data !== null"
    />

    <list-table :data="data">
      <template v-slot:header>
        <th>Pipeline</th>
        <th class="desktop-only">
          Status
        </th>
        <th class="mobile-only" />
      </template>

      <template v-slot:row="pipeline">
        <td>
          <router-link :to="`/pipelines/${pipeline.uuid}`">
            {{ pipelineTitle(pipeline) }}
          </router-link>
        </td>
        <td>
          <PipelineStatus :status="pipeline.status" />
        </td>
      </template>
    </list-table>
  </div>
</template>
<script>
import api from '../api'
import ListHeader from '../components/list/ListHeader'
import ListTable from '../components/list/ListTable'
import PipelineStatus from '../components/PipelineStatus'
import fetchData from '../mixins/list/fetchData'
import pipelines from '../utils/pipelines'

export default {
  name: 'PipelinesList',
  components: { PipelineStatus, ListTable, ListHeader },
  mixins: [
    fetchData
  ],
  methods: {
    getData: api.pipelines.getPipelines,
    pipelineTitle: pipelines.pipelineTitle
  }
}
</script>