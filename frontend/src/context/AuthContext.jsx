import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api, { STORAGE_KEY } from '../api/client'

const AuthContext = createContext(null)

function readStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStoredAuth)

  useEffect(() => {
    const handleUnauthorized = () => setAuth(null)
    window.addEventListener('medislot:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('medislot:unauthorized', handleUnauthorized)
  }, [])

  const persist = (nextAuth) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAuth))
    setAuth(nextAuth)
    return nextAuth
  }

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    return persist({ token: data.token, name: data.name, role: data.role, email })
  }

  const register = async ({ name, email, password }) => {
    await api.post('/auth/register', { name, email, password })
    return login(email, password)
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setAuth(null)
  }

  const value = useMemo(() => ({ auth, login, register, logout }), [auth])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
