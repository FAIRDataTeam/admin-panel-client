import _ from 'lodash'
import api from '../api'

function awaitPipeline(uuid, doneCallback, errorCallback, tickCallback = null) {
  const interval = setInterval(async () => {
    const pipeline = await api.pipelines.getPipeline(uuid)
    if (tickCallback) {
      tickCallback(pipeline.data)
    }

    if (pipeline.data.status === 'DONE') {
      clearInterval(interval)
      doneCallback()
    } else if (pipeline.data.status === 'ERROR') {
      clearInterval(interval)
      errorCallback()
    }
  }, 1000)
}


function pipelineTitle(pipeline) {
  return `${_.capitalize(pipeline.type)} of ${pipeline.instance.name}`
}


export default {
  awaitPipeline,
  pipelineTitle,
}
