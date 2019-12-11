<template>
  <div class="d-flex justify-content-between align-items-center">
    <h1>{{ title }}</h1>
    <div class="mb-2 text-right">
      <router-link
        v-if="createLink"
        :to="createLink"
        class="btn btn-outline-primary"
      >
        <fa :icon="['fas', 'plus']" />
        <span class="desktop-only">Create</span>
      </router-link>
      <slot name="actions" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ListHeader',
  props: {
    title: {
      type: String,
      required: true
    },
    createLink: {
      type: String,
      default: null
    }
  }
}
</script>