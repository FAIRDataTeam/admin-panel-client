<template>
  <span>
    <span
      v-if="status === 'RUNNING'"
      class="badge badge-pill badge-success"
    >
      <template v-if="mobile">
        <fa :icon="['fas', 'check']" />
      </template>
      <template v-else>
        RUNNING
      </template>
    </span>
    <span
      v-if="status === 'ERROR'"
      class="badge badge-pill badge-danger"
    >
      <template v-if="mobile">
        <fa :icon="['fas', 'exclamation-triangle']" />
      </template>
      <template v-else>
        ERROR
      </template>
    </span>
    <span
      v-if="status === 'NOT_DEPLOYED'"
      class="badge badge-pill badge-secondary"
    >
      <template v-if="mobile">
        <fa :icon="['fas', 'ban']" />
      </template>
      <template v-else>
        NOT DEPLOYED
      </template>
    </span>
  </span>
</template>
<script>
export default {
  name: 'InstanceStatus',
  props: {
    status: {
      type: String,
      required: true
    },
    mobile: {
      type: Boolean,
      default: false
    }
  }
}

</script>