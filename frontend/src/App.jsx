import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider, useAuth } from './context/AuthContext'
import DoctorDashboard from './pages/DoctorDashboard'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import PatientDashboard from './pages/PatientDashboard'
import Register from './pages/Register'

function HomeRedirect() {
  const { auth } = useAuth()
  if (!auth) return <Navigate to="/login" replace />
  return <Navigate to={auth.role === 'DOCTOR' ? '/doctor' : '/patient'} replace />
}

function AppLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="app-main">{children}</main>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/patient"
            element={
              <ProtectedRoute role="PATIENT">
                <AppLayout>
                  <PatientDashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor"
            element={
              <ProtectedRoute role="DOCTOR">
                <AppLayout>
                  <DoctorDashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              <AppLayout>
                <NotFound />
              </AppLayout>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
