<template>
    <div>
      <div class="card bg-light">
        <div class="card-header">Login</div>
        <div class="card-body">
          <form @submit.prevent="submit">
            <div class="alert alert-danger" v-if="submitStatus === 'ERROR'">
              Login failed.
            </div>
            <div class="form-group">
              <label>Email</label>
              <input v-model="email" class="form-control">
            </div>
            <div class="form-group">
              <label>Password</label>
              <input v-model="password" class="form-control" type="password">
            </div>
            <button type="submit" class="btn btn-primary" :disabled="submitStatus === 'PENDING'">Log in</button>
          </form>
        </div>
      </div>
    </div>
</template>

<script>
import { fetchToken } from '../api'

export default {
  name: 'Login',

  data() {
    return {
      email: '',
      password: '',
      submitStatus: null
    }
  },

  methods: {
    submit() {
      this.submitStatus = 'PENDING'

      fetchToken(this.email, this.password)
        .then(response => {
          this.$emit('authenticated', response.data)
        })
        .catch(() => this.submitStatus = 'ERROR')

    }
  }
}
</script>
<style scoped>
.card {
  max-width: 25rem;
  margin: auto;
  margin-top: 4rem;
}

.card-header {
  font-weight: bold;
}
</style>