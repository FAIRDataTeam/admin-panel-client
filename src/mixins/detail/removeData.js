export default {
  name: 'removeData',

  methods: {
    removeRedirectLocation() {
      // implemented in component that uses this mixin
    },

    deleteData(data) {
      // implemented in component that uses this mixin
    },

    remove() {
      if (window.confirm(`Are you sure you want to delete ${this.data.name}?`)) {
        this.status.setPending()
        this.deleteData(this.data)
          .then(() => this.$routes.replace(this.redirectLocation()))
          .catch(() => this.status.setError(`Unable to delete ${this.data.name}`))
      }
    }
  }
}