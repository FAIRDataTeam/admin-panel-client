import Vue from 'vue'
import VueRouter from 'vue-router'
import ApplicationCreate from '../views/ApplicationCreate/index'
import ApplicationDetail from '../views/ApplicationDetail/index'
import ApplicationList from '../views/ApplicationList/index'
import InstanceList from '../views/InstanceList/index.vue'
import InstanceDetail from '../views/InstanceDetail/index.vue'
import InstanceCreate from '../views/InstanceCreate/index.vue'
import Login from '../views/Login/index.vue'
import NotFound from '../views/NotFound/index.vue'
import PipelineDetail from '../views/PipelineDetail/index'
import PipelineList from '../views/PipelineList/index'
import ServerDetail from '../views/ServerDetail/index.vue'
import ServerCreate from '../views/ServerCreate/index.vue'
import ServerList from '../views/ServerList/index.vue'
import UserCreate from '../views/UserCreate/index'
import UserDetail from '../views/UserDetail/index'
import UserList from '../views/UserList/index'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/instances' },
  { path: '/applications', component: ApplicationList },
  { path: '/applications/create', component: ApplicationCreate },
  { path: '/applications/:id', component: ApplicationDetail },
  { path: '/instances', component: InstanceList },
  { path: '/instances/create', component: InstanceCreate },
  { path: '/instances/:id', component: InstanceDetail },
  { path: '/login', component: Login, name: 'login' },
  { path: '/pipelines', component: PipelineList },
  { path: '/pipelines/:id', component: PipelineDetail },
  { path: '/servers', component: ServerList },
  { path: '/servers/create', component: ServerCreate },
  { path: '/servers/:id', component: ServerDetail },
  { path: '/users', component: UserList },
  { path: '/users/create', component: UserCreate },
  { path: '/users/:id', component: UserDetail },
  { path: '*', component: NotFound }
]

const router = new VueRouter({
  mode: 'history',
  linkExactActiveClass: 'active',
  base: process.env.BASE_URL,
  routes,
})

export default router