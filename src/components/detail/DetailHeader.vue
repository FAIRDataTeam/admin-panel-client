<template>
  <div class="header">
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

<style scoped>
.header {
  position: fixed;
  left: 0;
  right: 0;
  top: 56px;
  padding: 0.5rem 0;
  background: white;
  border-bottom: 1px solid #ddd;
  z-index: 5;
}

.header .btn-group {
  padding: 0 !important;
}

.header strong {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header .actions {
  text-align: right;
  white-space: nowrap;
}

.actions .btn {
  padding: .375rem 1rem;
  margin-left: 1rem;
}

.actions .btn-group {
  margin-left: 1rem;
}
</style>