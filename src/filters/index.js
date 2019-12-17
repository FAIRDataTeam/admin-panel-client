import moment from 'moment'
import Vue from 'vue'

Vue.filter('formatDateTime', (timestamp) => moment(timestamp).format('DD. MM. YYYY, hh:mm'))


Vue.filter('formatDuration', (duration) => {
  if (duration === null) {
    return '-'
  }
  const seconds = duration % 60
  const minutes = Math.floor(duration / 60)
  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
})
