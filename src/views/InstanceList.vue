<template>
  <div id="instances">
    <list-header
      title="Instances"
      create-link="/instances/create"
    />

    <status-flash
      :status="status"
      :no-loading="data !== null"
    />

    <list-table :data="data">
      <template v-slot:header>
        <th>Instance</th>
        <th class="desktop-only">
          URL
        </th>
        <th class="desktop-only">
          Status
        </th>
        <th class="mobile-only" />
        <th />
      </template>

      <template v-slot:row="instance">
        <td>
          <router-link :to="`/instances/${instance.uuid}`">
            {{ instance.name }}
          </router-link>
        </td>
        <td class="desktop-only">
          <a
            class="link-muted"
            :href="instance.url"
            target="_blank"
          >{{ instance.url }}</a>
        </td>
        <td>
          <instance-status :status="instance.status" />
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
            <b-dropdown-item @click="$router.replace(`/instances/${instance.uuid}`)">
              <fa :icon="['far', 'file-alt']" />
              View detail
            </b-dropdown-item>
            <b-dropdown-item @click="makeCopy(instance)">
              <fa :icon="['far', 'copy']" />
              Make a copy
            </b-dropdown-item>
            <b-dropdown-divider />
            <b-dropdown-item
              class="dropdown-item-danger"
              @click="remove(instance)"
            >
              <fa :icon="['far', 'trash-alt']" />
              Remove
            </b-dropdown-item>
          </b-dropdown>
        </td>
      </template>

      <template v-slot:empty>
        There are no instances, you can
        <router-link to="/instances/create">
          create
        </router-link>
        a new one.
      </template>
    </list-table>
  </div>
</template>

<script>
import { getInstances, deleteInstance, cloneInstance } from '../api'
import InstanceStatus from '../components/InstanceStatus'
import ListHeader from '../components/list/ListHeader'
import ListTable from '../components/list/ListTable'
import cloneData from '../mixins/list/cloneData'
import fetchData from '../mixins/list/fetchData'
import removeData from '../mixins/list/removeData'

export default {
  name: 'InstanceList',
  components: {
    ListHeader,
    ListTable,
    InstanceStatus
  },
  mixins: [
    fetchData,
    removeData,
    cloneData
  ],
  methods: {
    getData: getInstances,
    deleteData: deleteInstance,
    cloneData: cloneInstance
  }
}
</script>
