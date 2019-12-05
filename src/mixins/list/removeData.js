// Can be used only with FetchData mixin
export default {
  name: 'removeData',

  methods: {
    deleteData(data) {
      // implemented in component that uses this mixin
    },

    async remove(data) {
      if (window.confirm(`Are you sure you want to delete ${data.name}?`)) {
        try {
          await this.deleteData(data)
          await this.fetchData()
        } catch (error) {
          this.status.setError(`Unable to delete ${data.name}`)
        }
      }
    }
  }
}