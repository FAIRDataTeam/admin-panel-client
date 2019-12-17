import Vue from 'vue'
import Vuelidate from 'vuelidate'
import BootstrapVue from 'bootstrap-vue'
import 'prismjs'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-scss'
import 'prismjs/components/prism-yaml'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import './scss/main.scss'
import App from './App'
import StatusFlash from './components/StatusFlash'
import router from './router'
import store from './store'
import './initFontAwesome'
import './filters'

Vue.config.productionTip = false

Vue.use(Vuelidate)
Vue.use(BootstrapVue)


Vue.component('fa', FontAwesomeIcon)
Vue.component('status-flash', StatusFlash)

document.title = window.config.title

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
