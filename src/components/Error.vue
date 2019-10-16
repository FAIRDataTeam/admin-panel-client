<template>
  <div
    v-if="message"
    class="alert alert-danger"
  >
    {{ message }}
  </div>
</template>
<script>
export default {
  name: 'Error',

  props: {
    message: {
      type: String,
      required: true
    }
  }
}
</script>
