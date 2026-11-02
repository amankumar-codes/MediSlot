import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ role, children }) {
  const { auth } = useAuth()
  const location = useLocation()

  if (!auth) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (role && auth.role !== role) {
    return <Navigate to={auth.role === 'DOCTOR' ? '/doctor' : '/patient'} replace />
  }

  return children
}
