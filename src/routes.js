import ApplicationCreate from './pages/ApplicationCreate'
import ApplicationDetail from './pages/ApplicationDetail'
import ApplicationList from './pages/ApplicationList'
import InstanceList from './pages/InstanceList.vue'
import InstanceDetail from './pages/InstanceDetail.vue'
import InstanceCreate from './pages/InstanceCreate.vue'
import Login from './pages/Login.vue'
import NotFound from './pages/NotFound.vue'
import ServerDetail from './pages/ServerDetail.vue'
import ServerCreate from './pages/ServerCreate.vue'
import ServerList from './pages/ServerList.vue'
import UserCreate from './pages/UserCreate'
import UserDetail from './pages/UserDetail'
import UserList from './pages/UserList'

export default [
  { path: '/', redirect: '/instances' },
  { path: '/applications', component: ApplicationList },
  { path: '/applications/create', component: ApplicationCreate },
  { path: '/applications/:id', component: ApplicationDetail },
  { path: '/instances', component: InstanceList },
  { path: '/instances/create', component: InstanceCreate },
  { path: '/instances/:id', component: InstanceDetail },
  { path: '/login', component: Login, name: 'login' },
  { path: '/servers', component: ServerList },
  { path: '/servers/create', component: ServerCreate },
  { path: '/servers/:id', component: ServerDetail },
  { path: '/users', component: UserList },
  { path: '/users/create', component: UserCreate },
  { path: '/users/:id', component: UserDetail },
  { path: '*', component: NotFound }
]
