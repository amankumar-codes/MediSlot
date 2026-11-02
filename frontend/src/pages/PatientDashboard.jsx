import { useCallback, useEffect, useState } from 'react'
import Alert from '../components/Alert'
import StatusBadge from '../components/StatusBadge'
import api, { getErrorMessage } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { formatDate } from '../utils/date'

function initials(name) {
  if (!name) return 'DR'
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

function PatientProfileForm({ onSaved }) {
  const [form, setForm] = useState({ age: '', mobile: '' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSaving(true)
    try {
      await api.post('/patient/patients', {
        age: Number(form.age),
        mobile: form.mobile,
      })
      onSaved()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="panel setup-panel">
      <div className="setup-icon">+</div>
      <div className="setup-copy">
        <h2>Complete your patient profile</h2>
        <p>
          We need a few details before you can request appointments. This information is shared
          only with the doctor you book.
        </p>
      </div>

      <form className="form setup-form" onSubmit={handleSubmit}>
        <Alert>{error}</Alert>

        <div className="field-row">
          <label className="field">
            <span>Age</span>
            <input
              type="number"
              name="age"
              min="1"
              max="120"
              value={form.age}
              onChange={handleChange}
              placeholder="e.g. 28"
              required
            />
          </label>

          <label className="field">
            <span>Mobile number</span>
            <input
              type="tel"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              placeholder="10 digit number"
              pattern="[0-9]{10}"
              maxLength={10}
              title="Enter a 10 digit mobile number"
              required
            />
          </label>
        </div>

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving profile...' : 'Save profile'}
        </button>
      </form>
    </div>
  )
}

export default function PatientDashboard() {
  const { auth } = useAuth()
  const [profileState, setProfileState] = useState('loading')
  const [doctors, setDoctors] = useState([])
  const [appointments, setAppointments] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [bookingId, setBookingId] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  const loadAppointments = useCallback(async () => {
    const { data } = await api.get('/patient/appointments/me')
    setAppointments(data)
  }, [])

  const loadDashboard = useCallback(async () => {
    setError('')
    setProfileState('loading')
    try {
      const { data: isPatient } = await api.get('/patient/is-patient')
      if (!isPatient) {
        setProfileState('needs-profile')
        return
      }
      const [doctorsResponse] = await Promise.all([
        api.get('/patient/doctor'),
        loadAppointments(),
      ])
      setDoctors(doctorsResponse.data)
      setProfileState('ready')
    } catch (err) {
      setError(getErrorMessage(err))
      setProfileState('ready')
    }
  }, [loadAppointments])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  const handleRefresh = async () => {
    setRefreshing(true)
    setSuccess('')
    try {
      await Promise.all([api.get('/patient/doctor').then((res) => setDoctors(res.data)), loadAppointments()])
      setError('')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setRefreshing(false)
    }
  }

  const handleBook = async (doctor) => {
    setBookingId(doctor.id)
    setError('')
    setSuccess('')
    try {
      await api.post(`/patient/appointments/${doctor.id}`)
      await loadAppointments()
      setSuccess(`Appointment requested with Dr. ${doctor.name}. Waiting for confirmation.`)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setBookingId(null)
    }
  }

  const pending = appointments.filter((item) => item.status === 'PENDING').length
  const approved = appointments.filter((item) => item.status === 'APPROVED').length
  const rejected = appointments.filter((item) => item.status === 'REJECTED').length

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Patient dashboard</p>
          <h1>Hello, {auth.name?.split(' ')[0] || 'there'}</h1>
          <p className="page-subtitle">Find a doctor, request a visit and follow your appointments.</p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={handleRefresh} disabled={refreshing}>
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <Alert onClose={() => setError('')}>{error}</Alert>
      <Alert type="success" onClose={() => setSuccess('')}>
        {success}
      </Alert>

      {profileState === 'loading' && (
        <div className="panel state-panel">
          <span className="spinner" />
          Loading your dashboard...
        </div>
      )}

      {profileState === 'needs-profile' && (
        <PatientProfileForm
          onSaved={async () => {
            setSuccess('Profile saved. You can now book appointments.')
            await loadDashboard()
          }}
        />
      )}

      {profileState === 'ready' && (
        <>
          <section className="stat-grid">
            <div className="stat-card">
              <span className="stat-label">Total appointments</span>
              <span className="stat-value">{appointments.length}</span>
            </div>
            <div className="stat-card stat-pending">
              <span className="stat-label">Pending</span>
              <span className="stat-value">{pending}</span>
            </div>
            <div className="stat-card stat-approved">
              <span className="stat-label">Approved</span>
              <span className="stat-value">{approved}</span>
            </div>
            <div className="stat-card stat-rejected">
              <span className="stat-label">Rejected</span>
              <span className="stat-value">{rejected}</span>
            </div>
          </section>

          <section className="panel">
            <div className="panel-head">
              <div>
                <h2>Available doctors</h2>
                <p>Choose a doctor and send an appointment request.</p>
              </div>
            </div>

            {doctors.length === 0 ? (
              <p className="empty-state">No doctors are available right now.</p>
            ) : (
              <div className="doctor-grid">
                {doctors.map((doctor) => (
                  <article className="doctor-card" key={doctor.id}>
                    <div className="doctor-avatar">{initials(doctor.name)}</div>
                    <div className="doctor-body">
                      <h3>Dr. {doctor.name}</h3>
                      <p className="doctor-specialization">{doctor.specialization}</p>
                      <p className="doctor-availability">
                        <span>Availability</span>
                        {doctor.availability}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary btn-block"
                      onClick={() => handleBook(doctor)}
                      disabled={bookingId === doctor.id}
                    >
                      {bookingId === doctor.id ? 'Requesting...' : 'Book appointment'}
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="panel">
            <div className="panel-head">
              <div>
                <h2>My appointments</h2>
                <p>Your requests and their current status.</p>
              </div>
            </div>

            {appointments.length === 0 ? (
              <p className="empty-state">You have not requested any appointments yet.</p>
            ) : (
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Doctor</th>
                      <th>Status</th>
                      <th>Meeting date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td className="mono">#{appointment.id}</td>
                        <td>Dr. {appointment.doctorName}</td>
                        <td>
                          <StatusBadge status={appointment.status} />
                        </td>
                        <td>{formatDate(appointment.meetingTime)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}
