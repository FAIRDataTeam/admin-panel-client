<template>
  <div v-if="data">
    <div v-if="data.length > 0">
      <table class="table table-hover">
        <thead>
          <tr>
            <slot name="header" />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in orderBy(data, 'name')"
            :key="row.uuid"
          >
            <slot
              name="row"
              v-bind="row"
            />
          </tr>
        </tbody>
      </table>
    </div>
    <div
      v-if="data.length === 0"
      class="alert alert-light"
    >
      <slot name="empty" />
    </div>
  </div>
</template>
<script>
import _ from 'lodash'

export default {
  name: 'ListTable',

  props: {
    data: {
      validator: (prop) => Array.isArray(prop) || prop == null,
      required: true,
    },
  },

  methods: {
    orderBy(list, prop) {
      return _.orderBy(list, prop)
    },
  },
}
</script>
