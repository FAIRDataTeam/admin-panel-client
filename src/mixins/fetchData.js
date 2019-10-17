export default {
  name: 'fetchData',

  data() {
    return {
      loading: false,
      data: null,
      error: null
    }
  },

  watch: {
    '$route': 'fetchData'
  },

  created() {
    this.fetchData()
  },

  methods: {
    getData() {
      // implemented in component that uses this mixin
    },

    fetchData() {
      this.error = this.data = null
      this.loading = true

      this.getData()
        .then(response => this.data = response.data)
        .catch(error => this.error = error.toString())
        .finally(() => this.loading = false)
    }
  }
}
