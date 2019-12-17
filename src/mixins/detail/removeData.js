export default {
  name: 'removeData',

  methods: {
    async remove() {
      if (window.confirm(`Are you sure you want to delete ${this.getName(this.data)}?`)) {
        try {
          this.status.setPending()
          await this.deleteData(this.data)
          await this.$router.replace(this.removeRedirectLocation())
        } catch (error) {
          this.status.setError(`Unable to delete ${this.getName(this.data)}`)
        }
      }
    },
  },
}
