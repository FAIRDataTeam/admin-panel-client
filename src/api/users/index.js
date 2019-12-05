import request from '../request'

export default {
  getUsers() {
    return request.get('/users')
  },

  getUser(uuid) {
    return request.get(`/users/${uuid}`)
  },

  postUser(user) {
    return request.post('/users', user)
  },

  putUser(user) {
    return request.put(`/users/${user.uuid}`, user)
  },

  deleteUser(user) {
    return request.delete(`/users/${user.uuid}`)
  },

  putUserPassword(user, password) {
    return request.put(`/users/${user.uuid}/password`, { password })
  }
}
