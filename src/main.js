import Vue from 'vue'
import Vuelidate from 'vuelidate'
import VueRouter from 'vue-router'
import BootstrapVue from 'bootstrap-vue'

import 'prismjs'
import 'prismjs/components/prism-scss'
import 'prismjs/themes/prism.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import './style.css'

import App from './App.vue'
import routes from './routes'
import Loader from './components/Loader'
import Error from './components/Error'
import './initFontAwesome'

Vue.config.productionTip = false

Vue.use(Vuelidate)
Vue.use(VueRouter)
Vue.use(BootstrapVue)


Vue.component('fa', FontAwesomeIcon)
Vue.component('error', Error)
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
