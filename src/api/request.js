import axios from 'axios'

const request = axios.create({
  baseURL: window.config.apiUrl || 'http://localhost:3000',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

export default request
