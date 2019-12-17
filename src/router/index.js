import Vue from 'vue'
import VueRouter from 'vue-router'
import ApplicationCreate from '../views/ApplicationCreate'
import ApplicationDetail from '../views/ApplicationDetail'
import ApplicationList from '../views/ApplicationList'
import InstanceList from '../views/InstanceList'
import InstanceDetail from '../views/InstanceDetail'
import InstanceCreate from '../views/InstanceCreate'
import Login from '../views/Login'
import NotFound from '../views/NotFound'
import PipelineDetail from '../views/PipelineDetail'
import PipelineList from '../views/PipelineList'
import ServerDetail from '../views/ServerDetail'
import ServerCreate from '../views/ServerCreate'
import ServerList from '../views/ServerList'
import UserCreate from '../views/UserCreate'
import UserDetail from '../views/UserDetail'
import UserList from '../views/UserList'

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
  { path: '*', component: NotFound },
]

const router = new VueRouter({
  mode: 'history',
  linkExactActiveClass: 'active',
  base: process.env.BASE_URL,
  routes,
})

export default router
