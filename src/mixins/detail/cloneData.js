export default {
  name: 'cloneData',

  methods: {
    async makeCopy() {
      try {
        this.status.setPending()
        const response = await this.cloneData(this.data)
        this.status.setDone()
        await this.$router.replace(this.cloneRedirectLocation(response.data.uuid))
      } catch (error) {
        this.status.setError(`Unable to make a copy of ${this.data.name}.`)
      }
    },
  },
}
