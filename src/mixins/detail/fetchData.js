import Status from '../../utils/Status'

export default {
  name: 'fetchData',

  data() {
    return {
      status: new Status(),
      data: null,
      dataName: null
    }
  },

  watch: {
    '$route': 'fetchData'
  },

  created() {
    this.fetchData()
  },

  methods: {
    getData(id) {
      // implemented in component that uses this mixin
    },

    fetchData() {
      this.status.setPending()

      this.getData(this.$route.params.id)
        .then(response => {
          this.data = response.data
          this.dataName = this.data.name
          this.status.setDone()
        })
        .catch(error => this.status.setError(error.toString()))
    }
  }
}
