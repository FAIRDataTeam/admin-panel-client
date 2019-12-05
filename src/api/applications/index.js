import request from '../request'

export default {
  getApplications() {
    return request.get('/applications')
  },

  getApplication(uuid) {
    return request.get(`/applications/${uuid}`)
  },

  postApplication(application) {
    return request.post('/applications', application)
  },

  putApplication(application) {
    return request.put(`/applications/${application.uuid}`, application)
  },

  deleteApplication(application) {
    return request.delete(`/applications/${application.uuid}`)
  },

  cloneApplication(application) {
    return request.post(`/applications?source=${application.uuid}`, null)
  }
}
