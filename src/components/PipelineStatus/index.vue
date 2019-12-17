<template>
  <span
    class="badge badge-pill"
    :class="{
      'badge-secondary': status === 'QUEUED',
      'badge-info': status === 'RUNNING',
      'badge-success': status === 'DONE',
      'badge-danger': status === 'ERROR'
    }"
  >
    <template v-if="status === 'QUEUED'">
      <fa
        :icon="['fas', 'hourglass-half']"
        class="mobile-only"
      />
      <span class="desktop-only">QUEUED</span>
    </template>
    <template v-if="status === 'RUNNING'">
      <fa
        :icon="['fas', 'spinner']"
        spin
        class="mobile-only"
      />
      <span class="desktop-only">RUNNING</span>
    </template>
    <template v-if="status === 'DONE'">
      <fa
        :icon="['fas', 'check']"
        class="mobile-only"
      />
      <span class="desktop-only">DONE</span>
    </template>
    <template v-if="status === 'ERROR'">
      <fa
        :icon="['fas', 'exclamation-triangle']"
        class="mobile-only"
      />
      <span class="desktop-only">ERROR</span>
    </template>
  </span>
</template>
<script>
export default {
  name: 'PipelineStatus',
  props: {
    status: {
      type: String,
      required: true,
    },
  },
}
</script>
