import api from '../api'

function awaitPipeline(uuid, doneCallback, errorCallback) {
  const interval = setInterval(async () => {
    const pipeline = await api.pipelines.getPipeline(uuid)
    if (pipeline.data.status === 'DONE') {
      clearInterval(interval)
      doneCallback()
    } else if (pipeline.data.status === 'ERROR') {
      clearInterval(interval)
      errorCallback()
    }
  }, 1000)
}


export default {
  awaitPipeline,
}
