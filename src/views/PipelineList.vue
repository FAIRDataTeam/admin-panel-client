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
        <th />
      </template>

      <template v-slot:row="pipeline">
        <td>
          <inline-loader v-if="isLoading(pipeline.uuid)" />
          <router-link :to="`/pipelines/${pipeline.uuid}`">
            {{ pipelineTitle(pipeline) }}
          </router-link>
        </td>
        <td>
          <PipelineStatus :status="pipeline.status" />
        </td>
        <td class="text-right">
          <b-dropdown
            text="Actions"
            right
            variant="link"
            no-caret
          >
            <template v-slot:button-content>
              <fa :icon="['fas', 'ellipsis-v']" />
            </template>
            <b-dropdown-item :to="`/pipelines/${pipeline.uuid}`">
              <fa :icon="['far', 'file-alt']" />
              View detail
            </b-dropdown-item>
            <b-dropdown-divider />
            <b-dropdown-item
              class="dropdown-item-danger"
              @click="remove(pipeline)"
            >
              <fa :icon="['far', 'trash-alt']" />
              Remove
            </b-dropdown-item>
          </b-dropdown>
        </td>
      </template>

      <template v-slot:empty>
        There are no pipelines.
      </template>
    </list-table>
  </div>
</template>
<script>
import api from '../api'
import InlineLoader from '../components/list/InlineLoader'
import ListHeader from '../components/list/ListHeader'
import ListTable from '../components/list/ListTable'
import PipelineStatus from '../components/PipelineStatus'
import fetchData from '../mixins/list/fetchData'
import removeData from '../mixins/list/removeData'
import pipelines from '../utils/pipelines'

export default {
  name: 'PipelinesList',
  components: { InlineLoader, PipelineStatus, ListTable, ListHeader },
  mixins: [
    fetchData,
    removeData
  ],
  methods: {
    getData: api.pipelines.getPipelines,
    deleteData: api.pipelines.deletePipeline,
    getName: pipelines.pipelineTitle,
    pipelineTitle: pipelines.pipelineTitle
  }
}
</script>