<template>
  <div
    v-if="!status.isDefault()"
    :class="{
      'loader': status.isPending() && !noLoading,
      'alert alert-danger': status.isError(),
      'alert alert-success': status.isSuccess()
    }"
  >
    <template v-if="status.isPending() && !noLoading">
      <fa
        :icon="['fas', 'spinner']"
        spin
      />
      Loading...
    </template>
    <template v-if="status.message">
      {{ status.message }}
    </template>
  </div>
</template>
<script>
import Status from '../../utils/Status'

export default {
  name: 'StatusFlash',

  props: {
    status: {
      type: Status,
      required: true
    },
    noLoading: {
      type: Boolean,
      default: false
    }
  }
}
</script>
