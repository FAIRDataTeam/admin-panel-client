<template>
  <div>
    <list-header
      title="Applications"
      create-link="/applications/create"
    />

    <status-flash
      :status="status"
      :no-loading="data !== null"
    />

    <list-table :data="data">
      <template v-slot:header>
        <th>Application</th>
        <th />
      </template>

      <template v-slot:row="application">
        <td>
          <router-link :to="`/applications/${application.uuid}`">
            {{ application.name }}
          </router-link>
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
            <b-dropdown-item @click="$router.replace(`/applications/${application.uuid}`)">
              <fa :icon="['far', 'file-alt']" />
              View detail
            </b-dropdown-item>
            <b-dropdown-item @click="makeCopy(application)">
              <fa :icon="['far', 'copy']" />
              Make a copy
            </b-dropdown-item>
            <b-dropdown-divider />
            <b-dropdown-item
              class="dropdown-item-danger"
              @click="remove(application)"
            >
              <fa :icon="['far', 'trash-alt']" />
              Remove
            </b-dropdown-item>
          </b-dropdown>
        </td>
      </template>

      <template v-slot:empty>
        There are no applications, you can
        <router-link to="/applications/create">
          create
        </router-link>
        a new one.
      </template>
    </list-table>
  </div>
</template>
<script>
import { cloneApplication, deleteApplication, getApplications } from '../api'
import ListHeader from '../components/list/ListHeader'
import ListTable from '../components/list/ListTable'
import cloneData from '../mixins/list/cloneData'
import fetchData from '../mixins/list/fetchData'
import removeData from '../mixins/list/removeData'

export default {
  name: 'ApplicationList',
  components: {
    ListHeader,
    ListTable
  },
  mixins: [
    fetchData,
    removeData,
    cloneData
  ],
  methods: {
    getData: getApplications,
    deleteData: deleteApplication,
    cloneData: cloneApplication
  }
}
</script>
