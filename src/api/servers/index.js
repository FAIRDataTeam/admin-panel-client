import request from '../request'

export default {
  getServers() {
    return request.get('/servers')
  },

  getServer(uuid) {
    return request.get(`/servers/${uuid}`)
  },

  postServer(server) {
    return request.post('/servers', server)
  },

  putServer(server) {
    return request.put(`/servers/${server.uuid}`, server)
  },

  deleteServer(server) {
    return request.delete(`/servers/${server.uuid}`)
  }
}
