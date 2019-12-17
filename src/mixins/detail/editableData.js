export default {
  name: 'submitData',

  data() {
    return {
      editing: false,
    }
  },

  methods: {
    edit() {
      this.editing = true
    },

    cancelEdit() {
      this.editing = false
      this.fetchData()
    },

    async submit() {
      try {
        this.status.setPending()
        await this.putData(this.data)
        this.status.setDone()
        this.editing = false
        this.dataName = this.data.name
      } catch (error) {
        this.status.setError(`Unable to save ${this.dataName}.`)
      }
    },
  },
}
