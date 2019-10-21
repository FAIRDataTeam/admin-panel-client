<template>
  <div>
    <div class="card bg-light">
      <div class="card-header">
        Login
      </div>
      <div class="card-body">
        <form @submit.prevent="submit">
          <status-flash
            :status="status"
            no-loading
          />
          <div class="form-group">
            <label>Email</label>
            <input
              v-model="email"
              class="form-control"
            >
          </div>
          <div class="form-group">
            <label>Password</label>
            <input
              v-model="password"
              class="form-control"
              type="password"
            >
          </div>
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="status.isPending()"
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchToken } from '../api'
import Status from '../utils/Status'

export default {
  name: 'Login',

  data() {
    return {
      email: '',
      password: '',
      status: new Status()
    }
  },

  methods: {
    submit() {
      this.status.setPending()

      fetchToken(this.email, this.password)
        .then(response => {
          this.$emit('authenticated', response.data)
        })
        .catch(() => this.status.setError('Login failed.'))

    }
  }
}
</script>
<style scoped>
.card {
  max-width: 25rem;
  margin: auto;
}

@media (min-width: 768px) {
  .card {
    margin-top: 4rem;
  }
}

.card-header {
  font-weight: bold;
}
</style>