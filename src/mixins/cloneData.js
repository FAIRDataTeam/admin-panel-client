// Can be used only with FetchData mixin
export default {
  name: 'cloneData',

  methods: {
    cloneData(data) {
      // implemented in component that uses this mixin
    },

    makeCopy(data) {
      this.cloneData(data)
        .then(() => this.fetchData())
        .catch(() => this.error = `Unable to make a copy of ${data.name}.`)
    }
  }
}