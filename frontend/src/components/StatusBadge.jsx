export default function StatusBadge({ status }) {
  const value = status || 'PENDING'
  return <span className={`badge badge-${value.toLowerCase()}`}>{value}</span>
}
