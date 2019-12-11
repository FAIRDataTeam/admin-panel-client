// Can be used only with FetchData mixin
export default {
  name: 'removeData',

  methods: {
    deleteData(data) {
      // implemented in component that uses this mixin
    },

    async remove(data) {
      if (window.confirm(`Are you sure you want to delete ${this.getName(data)}?`)) {
        try {
          this.addLoading(data.uuid)
          await this.deleteData(data)
          await this.fetchData()
          this.status.setDone(`${this.getName(data)} was successfully removed.`)
        } catch (error) {
          this.status.setError(`Unable to delete ${this.getName(data)}.`)
        } finally {
          this.removeLoading(data.uuid)
        }
      }
    }
  }
}