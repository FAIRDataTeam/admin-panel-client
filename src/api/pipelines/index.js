import request from '../request'

export default {
  deployInstance(instance) {
    return request.post('/pipelines', {
      type: 'DEPLOY',
      instanceUuid: instance.uuid
    })
  },

  disposeInstance(instance) {
    return request.post('/pipelines', {
      type: 'DISPOSE',
      instanceUuid: instance.uuid
    })
  },

  pauseInstance(instance) {
    return request.post('/pipelines', {
      type: 'PAUSE',
      instanceUuid: instance.uuid
    })
  },

  getPipelines() {
    return request.get('/pipelines')
  },

  getPipeline(uuid) {
    return request.get(`/pipelines/${uuid}`)
  }
}
