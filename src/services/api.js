import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
  paramsSerializer: params => {
    const search = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
      if (Array.isArray(value)) {
        value.forEach(v => search.append(key, v))
      } else if (value !== undefined && value !== null && value !== '') {
        search.append(key, value)
      }
    }
    return search.toString()
  }
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('zeport_token')
      localStorage.removeItem('zeport_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
