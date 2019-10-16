import InstanceList from './pages/InstanceList.vue'
import InstanceDetail from './pages/InstanceDetail.vue'
import InstanceCreate from './pages/InstanceCreate.vue'
import Login from './pages/Login.vue'
import NotFound from './pages/NotFound.vue'
import ServerDetail from './pages/ServerDetail.vue'
import ServerCreate from './pages/ServerCreate.vue'
import ServerList from './pages/ServerList.vue'

const routes = [
  { path: '/', redirect: '/instances' },
  { path: '/login', component: Login, name: 'login' },
  { path: '/instances', component: InstanceList },
  { path: '/instances/create', component: InstanceCreate },
  { path: '/instances/:id', component: InstanceDetail },
  { path: '/servers', component: ServerList },
  { path: '/servers/create', component: ServerCreate },
  { path: '/servers/:id', component: ServerDetail },
  { path: '*', component: NotFound }
]

export default routes