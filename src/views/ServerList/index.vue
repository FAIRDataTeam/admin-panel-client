<template>
  <div>
    <list-header
      title="Servers"
      create-link="/servers/create"
    />

    <status-flash
      :status="status"
      :no-loading="data !== null"
    />

    <list-table :data="data">
      <template v-slot:header>
        <th>Server</th>
        <th class="desktop-only">
          Username
        </th>
        <th class="desktop-only">
          Hostname
        </th>
        <th />
      </template>

      <template v-slot:row="server">
        <td>
          <inline-loader v-if="isLoading(server.uuid)" />
          <router-link :to="`/servers/${server.uuid}`">
            {{ server.name }}
          </router-link>
        </td>
        <td class="desktop-only">
          {{ server.username }}
        </td>
        <td class="desktop-only">
          {{ server.hostname }}
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
            <b-dropdown-item @click="$router.replace(`/servers/${server.uuid}`)">
              <fa :icon="['far', 'file-alt']" />
              View detail
            </b-dropdown-item>
            <b-dropdown-divider />
            <b-dropdown-item
              class="dropdown-item-danger"
              @click="remove(server)"
            >
              <fa :icon="['far', 'trash-alt']" />
              Remove
            </b-dropdown-item>
          </b-dropdown>
        </td>
      </template>

      <template v-slot:empty>
        There are no servers, you can
        <router-link to="/servers/create">
          create
        </router-link>
        a new one.
      </template>
    </list-table>
  </div>
</template>

<script>
import api from '../../api'
import InlineLoader from '../../components/InlineLoader'
import ListHeader from '../../components/ListHeader'
import ListTable from '../../components/ListTable'
import fetchData from '../../mixins/list/fetchData'
import removeData from '../../mixins/list/removeData'

export default {
  name: 'ServerList',
  components: {
    InlineLoader,
    ListHeader,
    ListTable,
  },
  mixins: [
    fetchData,
    removeData,
  ],
  methods: {
    getData: api.servers.getServers,
    deleteData: api.servers.deleteServer,
  },
}
</script>
