export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="auth-shell">
      <aside className="auth-aside">
        <div className="auth-brand">
          <span className="brand-mark">+</span>
          <span className="brand-text">
            Medi<span>Slot</span>
          </span>
        </div>

        <div className="auth-copy">
          <p className="eyebrow">Smart appointment management</p>
          <h1>Care without the waiting room.</h1>
          <p className="auth-lead">
            Book appointments, follow approvals and keep every consultation organized in one
            calm, simple place.
          </p>
        </div>

        <ul className="auth-points">
          <li>
            <span className="point-icon">01</span>
            Browse doctors and request a visit in seconds
          </li>
          <li>
            <span className="point-icon">02</span>
            Track pending, approved and rejected appointments
          </li>
          <li>
            <span className="point-icon">03</span>
            Doctors confirm schedules and review patient details
          </li>
        </ul>
      </aside>

      <main className="auth-main">
        <div className="auth-card">
          <div className="auth-card-head">
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>
          {children}
          {footer && <div className="auth-footer">{footer}</div>}
        </div>
      </main>
    </div>
  )
}
