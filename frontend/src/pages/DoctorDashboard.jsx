import { useCallback, useEffect, useState } from 'react'
import Alert from '../components/Alert'
import StatusBadge from '../components/StatusBadge'
import api, { getErrorMessage } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { formatDate, todayInputValue } from '../utils/date'

function DoctorProfileForm({ onSaved }) {
  const [form, setForm] = useState({ specialization: '', availability: '' })
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
      await api.post('/doctor/doctors', form)
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
        <h2>Complete your doctor profile</h2>
        <p>
          Add your specialization and availability so patients can find you and request
          appointments.
        </p>
      </div>

      <form className="form setup-form" onSubmit={handleSubmit}>
        <Alert>{error}</Alert>

        <div className="field-row">
          <label className="field">
            <span>Specialization</span>
            <input
              type="text"
              name="specialization"
              value={form.specialization}
              onChange={handleChange}
              placeholder="e.g. Cardiologist"
              required
            />
          </label>

          <label className="field">
            <span>Availability</span>
            <input
              type="text"
              name="availability"
              value={form.availability}
              onChange={handleChange}
              placeholder="e.g. Mon-Fri, 10:00-17:00"
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

export default function DoctorDashboard() {
  const { auth } = useAuth()
  const [profileState, setProfileState] = useState('loading')
  const [appointments, setAppointments] = useState([])
  const [meetingTimes, setMeetingTimes] = useState({})
  const [actionId, setActionId] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [patientLoadingId, setPatientLoadingId] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  const loadAppointments = useCallback(async () => {
    const { data } = await api.get('/doctor/appointments/me')
    setAppointments(data)
  }, [])

  const loadDashboard = useCallback(async () => {
    setError('')
    setProfileState('loading')
    try {
      const { data: isDoctor } = await api.get('/doctor/is-doctor')
      if (!isDoctor) {
        setProfileState('needs-profile')
        return
      }
      await loadAppointments()
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
    try {
      await loadAppointments()
      setError('')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setRefreshing(false)
    }
  }

  const handleApprove = async (appointmentId) => {
    const meetingTime = meetingTimes[appointmentId]
    if (!meetingTime) {
      setError('Choose a meeting date before approving.')
      return
    }
    setActionId(appointmentId)
    setError('')
    setSuccess('')
    try {
      await api.put(`/doctor/appointments/${appointmentId}/approval`, { meetingTime })
      await loadAppointments()
      setMeetingTimes((current) => ({ ...current, [appointmentId]: '' }))
      setSuccess(`Appointment #${appointmentId} approved.`)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setActionId(null)
    }
  }

  const handleReject = async (appointmentId) => {
    setActionId(appointmentId)
    setError('')
    setSuccess('')
    try {
      await api.put(`/doctor/appointments/${appointmentId}/rejection`)
      await loadAppointments()
      setSuccess(`Appointment #${appointmentId} rejected.`)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setActionId(null)
    }
  }

  const handleViewPatient = async (appointmentId) => {
    setPatientLoadingId(appointmentId)
    setError('')
    try {
      const { data } = await api.get(`/doctor/appointments/${appointmentId}/patient`)
      setSelectedPatient(data)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setPatientLoadingId(null)
    }
  }

  const pending = appointments.filter((item) => item.status === 'PENDING').length
  const approved = appointments.filter((item) => item.status === 'APPROVED').length
  const rejected = appointments.filter((item) => item.status === 'REJECTED').length

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Doctor dashboard</p>
          <h1>Welcome, Dr. {auth.name?.split(' ')[0] || ''}</h1>
          <p className="page-subtitle">Review requests, confirm schedules and check patient details.</p>
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
        <DoctorProfileForm
          onSaved={async () => {
            setSuccess('Profile saved. Your patients can now find you.')
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
                <h2>Appointment requests</h2>
                <p>Approve with a meeting date or reject the request.</p>
              </div>
            </div>

            {appointments.length === 0 ? (
              <p className="empty-state">No appointment requests yet.</p>
            ) : (
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Patient</th>
                      <th>Status</th>
                      <th>Meeting date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td className="mono">#{appointment.id}</td>
                        <td>{appointment.patientName}</td>
                        <td>
                          <StatusBadge status={appointment.status} />
                        </td>
                        <td>{formatDate(appointment.meetingTime)}</td>
                        <td>
                          <div className="row-actions">
                            <button
                              type="button"
                              className="btn btn-small btn-ghost"
                              onClick={() => handleViewPatient(appointment.id)}
                              disabled={patientLoadingId === appointment.id}
                            >
                              {patientLoadingId === appointment.id ? 'Loading...' : 'View patient'}
                            </button>

                            {appointment.status === 'PENDING' && (
                              <>
                                <input
                                  type="date"
                                  className="date-input"
                                  min={todayInputValue()}
                                  value={meetingTimes[appointment.id] || ''}
                                  onChange={(event) =>
                                    setMeetingTimes((current) => ({
                                      ...current,
                                      [appointment.id]: event.target.value,
                                    }))
                                  }
                                  aria-label={`Meeting date for appointment ${appointment.id}`}
                                />
                                <button
                                  type="button"
                                  className="btn btn-small btn-success"
                                  onClick={() => handleApprove(appointment.id)}
                                  disabled={actionId === appointment.id}
                                >
                                  Approve
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-small btn-danger"
                                  onClick={() => handleReject(appointment.id)}
                                  disabled={actionId === appointment.id}
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}

      {selectedPatient && (
        <div className="modal-backdrop" onClick={() => setSelectedPatient(null)}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label="Patient details"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-head">
              <h2>Patient details</h2>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setSelectedPatient(null)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <dl className="detail-list">
              <div>
                <dt>Name</dt>
                <dd>{selectedPatient.name}</dd>
              </div>
              <div>
                <dt>Age</dt>
                <dd>{selectedPatient.age}</dd>
              </div>
              <div>
                <dt>Mobile</dt>
                <dd>{selectedPatient.mobile}</dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </div>
  )
}
