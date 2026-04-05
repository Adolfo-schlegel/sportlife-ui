import axios from 'axios'

const API_BASE = 'https://tmntech.ddns.net/sportlife-api/api'

const client = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor: attach token
client.interceptors.request.use(config => {
  const token = localStorage.getItem('sportlife_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor: handle 401
client.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sportlife_token')
      localStorage.removeItem('sportlife_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default client
