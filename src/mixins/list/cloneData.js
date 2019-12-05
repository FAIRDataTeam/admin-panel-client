// Can be used only with FetchData mixin
export default {
  name: 'cloneData',

  methods: {
    cloneData(data) {
      // implemented in component that uses this mixin
    },

    async makeCopy(data) {
      try {
        await this.cloneData(data)
        await this.fetchData()
      } catch (error) {
        this.status.setError(`Unable to make a copy of ${data.name}.`)
      }
    }
  }
}
