import Vue from 'vue'
import Vuelidate from 'vuelidate'
import BootstrapVue from 'bootstrap-vue'
import 'prismjs'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-scss'
import 'prismjs/components/prism-yaml'
import 'prismjs/themes/prism.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import './style.css'
import App from './App.vue'
import StatusFlash from './components/StatusFlash'
import router from './router'
import store from './store'
import './initFontAwesome'

Vue.config.productionTip = false

Vue.use(Vuelidate)
Vue.use(BootstrapVue)


Vue.component('fa', FontAwesomeIcon)
Vue.component('status-flash', StatusFlash)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
