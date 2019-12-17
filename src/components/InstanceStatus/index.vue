<template>
  <span
    class="badge badge-pill"
    :class="{
      'badge-success': status === 'RUNNING',
      'badge-danger': status === 'ERROR',
      'badge-secondary': status === 'NOT_RUNNING'
    }"
  >
    <template v-if="status === 'RUNNING'">
      <fa
        :icon="['fas', 'check']"
        class="mobile-only"
      />
      <span class="desktop-only">RUNNING</span>
    </template>
    <template v-if="status === 'ERROR'">
      <fa
        :icon="['fas', 'exclamation-triangle']"
        class="mobile-only"
      />
      <span class="desktop-only">ERROR</span>
    </template>
    <template v-if="status === 'NOT_RUNNING'">
      <fa
        :icon="['fas', 'ban']"
        class="mobile-only"
      />
      <span class="desktop-only">NOT RUNNING</span>
    </template>
  </span>
</template>
<script>
export default {
  name: 'InstanceStatus',
  props: {
    status: {
      type: String,
      required: true,
    },
  },
}
</script>
