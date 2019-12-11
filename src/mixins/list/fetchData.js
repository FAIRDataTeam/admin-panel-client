import Status from '../../utils/Status'

export default {
  name: 'fetchData',

  data() {
    return {
      status: new Status(),
      data: null,
      uuidsLoading: [],
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

    getName(data) {
      return data.name
    },

    isLoading(uuid) {
      return this.uuidsLoading.filter(u => u === uuid).length > 0
    },

    addLoading(uuid) {
      this.uuidsLoading.push(uuid)
    },

    removeLoading(uuid) {
      this.uuidsLoading =this.uuidsLoading.filter(u => u !== uuid)
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
