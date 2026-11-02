import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="page">
      <div className="panel state-panel not-found">
        <p className="eyebrow">404</p>
        <h1>Page not found</h1>
        <p>The page you are looking for does not exist.</p>
        <Link to="/" className="btn btn-primary">
          Back to dashboard
        </Link>
      </div>
    </div>
  )
}
