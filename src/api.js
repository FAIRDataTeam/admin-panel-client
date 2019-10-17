import axios from 'axios'

import { getUserToken } from './localStorage'

const apiUrl = window.config.apiUrl || 'http://localhost:3000'

export function fetchToken(email, password) {
  return axios.post(`${apiUrl}/tokens`, { email, password })
}

export function getInstances() {
  return get('/instances')
}

export function getInstance(uuid) {
  return get(`/instances/${uuid}`)
}

export function postInstance(instance) {
  return post('/instances', instance)
}

export function putInstance(instance) {
  return put(`/instances/${instance.uuid}`, instance)
}

export function deleteInstance(instance) {
  return deleteApi(`/instances/${instance.uuid}`)
}

export function deployInstance(instance) {
  return post(`/instances/${instance.uuid}/deployments`, {})
}

export function disposeInstance(instance) {
  return deleteApi(`/instances/${instance.uuid}/deployments`)
}

export function cloneInstance(instance) {
  return post(`/instances?source=${instance.uuid}`, null)
}

export function getServers() {
  return get('/servers')
}

export function getServer(uuid) {
  return get(`/servers/${uuid}`)
}

export function postServer(server) {
  return post('/servers', server)
}

export function putServer(server) {
  return put(`/servers/${server.uuid}`, server)
}

export function deleteServer(server) {
  return deleteApi(`/servers/${server.uuid}`)
}

export function getApplications() {
  return get('/applications')
}

export function getApplication(uuid) {
  return get(`/applications/${uuid}`)
}

export function postApplication(application) {
  return post('/applications', application)
}

export function putApplication(application) {
  return put(`/applications/${application.uuid}`, application)
}

export function deleteApplication(application) {
  return deleteApi(`/applications/${application.uuid}`)
}

export function cloneApplication(application) {
  return post(`/applications?source=${application.uuid}`, null)
}

function get(url) {
  return axios.get(`${apiUrl}${url}`, {
    headers: { Authorization: 'Bearer ' + getUserToken() }
  })
}

function post(url, data) {
  return axios.post(`${apiUrl}${url}`, data, {
    headers: {
      Authorization: 'Bearer ' + getUserToken(),
      'Content-Type': 'application/json'
    }
  })
}

function put(url, data) {
  return axios.put(`${apiUrl}${url}`, data, {
    headers: { Authorization: 'Bearer ' + getUserToken() }
  })
}

function deleteApi(url) {
  return axios.delete(`${apiUrl}${url}`, {
    headers: { Authorization: 'Bearer ' + getUserToken() }
  })
}
