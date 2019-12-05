export default {
  name: 'removeData',

  methods: {
    removeRedirectLocation() {
      // implemented in component that uses this mixin
    },

    deleteData(data) {
      // implemented in component that uses this mixin
    },

    async remove() {
      if (window.confirm(`Are you sure you want to delete ${this.data.name}?`)) {
        try {
          this.status.setPending()
          await this.deleteData(this.data)
          await this.$routes.replace(this.redirectLocation())
        } catch (error) {
          this.status.setError(`Unable to delete ${this.data.name}`)
        }
      }
    }
  }
}