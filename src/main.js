import Vue from 'vue'
import Vuelidate from 'vuelidate'
import VueRouter from 'vue-router'
import BootstrapVue from 'bootstrap-vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import * as far from '@fortawesome/free-regular-svg-icons'
import * as fas from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import 'prismjs'
import 'prismjs/components/prism-scss'
import 'prismjs/themes/prism.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import './style.css'

import App from './App.vue'
import routes from './routes'
import Loader from './components/Loader'

Vue.config.productionTip = false

Vue.use(Vuelidate)
Vue.use(VueRouter)
Vue.use(BootstrapVue)

library.add([ far.faTrashAlt, far.faCopy, far.faFileAlt, fas.faEllipsisV, fas.faPlus, fas.faSpinner, fas.faPen, fas.faPlay, fas.faSyncAlt, far.faSave ])

Vue.component('fa', FontAwesomeIcon)
Vue.component('loader', Loader)

const router = new VueRouter({
  mode: 'history',
  linkExactActiveClass: 'active',
  routes
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
