<template>
  <div>
    <list-header
      title="Users"
      create-link="/users/create"
    />

    <status-flash
      :status="status"
      :no-loading="data !== null"
    />

    <list-table :data="data">
      <template v-slot:header>
        <th>User</th>
        <th class="desktop-only">
          Email
        </th>
        <th />
      </template>

      <template v-slot:row="user">
        <td>
          <router-link :to="`/users/${user.uuid}`">
            {{ user.name }}
          </router-link>
        </td>
        <td class="desktop-only">
          {{ user.email }}
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
            <b-dropdown-item @click="$router.replace(`/users/${user.uuid}`)">
              <fa :icon="['far', 'file-alt']" />
              View detail
            </b-dropdown-item>
            <b-dropdown-divider />
            <b-dropdown-item
              class="dropdown-item-danger"
              @click="remove(user)"
            >
              <fa :icon="['far', 'trash-alt']" />
              Remove
            </b-dropdown-item>
          </b-dropdown>
        </td>
      </template>

      <template v-slot:empty>
        There are no users, you can
        <router-link to="/users/create">
          create
        </router-link>
        a new one.
      </template>
    </list-table>
  </div>
</template>

<script>
import api from '../api'
import ListHeader from '../components/list/ListHeader'
import ListTable from '../components/list/ListTable'
import fetchData from '../mixins/list/fetchData'
import removeData from '../mixins/list/removeData'

export default {
  name: 'UserList',
  components: {
    ListHeader,
    ListTable
  },
  mixins: [
    fetchData,
    removeData
  ],
  methods: {
    getData: api.users.getUsers,
    deleteData: api.users.deleteUser
  }
}
</script>