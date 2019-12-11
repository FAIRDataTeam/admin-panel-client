import moment from 'moment'
import Vue from 'vue'

Vue.filter('formatDateTime', function(timestamp) {
  return moment(timestamp).format('DD. MM. YYYY, hh:mm')
})


Vue.filter('formatDuration', function (duration) {
  if (duration === null) {
    return '-'
  }
  const seconds = duration % 60
  const minutes = Math.floor(duration / 60)
  return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`
})
