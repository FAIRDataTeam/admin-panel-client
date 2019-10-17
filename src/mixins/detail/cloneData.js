export default {
  name: 'cloneData',

  methods: {
    cloneData(data) {
      // implemented in component that uses this mixin
    },

    cloneRedirectLocation(id) {
      // implemented in component that uses this mixin
    },

    makeCopy() {
      this.status.setPending()

      this.cloneData(this.data)
        .then(response => {
          this.status.setDone()
          this.$router.replace(this.cloneRedirectLocation(response.data.uuid))
        })
        .catch(() => this.status.setError(`Unable to make a copy of ${this.data.name}.`))
    }
  }
}