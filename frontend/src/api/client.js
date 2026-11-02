import axios from 'axios'

export const STORAGE_KEY = 'medislot.auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
})

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw) {
    try {
      const { token } = JSON.parse(raw)
      if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEY)
      window.dispatchEvent(new Event('medislot:unauthorized'))
    }
    return Promise.reject(error)
  },
)

export function getErrorMessage(error) {
  const data = error?.response?.data
  if (!data) return error?.message || 'Something went wrong. Please try again.'
  if (typeof data === 'string') return data
  if (data.message) return data.message
  if (data.error) return data.error
  if (data.errors) return Object.values(data.errors).join(', ')
  return 'Something went wrong. Please try again.'
}

export default api
