export default {
  name: 'submitData',

  data() {
    return {
      editing: false
    }
  },

  methods: {
    putData(data) {
      // implemented in component that uses this mixin
    },

    edit() {
      this.editing = true
    },

    cancelEdit() {
      this.editing = false
      this.fetchData()
    },

    async submit() {
      this.$v.data.$touch()

      if (!this.$v.data.$invalid) {
        try {
          this.status.setPending()
          await this.putData(this.data)
          this.status.setDone()
          this.editing = false
          this.dataName = this.data.name
        } catch (error) {
          this.status.setError(`Unable to save ${this.dataName}.`)
        }
      }
    }
  }
}
