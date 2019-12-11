import Status from '../../utils/Status'

export default {
  name: 'fetchData',

  data() {
    return {
      status: new Status(),
      data: null,
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

    async fetchData() {
      try {
        this.status.setPending()
        const response = await this.getData()
        this.data =  response.data
        this.status.setDone()
      } catch (error) {
        this.status.setError(error.toString())
      }
    }
  }
}
