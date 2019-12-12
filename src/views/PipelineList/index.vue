<template>
  <div>
    <list-header title="Pipelines">
      <template v-slot:actions>
        <b-dropdown
          right
          variant="outline-secondary"
        >
          <b-dropdown-item
            class="dropdown-item-danger"
            @click="removeAll"
          >
            <fa :icon="['fas', 'dumpster-fire']" />
            Remove all
          </b-dropdown-item>
        </b-dropdown>
      </template>
    </list-header>

    <status-flash
      :status="status"
      :no-loading="data !== null"
    />

    <list-table :data="data">
      <template v-slot:header>
        <th>Pipeline</th>
        <th class="desktop-only">
          Created
        </th>
        <th class="desktop-only text-center">
          Duration
        </th>
        <th class="desktop-only text-center">
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
        <td class="desktop-only text-black-50">
          {{ pipeline.created | formatDateTime }}
        </td>
        <td class="desktop-only text-center text-black-50">
          {{ pipeline.duration | formatDuration }}
        </td>
        <td class="text-center">
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
import _ from 'lodash'
import moment from 'moment'
import api from '../../api'
import InlineLoader from '../../components/InlineLoader/index'
import ListHeader from '../../components/ListHeader/index'
import ListTable from '../../components/ListTable/index'
import PipelineStatus from '../../components/PipelineStatus/index'
import fetchData from '../../mixins/list/fetchData'
import removeData from '../../mixins/list/removeData'
import pipelines from '../../utils/pipelines'

export default {
  name: 'PipelinesList',
  components: { InlineLoader, PipelineStatus, ListTable, ListHeader },
  mixins: [
    fetchData,
    removeData
  ],
  methods: {
    getData: api.pipelines.getPipelines,
    getName: pipelines.pipelineTitle,
    deleteData: api.pipelines.deletePipeline,
    pipelineTitle: pipelines.pipelineTitle,
    sortData(data) {
      return _.sortBy(data, [(row) => -moment(row.created).unix()])
    },
    async removeAll() {
      if (window.confirm('Are you sure you want to remove all pipelines?')) {
        try {
          await api.pipelines.deleteAllPipelines()
          await this.fetchData()
          this.status.setDone('All pipelines has been successfully removed.')
        } catch (error) {
          this.status.setError('Unable to remove all pipelines.')
        }
      }
    }
  }
}
</script>