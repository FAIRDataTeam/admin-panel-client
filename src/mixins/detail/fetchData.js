import _ from 'lodash'
import Status from '../../utils/Status'


export default {
  name: 'fetchData',

  data() {
    return {
      status: new Status(),
      data: null,
      dataName: null,
    }
  },

  watch: {
    $route: 'fetchData',
  },

  created() {
    this.fetchData()
  },

  methods: {
    getName(data) {
      return data.name
    },

    async fetchData() {
      try {
        this.status.setPending()
        const response = await this.getData(this.$route.params.id)
        this.data = response.data
        this.dataName = this.data.name
        this.status.setDone()
      } catch (error) {
        const msg = _.get(error, 'response.data.message', 'Unable to load data.')
        this.status.setError(msg)
      }
    },
  },
}
