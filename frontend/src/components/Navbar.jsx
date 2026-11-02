import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { auth, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">+</span>
          <span className="brand-text">
            Medi<span>Slot</span>
          </span>
        </Link>

        {auth && (
          <div className="navbar-user">
            <div className="navbar-identity">
              <span className="avatar">{auth.name?.charAt(0)?.toUpperCase() || 'U'}</span>
              <div>
                <p className="navbar-name">{auth.name}</p>
                <p className="navbar-role">{auth.role?.toLowerCase()}</p>
              </div>
            </div>
            <button type="button" className="btn btn-ghost" onClick={handleLogout}>
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
