import request from './request'
import router from '../router'


const createRequestInterceptor = (store) => {
  request.interceptors.request.use((oldConfig) => {
    const config = { ...oldConfig }

    const token = store.getters['auth/token']
    if (token) {
      config.headers.common.Authorization = `Bearer ${token}`
    }

    return config
  }, null)
}


const createResponseInterceptor = (store) => {
  request.interceptors.response.use(null, async (error) => {
    const { status } = error.response
    if (status === 401) {
      store.dispatch('auth/logout')
      await router.push('/login')
    } else {
      throw error
    }
  })
}


const plugin = (store) => {
  createRequestInterceptor(store)
  createResponseInterceptor(store)
}

export default plugin
