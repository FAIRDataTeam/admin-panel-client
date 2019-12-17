<template>
  <div class="detail-page">
    <detail-header
      v-if="data"
      :title="dataName"
    >
      <button
        v-if="editing"
        class="btn btn-outline-primary"
        :disabled="status.isPending()"
        @click="$refs.form.submit()"
      >
        <fa :icon="['far', 'save']" />
        <span class="desktop-only">
          Save
        </span>
      </button>
      <button
        v-if="editing"
        class="btn btn-outline-secondary"
        :disabled="status.isPending()"
        @click="cancelEdit"
      >
        <fa :icon="['fas', 'ban']" />
        <span class="desktop-only">
          Cancel
        </span>
      </button>

      <b-dropdown
        v-if="!editing"
        split
        right
        variant="outline-secondary"
        :disabled="status.isPending()"
        @click="edit"
      >
        <template v-slot:button-content>
          <fa :icon="['fas', 'pen']" />
          <span class="desktop-only">
            Edit
          </span>
        </template>
        <b-dropdown-item
          :disabled="status.isPending()"
          @click="makeCopy"
        >
          <fa :icon="['far', 'copy']" />
          Make a copy
        </b-dropdown-item>
        <b-dropdown-divider />
        <b-dropdown-item
          :disabled="status.isPending()"
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

    <application-form
      v-if="data"
      ref="form"
      :data="data"
      :editing="editing"
      :on-submit="submit"
    />
  </div>
</template>

<script>
import api from '../../api'
import ApplicationForm from '../../components/ApplicationForm/index'
import DetailHeader from '../../components/DetailHeader/index'
import cloneData from '../../mixins/detail/cloneData'
import editableData from '../../mixins/detail/editableData'
import fetchData from '../../mixins/detail/fetchData'
import removeData from '../../mixins/detail/removeData'

export default {
  name: 'ApplicationDetail',
  components: {
    ApplicationForm,
    DetailHeader,
  },
  mixins: [
    fetchData,
    editableData,
    removeData,
    cloneData,
  ],
  methods: {
    getData: api.applications.getApplication,
    putData: api.applications.putApplication,
    deleteData: api.applications.deleteApplication,
    cloneData: api.applications.cloneApplication,
    removeRedirectLocation: () => '/applications',
    cloneRedirectLocation: id => `/applications/${id}`,
  }
}
</script>
