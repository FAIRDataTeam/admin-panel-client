// Can be used only with FetchData mixin
export default {
  name: 'cloneData',

  methods: {
    async makeCopy(data) {
      try {
        this.addLoading(data.uuid)
        await this.cloneData(data)
        await this.fetchData()
        this.status.setDone(`Copy of ${this.getName(data)} was successfully created.`)
      } catch (error) {
        this.status.setError(`Unable to make a copy of ${this.getName(data)}.`)
      } finally {
        this.removeLoading(data.uuid)
      }
    },
  },
}
