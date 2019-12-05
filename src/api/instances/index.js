import request from '../request'

export default {
  getInstances() {
    return request.get('/instances')
  },

  getInstance(uuid) {
    return request.get(`/instances/${uuid}`)
  },

  postInstance(instance) {
    return request.post('/instances', instance)
  },

  putInstance(instance) {
    return request.put(`/instances/${instance.uuid}`, instance)
  },

  deleteInstance(instance) {
    return request.delete(`/instances/${instance.uuid}`)
  },

  cloneInstance(instance) {
    return request.post(`/instances?source=${instance.uuid}`, null)
  }
}