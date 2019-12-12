<template>
  <div class="detail-header">
    <div class="container d-flex justify-content-between align-items-center">
      <strong>{{ title }}</strong>
      <div class="actions">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DetailHeader',
  props: {
    title: {
      type: String,
      required: true
    }
  }
}
</script>
