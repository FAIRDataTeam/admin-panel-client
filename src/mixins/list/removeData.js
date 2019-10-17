// Can be used only with FetchData mixin
export default {
  name: 'removeData',

  methods: {
    deleteData(data) {
      // implemented in component that uses this mixin
    },

    remove(data) {
      if (window.confirm(`Are you sure you want to delete ${data.name}?`)) {
        this.deleteData(data)
          .then(() => this.fetchData())
          .catch(() => this.status.setError(`Unable to delete ${data.name}`))
      }
    }
  }
}