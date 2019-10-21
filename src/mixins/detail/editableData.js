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

    submit() {
      this.$v.data.$touch()

      if (!this.$v.data.$invalid) {
        this.status.setPending()
        this.putData(this.data)
          .then(() => {
            this.status.setDone()
            this.editing = false
            this.dataName = this.data.name
          })
          .catch(() => this.status.setError(`Unable to save ${this.dataName}.`))
      }
    }
  }
}